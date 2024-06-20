import React, { useState, useEffect } from "react";
import { Pagination, Row, Col, Skeleton, Card } from "antd";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import CreateProject from "./CreateProject";
import "./Project.css";
import fetchProjectImage from "./fetchProjectImage";
import { Link } from "react-router-dom";
import CreateProjectButt from "../../components/CreateProjectButt";
import EditProject from "./EditProject";

const axiosWithAuth = () => {
  const token = localStorage.getItem("accessToken");
  return axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const Project = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4); // จำนวนการ์ดต่อหน้า
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [openEditProject, setOpenEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditProjectClick = (project) => {
    setSelectedProject(project);
    setOpenEditProject(true);
  };

  const handleCloseEditProject = () => {
    setOpenEditProject(false);
    setSelectedProject(null);
  };

  const handleCreateProjectClick = () => {
    setOpenCreateProject(true);
  };

  const handleCloseCreateProject = () => {
    setOpenCreateProject(false);
  };

  const handleCreateProject = () => {
    setOpenCreateProject(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); // เริ่มแสดง Loading
      const api = axiosWithAuth();
      const projectsResponse = await api.get("/project");
      const usersResponse = await api.get("/user");

      const projects = projectsResponse.data.result;
      console.log("Projects:", projects);

      const users = usersResponse.data.result;
      console.log("Users:", users);

      // Fetch images only for the number of projects
      const projectImages = await Promise.all(
        projects.map(() => fetchProjectImage())
      );

      const projectsWithImages = projects.map((project, index) => {
        const owner = users.find((user) => user.id === project.userId);
        return {
          ...project,
          owner: owner ? owner.username : "Unknown User",
          imageUrl: projectImages[index],
        };
      });

      setData(projectsWithImages);
      setLoading(false); // หยุดแสดง Loading เมื่อข้อมูลพร้อม
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // หยุดแสดง Loading เมื่อเกิดข้อผิดพลาด
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAction = (action) => {
    alert(`Action: ${action}`);
  };

  const getPopoverPosition = (index) => {
    return index % 2 === 0 ? "left" : "right";
  };

  return (
    <div className="backgroundbobweb">
      <div className="flex">
        <Sidebar handleCreateProjectClick={handleCreateProjectClick} />
        <div className="pmain-content">
          <Navbar />
          <div className="project-content">
            <div className="project-wrapper">
              <h1 className="project-page-title">Projectify</h1>
              {loading ? (
                <Row gutter={[30, 30]}>
                  {Array.from({ length: pageSize }).map((_, index) => (
                    <Col span={12} key={index}>
                      <Card className="skeleton-card">
                        <Skeleton.Image active className="skeleton-image" />
                        <br />
                        <br />
                        <br />
                        <br />
                        <Skeleton active avatar title paragraph={{ rows: 4 }} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <>
                  <div className="create-project-button">
                    <CreateProjectButt onClick={handleCreateProjectClick} />
                  </div>
                  <Row gutter={[30, 30]}>
                    {currentData.map((project, index) => (
                      <Col
                        span={currentData.length === 1 ? 24 : 12}
                        key={project.id}
                      >
                        <div className="relative">
                          <div
                            className={`popover ${getPopoverPosition(index)} ${
                              dropdownOpen[project.id] ? "visible" : ""
                            }`}
                            id={`popover-left${project.id}`}
                            role="tooltip"
                          >
                            <div className="px-8 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {project.projectsName}
                              </h3>
                            </div>
                            <div className="px-3 py-2">
                              <p>{project.title}</p>
                            </div>
                          </div>
                          <div
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
                            onMouseEnter={() => {
                              document
                                .getElementById(`popover-left${project.id}`)
                                .classList.add("visible");
                            }}
                            onMouseLeave={() => {
                              document
                                .getElementById(`popover-left${project.id}`)
                                .classList.remove("visible");
                            }}
                          >
                            <div className="absolute top-2 right-2 z-20">
                              <div className="kebab-button">
                                <button
                                  id="dropdownMenuIconButton"
                                  data-dropdown-toggle="dropdownDots"
                                  data-dropdown-placement="bottom-start"
                                  className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                                  type="button"
                                  onClick={() => toggleDropdown(project.id)}
                                >
                                  <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 4 15"
                                  >
                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                  </svg>
                                </button>
                                {dropdownOpen[project.id] && (
                                  <div
                                    id="dropdownDots"
                                    className="kebab-menu z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600 absolute top-10 right-0"
                                  >
                                    <ul
                                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                      aria-labelledby="dropdownMenuIconButton"
                                    >
                                      <li>
                                        <a
                                          href="#"
                                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          onClick={() =>
                                            handleEditProjectClick(project)
                                          }
                                        >
                                          Edit
                                        </a>
                                      </li>
                               
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            <a href="#">
                              <img
                                className="rounded-t-lg"
                                src={project.imageUrl}
                                alt="project"
                              />
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
                                Created On:{" "}
                                {new Date(
                                  project.createdAt
                                ).toLocaleDateString()}
                              </p>
                              <Link
                                to={`/project/${project.id}/task`}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none view-tasks-button"
                              >
                                View Tasks
                                <svg
                                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 10"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                  />
                                </svg>
                              </Link>
                            </div>
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
                </>
              )}
            </div>
          </div>
          <CreateProject
            open={openCreateProject}
            onClose={handleCloseCreateProject}
            onCreate={handleCreateProject} // เพิ่มฟังก์ชัน onCreate
          />
          {openEditProject && (
            <EditProject
              open={openEditProject}
              onClose={handleCloseEditProject}
              project={selectedProject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
