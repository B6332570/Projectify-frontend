import React, { useState, useEffect } from 'react';
import { Pagination, Row, Col } from 'antd';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CreateProject from './CreateProject';
import './Project.css';
import fetchProjectImage from './fetchProjectImage';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // จำนวนการ์ดต่อหน้า
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

      const projectsWithImages = await Promise.all(
        projects.map(async (project) => {
          const owner = users.find(user => user.id === project.userId);
          const imageUrl = await fetchProjectImage();
          return {
            ...project,
            owner: owner ? owner.username : 'Unknown User',
            imageUrl,
          };
        })
      );

      setData(projectsWithImages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="project-content">
          <div className="project-wrapper">
            <Row gutter={[30, 30]}>
              {currentData.map(project => (
                <Col span={12} key={project.id}>
                  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                      <img className="rounded-t-lg" src={project.imageUrl} alt="project" />
                    </a>
                    <div className="p-5">
                      <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {project.projectsName}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        Owner: {project.owner}
                      </p>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        Created On: {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <a href={`/project/${project.id}/task`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        View Tasks
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.length}
              onChange={handlePageChange}
              className="custom-pagination"
            />
            <button onClick={handleCreateProjectClick} className="create-project-button">
              Create Project
            </button>
          </div>
        </div>
        <CreateProject open={openCreateProject} onClose={handleCloseCreateProject} />
      </div>
    </div>
  );
};

export default Project;
