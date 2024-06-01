import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Sidebar';

/* Page*/
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signin/Signup'
import Project from './pages/Project/Project'
import Task from './pages/Task/Task'
import ResetForgetPassword from './pages/Signin/ResetForgetPassword';
import UserSetting from './pages/User/UserSetting'
import ExportProject from './pages/ExportProject/ExportProject'
import UserManage from './pages/User/UserManage'
import ProjectManage from './pages/Project/ProjectManage'
import ForgetPassword from './pages/Signin/ForgetPassword';
import ResetPassword from './pages/User/ResetPassword';


const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans Thai", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans Thai", sans-serif',
        },
      },
    },
  },
});



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
      
          <Route path="/project" element={<Project />} />
          <Route path="/project/:projectId/task" element={<Task />} />
          <Route path="/project-manage" element={<ProjectManage />} />
          <Route path="/task" element={<Task />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={< ForgetPassword />} />
          <Route path="/forgot-password/:token" element={<ResetForgetPassword />} />
          <Route path="/export-project" element={<ExportProject />} />
          <Route path="/user-manage" element={<UserManage />} />
          <Route path="/user-setting" element={<UserSetting />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
