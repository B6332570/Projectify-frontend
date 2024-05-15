import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CreateProject from './CreateProject';
import './Project.css';
import CardProject from './CardProject';
import '../../components/Sidebar.css';
import '../../components/Navbar.css';
import { Link } from 'react-router-dom';

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

const Project = () => {
  const [data, setData] = useState([]);
  const [openCreateProject, setOpenCreateProject] = useState(false);

  const handleCreateProjectClick = () => {
    setOpenCreateProject(true);
  };

  const handleCloseCreateProject = () => {
    setOpenCreateProject(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const api = axiosWithAuth();
      const projectsResponse = await api.get('/project');
      const usersResponse = await api.get('/user');

      const projects = projectsResponse.data.result;
      console.log('Projects:', projects);

      const users = usersResponse.data.result;
      console.log('Users:', users);

      const projectsWithUsername = projects.map(project => {
        const owner = users.find(user => user.id === project.userId);
        return {
          ...project,
          owner: owner ? owner.username : 'Unknown User',
        };
      });
      setData(projectsWithUsername);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectsName',
      key: 'projectsName',
      render: (text, record) => <Link to={`/project/${record.id}/task`}>{text}</Link>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'Create On',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Create By',
      dataIndex: 'owner',
      key: 'owner',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <Navbar />
      <div className="project-content">
        <Table className="custom-table" columns={columns} dataSource={data} />
        <Button onClick={handleCreateProjectClick} type="primary">Create Project</Button>
      </div>
      <CreateProject open={openCreateProject} onClose={handleCloseCreateProject} />
    </div>
  );
};

export default Project;
