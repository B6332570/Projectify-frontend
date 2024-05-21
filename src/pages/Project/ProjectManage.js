import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Row, Col, Card, Modal } from 'antd';
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
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
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

  const deleteProject = async (projectId) => {
    try {
      const api = axiosWithAuth();
      console.log('Deleting project:', projectId);
      await api.delete(`/project/${projectId}`);
      message.success('Project deleted successfully');
      fetchProjects();
      setIsModalVisible(false); // Close the modal after deletion
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
      title: 'Project Name',
      dataIndex: 'projectsName',
      key: 'projectsName',
    },
    {
      title: 'Owner',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="danger" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="project-manage-content">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Project Management" bordered={false} className="custom-card">
              <Table
                columns={projectColumns}
                dataSource={projects}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
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
        okButtonProps={{ type: 'danger' }}
        className="custom-modal"
      >
        <p>Are you sure you want to delete project {selectedProject && selectedProject.projectsName}?</p>
      </Modal>
    </div>
  );
};

export default ProjectManage;
