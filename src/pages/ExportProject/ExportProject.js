import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Row, Col, Card, Input } from 'antd';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import './ExportProject.css';
import { saveAs } from 'file-saver';
import ExcelButton from '../../components/ExcelButton';

const axiosWithAuth = () => {
  const token = localStorage.getItem('accessToken');
  return axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

const ExportProject = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const api = axiosWithAuth();
      const response = await api.get('/project');
      setProjects(response.data.result);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const api = axiosWithAuth();
      const response = await api.get('/user');
      setUsers(response.data.result);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  const handleExportById = async (projectId) => {
    try {
      const api = axiosWithAuth();
      const response = await api.get(`/project/export/${projectId}`, {
        responseType: 'blob',
      });
      console.log("handleExportById", response)

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `project_${projectId}.xlsx`);
    } catch (error) {
      console.error(`Error exporting project ${projectId}:`, error);
      message.error(`Failed to export project ${projectId}`);
    }
  };

  const handleExportAll = async () => {
    try {
      const api = axiosWithAuth();
      const response = await api.get('/project/export', {
        responseType: 'blob',
      });
      console.log("handleExportAll", response)

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'projects.xlsx');
    } catch (error) {
      console.error('Error exporting projects:', error);
      message.error('Failed to export projects');
    }
  };

  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'projectsName',
      key: 'projectsName',
    },
    {
      title: 'Owner',
      key: 'userId',
      render: (text, record) => getUserNameById(record.userId),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <ExcelButton
          onClick={() => handleExportById(record.id)}
        
        />
      ),
    },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectsName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="backgroundbobweb">
      <div className="flex">
        <Sidebar />
        <Navbar />
        <div className="project-manage-content">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                title="Export Project Data"
                bordered={false}
                className="export-project-custom-card"
                extra={<ExcelButton type="primary" onClick={handleExportAll}>Export All Projects</ExcelButton>}
              >
                <Input
                  placeholder="Search Project"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ marginBottom: '30px', fontSize: "18px", borderRadius: "5px"}}
                  className="export-custom-placeholder"
                />
                <Table
                  columns={projectColumns}
                  dataSource={filteredProjects}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 , className: 'custom-pagination'}}
                  className="custom-table"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ExportProject;
