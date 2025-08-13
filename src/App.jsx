import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/sections/Dashboard';
import useSection from '@/hooks/useSection';
import Employees from '@/sections/Employees';
import Tasks from '@/sections/Tasks';
import Chats from '@/sections/Chats';
import Attendance from '@/sections/Attendance';
import Reports from '@/sections/Reports';
import Teams from '@/sections/Teams';
import AdminPanel from '@/sections/AdminPanel';
import TeamDashboard from './pages/TeamDashboard';
import ProjectProposed from './sections/projectproposed';
function App() {
  const { section } = useSection();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {section === 'dashboard' && (
          <Route index element={<Dashboard />} /> 
        )}
        {section === 'employees' && (
          <Route index element={<Employees />} /> 
        )}
        {section === 'tasks' && (
          <Route index element={<Tasks />} /> 
        )}
        {section === 'chat' && (
          <Route index element={<Chats />} /> 
        )}
        {section === 'attendance' && (
          <Route index element={<Attendance />} /> 
        )}
        {section === 'reports' && (
          <Route index element={<Reports />} /> 
        )}
        {
          section==="bugs"&&(
            <Route index element={<Bugs/>}/>
          
          )
        }
        {
          section==="projectproposed"&&(
            <Route index element={<ProjectProposed/>}/>
          
          )
        }
        {section === 'teams' && (
          <Route index element={<Teams />} /> 
        )}
        {section === 'admin' && (
          <Route index element={<AdminPanel />} /> 
        )}
        {section === 'teamdashboard' && (
          <Route index element={<TeamDashboard />} /> 
        )}
      </Route>
      
    </Routes>
  );
}

export default App;
