import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, message, Pagination } from 'antd';
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
  const [taskItems, setTaskItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // New state for pagination
  const usersPerPage = 12;
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  useEffect(() => {
    fetchUsers();
    fetchTaskItems();
    fetchProjects();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const api = axiosWithAuth();
      const response = await api.get('/role');
      const rolesData = Array.isArray(response.data.result) ? response.data.result : [];
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const api = axiosWithAuth();
      const response = await api.get('/user');
      const users = response.data.result;

      const usersWithImage = await Promise.all(users.map(async user => {
        const mediaResponse = await api.get(`/media-object/${user.imageId}`);
        return {
          ...user,
          imageUrl: mediaResponse.data.result[0].url,
        };
      }));

      setUsers(usersWithImage);
      console.log('Fetched users with images:', usersWithImage);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const api = axiosWithAuth();
      const response = await api.get('/project');
      setProjects(response.data.result);
      console.log('Fetched projects:', response.data.result);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
          .map(user => user.userId);
        console.log('Updating taskItem:', taskItem.id, 'Original users:', taskItem.users, 'Updated users:', updatedUsers);
        return { ...taskItem, users: updatedUsers };
      });

      console.log('Updated tasks before sending to server:', updatedTasks);

      await Promise.all(updatedTasks.map(async taskItem => {
        const { id, ...rest } = taskItem;
        await api.patch(`/task-item/${id}`, rest);
      }));

      console.log('Tasks updated on server.');

      const updatedResponse = await api.get('/task-item');
      const updatedData = updatedResponse.data.result;
      console.log('After removal, task items:', updatedData);
      setTaskItems(updatedData);
    } catch (error) {
      console.error('Error updating task items:', error);
      message.error('Failed to update task items');
    }
  };

  const deleteProjectsOfUser = async (userId) => {
    try {
      const api = axiosWithAuth();
      const userProjects = projects.filter(project => project.userId === userId);

      console.log('Projects to delete:', userProjects);

      await Promise.all(userProjects.map(async project => {
        await api.delete(`/project/${project.id}`);
      }));

      console.log('Projects deleted on server.');
    } catch (error) {
      console.error('Error deleting projects:', error);
      message.error('Failed to delete projects');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await removeUserFromTaskItems(userId);
      await deleteProjectsOfUser(userId);
      const api = axiosWithAuth();
      console.log('Deleting user:', userId);
      await api.delete(`/user/${userId}`);
      message.success('User, associated user references in task items, and projects deleted successfully');
      fetchUsers();
      fetchTaskItems();
      fetchProjects();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getRoleDisplayName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? capitalizeFirstLetter(role.role) : "Unknown Role";
  };

  const filteredUsers = users.filter(user => {
    const userRoles = user.userRoles.map(role => getRoleDisplayName(role.roleId).toLowerCase());
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           userRoles.some(role => role.includes(searchTerm.toLowerCase()));
  });
  
  
  // Calculate the users to display based on current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="flex-container  user-manage-focus">
      <Sidebar />
      <Navbar />
      <div className="user-manage-content">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"> User Management</h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              This page is dedicated to managing users, allowing for detailed viewing and deletion of user profiles.
            </p>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentUsers.map(user => (
              <div key={user.id} className="text-center text-gray-500 dark:text-gray-400">
                <img
                  crossOrigin='anonymous'
                  className="mx-auto mb-4 w-36 h-36 rounded-full"
                  src={user.imageUrl}
                  alt={`${user.username} Avatar`}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
                />
                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">{`${user.username} ${user.firstName}`}</a>
                </h3>
                <p>{user.userRoles.map(role => getRoleDisplayName(role.roleId)).join(', ')}</p> {/* Updated Role display */}
                <p>{user.email}</p>
                <Button className="delete-button" onClick={() => showDeleteConfirm(user)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <Pagination
            current={currentPage}
            pageSize={usersPerPage}
            total={filteredUsers.length}
            onChange={page => setCurrentPage(page)}
            className="mt-8"
          />
        </div>
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
        <p>Are you sure you want to delete user {selectedUser && selectedUser.username}?</p>
      </Modal>
    </div>
  );
};

export default UserManage;
