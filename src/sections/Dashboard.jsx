import SectionHeader from "@/components/layout/SectionHeader";
import StatCard from "@/components/cards/StatCard";
import { BarChart3, Users, ShoppingCart, DollarSign, CheckCircle, Clock, UserCheck, Calendar } from "lucide-react";
import TaskCard from "@/components/cards/TaskCard";
import TeamCard from "@/components/cards/TeamCard";
import useDashboard from "@/hooks/useDashboard";

const Dashboard = () => {
  const { dashboard, loading, error } = useDashboard();
  console.log(dashboard);
  

  if (loading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;
  }
  

  const employeeData = dashboard?.employee || {};
  const performanceData = dashboard?.performance || {};
  const attendanceData = dashboard?.attendance || 0;
  const myTasksData = dashboard?.myTasks || {};
  const teamsData = dashboard?.teams || {};
  const totalDays = dashboard?.total_days || 0;
  const presentDays = dashboard?.present_days || 0;
  const unreadCount = dashboard?.unread_count || 0;


  const stats = [
    {
      title: "Task Performance",
      percentage: `${performanceData.performance || 0}%`,
      subText: `${performanceData.completedTasks || 0}/${performanceData.totalTasks || 0} tasks completed`,
      icon: CheckCircle,
    },
    {
      title: "Attendance Rate",
      percentage: `${attendanceData}%`,
      subText: `${presentDays}/${totalDays} days present`,
      icon: UserCheck,
    },
    {
      title: "My Tasks",
      percentage: `${myTasksData.total_count || 0}`,
      subText: "Incomplete tasks",
      icon: Clock,
    },
    {
      title: "Teams",
      percentage: `${teamsData.count || 0}`,
      subText: "Team memberships",
      icon: Users,
    },
  ];

  const teams = teamsData.teams || [];
  

  const myTasks = myTasksData.incompleteTasks || [];
  const assignedTaskIds = employeeData.assignedTasks || [];
  
  // Placeholder tasks structure - replace with actual task fetching logic
  const tasks = [
    { 
      title: "Complete Performance Review", 
      status: "In Progress",
      description: "Review and update employee performance metrics for Q3.",
      dueDate: "2025-08-28"
    },
    { 
      title: "Team Meeting Preparation", 
      status: "Pending",
      description: "Prepare agenda and materials for upcoming team meeting.",
      dueDate: "2025-08-26"
    }
  ];

  return (
    <div>
      <SectionHeader
        title={`Welcome back, ${employeeData.name || 'User'}`}
        subtitle={`Here's what's happening with your work today. Status: ${employeeData.status || 'N/A'}`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            percentage={stat.percentage}
            subText={stat.subText}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* My Tasks Section */}
      <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          My Tasks ({myTasksData.total_count || 0} incomplete)
        </h2>
        {myTasks.length > 0 ? (
          myTasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))
        ) : (
          <p className="text-gray-500">No incomplete tasks found.</p>
        )}
      </section>

      {/* Assigned Tasks Section */}
      <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          Assigned Tasks ({assignedTaskIds.length} total)
        </h2>
        {assignedTaskIds.length > 0 ? (
          <div className="space-y-2">
            {assignedTaskIds.map((taskId, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <p className="text-sm text-gray-600">Task ID: {taskId}</p>
                <p className="text-xs text-gray-400">
                  Note: Fetch full task details using this ID
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No assigned tasks found.</p>
        )}
      </section>

      {/* Teams Section */}
      <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          My Teams ({teamsData.count || 0})
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </h2>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <TeamCard key={index} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>You're not currently assigned to any teams.</p>
            <p className="text-sm text-gray-400 mt-2">
              Contact your HR manager to join a team.
            </p>
          </div>
        )}
      </section>

      {/* Additional Info Section */}
      <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Position:</strong> {employeeData.position || 'N/A'}</p>
            <p><strong>Role:</strong> {employeeData.role || 'N/A'}</p>
            <p><strong>Username:</strong> {employeeData.username || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Hire Date:</strong> {employeeData.hireDate ? new Date(employeeData.hireDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Online Status:</strong> {employeeData.isOnline ? 'Online' : 'Offline'}</p>
            <p><strong>Available:</strong> {employeeData.available ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;