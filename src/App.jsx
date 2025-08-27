import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/sections/Dashboard';
import Employees from '@/sections/Employees';
import Tasks from '@/sections/Tasks';
import Chats from '@/sections/Chats';
import Attendance from '@/sections/Attendance';
import Reports from '@/sections/Reports';
import Teams from '@/sections/Teams';
import AdminPanel from '@/sections/AdminPanel';
import TeamDashboard from './pages/TeamDashboard';
import ProjectProposed from '@/sections/ProjectProposed';
import Bugs from '@/sections/Bugs';
import MeetingDashboard from './sections/Meetings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Default landing page */}
        <Route index element={<Dashboard />} />

        {/* Nested routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="chat" element={<Chats />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="teams" element={<Teams />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="teamdashboard" element={<TeamDashboard />} />
        <Route path="projectproposed" element={<ProjectProposed />} />
        <Route path="bugs" element={<Bugs />} />
        <Route path='meetings' element={<MeetingDashboard/>}/>

        {/* Example dynamic nested route */}
        <Route path="teamdashboard/:teamId" element={<TeamDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
