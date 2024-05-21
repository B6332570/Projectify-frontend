import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


/* Page*/
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signin/Signup'
import Project from './pages/Project/Project'
import Task from './pages/Task/Task'
import ResetPasswordPage from './pages/Signin/ResetPasswordPage'
import UserSetting from './pages/User/UserSetting'
import ExportProject from './pages/ExportProject/ExportProject'
import UserManage from './pages/User/UserManage'
import ProjectManage from './pages/Project/ProjectManage'

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
          <Route path="/export-project" element={<ExportProject />} />
          <Route path="/user-manage" element={<UserManage />} />
          <Route path="/user-setting" element={<UserSetting />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
