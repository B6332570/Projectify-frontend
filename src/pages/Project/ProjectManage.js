import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Row, Col, Card, Modal, Input } from 'antd';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import './ProjectManage.css';

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

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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
  
  const deleteProject = async (projectId) => {
    try {
      const api = axiosWithAuth();
      await api.delete(`/project/${projectId}`);
      message.success('Project deleted successfully');
      fetchProjects();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    }
  };

  const showDeleteConfirm = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id).then(() => {
        message.success('ลบโปรเจคสำเร็จแล้ว');
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const projectColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
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
        <Button type="danger" className="custom-delete-button" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects
    .filter((project) => {
      const ownerName = getUserNameById(project.userId).toLowerCase();
      return (
        project.projectsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="backgroundbobweb">
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="project-manage-content">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Project Management" bordered={false} className="project-custom-card">
              <Input
                placeholder="Search"
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
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ className: 'custom-delete-button' }}
        className="custom-modal"
      >
        <p>Are you sure you want to delete project {selectedProject && selectedProject.projectsName}?</p>
      </Modal>
    </div>
    </div>
  );
};

export default ProjectManage;
