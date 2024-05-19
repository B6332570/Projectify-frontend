import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, message, Row, Col, Card } from 'antd';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import './UserManage.css';

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

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskItems, setTaskItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchTaskItems();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const api = axiosWithAuth();
      const response = await api.get('/user');
      setUsers(response.data.result);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchTaskItems = async () => {
    setLoading(true);
    try {
      const api = axiosWithAuth();
      const response = await api.get('/task-item');
      setTaskItems(response.data.result);
      console.log('Fetched task items:', response.data.result);
    } catch (error) {
      console.error('Error fetching task items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeUserFromTaskItems = async (userId) => {
    try {
      const api = axiosWithAuth();
      const tasksToUpdate = taskItems.filter(taskItem => 
        taskItem.users.some(user => user.userId === userId)
      );

      console.log('Tasks to update:', tasksToUpdate);

      const updatedTasks = tasksToUpdate.map(taskItem => {
        const updatedUsers = taskItem.users
          .filter(user => user.userId !== userId)
          .map(user => user.userId); // Convert to user IDs
        console.log('Updating taskItem:', taskItem.id, 'Original users:', taskItem.users, 'Updated users:', updatedUsers);
        return { ...taskItem, users: updatedUsers };
      });

      console.log('Updated tasks before sending to server:', updatedTasks);

      await Promise.all(updatedTasks.map(async taskItem => {
        const { id, ...rest } = taskItem;
        await api.patch(`/task-item/${id}`, rest);
      }));

      console.log('Tasks updated on server.');

      // Fetch updated task items to verify removal
      const updatedResponse = await api.get('/task-item');
      const updatedData = updatedResponse.data.result;
      console.log('After removal, task items:', updatedData);
      setTaskItems(updatedData);
    } catch (error) {
      console.error('Error updating task items:', error);
      message.error('Failed to update task items');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await removeUserFromTaskItems(userId);
      const api = axiosWithAuth();
      console.log('Deleting user:', userId);
      await api.delete(`/user/${userId}`);
      message.success('User and associated user references in task items deleted successfully');
      fetchUsers();
      fetchTaskItems(); // Refresh task items after deletion
      setIsModalVisible(false); // Close modal
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const api = axiosWithAuth();
      console.log('Deleting project:', projectId);
      await api.delete(`/project/${projectId}`);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    }
  };

  const showDeleteConfirm = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
        <Button type="danger" onClick={() => deleteProject(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="user-manage-content">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="User Management" bordered={false} className="custom-card">
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                className="custom-table"
              />
            </Card>
          </Col>
          <Col span={12}>
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
        <p>Are you sure you want to delete user {selectedUser && selectedUser.username}?</p>
      </Modal>
    </div>
  );
};

export default UserManage;
