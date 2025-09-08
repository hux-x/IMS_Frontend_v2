import SectionHeader from "@/components/layout/SectionHeader";
import MeetingModal from "@/components/modals/MeetingModal";
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Badge,
  AlertCircle,
  Briefcase,
  X,
  Eye
} from "lucide-react";
import TaskCard from "@/components/cards/TaskCard";
import TeamCard from "@/components/cards/TeamCard";
import useDashboard from "@/hooks/useDashboard";
import useTasks from "@/hooks/useTask";
import { useState } from "react";
import MeetingCard from "@/components/cards/MeetingCard";

const Dashboard = () => {
  const { dashboard, loading, error } = useDashboard();
  const { handleUpdateTask, handleDeleteTask } = useTasks();
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  const employeeData = dashboard?.employee || {};
  const performanceData = dashboard?.performance || {};
  const attendanceData = dashboard?.attendance || 0;
  const myTasksData = dashboard?.myTasks || {};
  const teamsData = dashboard?.teams || {};
  const totalDays = dashboard?.total_days || 0;
  const presentDays = dashboard?.present_days || 0;
  const unreadCount = dashboard?.unread_count || 0;
  const meetings = dashboard?.meetings || [];
  const meetingCount = dashboard?.meetingCount || 0;

  const stats = [
    {
      title: "Task Performance",
      percentage: `${performanceData.performance || 0}%`,
      subText: `${performanceData.completedTasks || 0}/${performanceData.totalTasks || 0} tasks completed`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Attendance Rate",
      percentage: `${attendanceData}%`,
      subText: `${presentDays}/${totalDays} days present`,
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "My Tasks",
      percentage: `${myTasksData.total_count || 0}`,
      subText: "Incomplete tasks",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Teams",
      percentage: `${teamsData.count || 0}`,
      subText: "Team memberships",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const teams = teamsData.teams || [];
  const myTasks = myTasksData.incompleteTasks || [];
  const assignedTasks = employeeData.assignedTasks || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Welcome back, ${employeeData.name || 'User'}! 👋`}
        subtitle={`Here's what's happening with your work today. Status: ${employeeData.status || 'N/A'}`}
      />

      {/* Enhanced Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.percentage}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subText}</p>
              </div>
              <div className={`${stat.color} ${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium text-gray-700">Upcoming Meetings</p>
            <p className="text-2xl font-bold text-blue-600">{meetingCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium text-gray-700">Total Assigned Tasks</p>
            <p className="text-2xl font-bold text-orange-600">{assignedTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium text-gray-700">Team Notifications</p>
            <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
          </div>
        </div>
      </div>

      {/* My Tasks Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Clock className="h-6 w-6 text-orange-600" />
          My Tasks ({myTasksData.total_count || 0} incomplete)
        </h2>
        {myTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {myTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onDelete={handleDeleteTask} 
                onUpdate={handleUpdateTask} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-16 w-16 text-green-300 mb-4" />
            <p className="text-gray-500 text-lg">All caught up! No incomplete tasks.</p>
            <p className="text-sm text-gray-400 mt-2">Great job staying on top of your work!</p>
          </div>
        )}
      </section>

      {/* Assigned Tasks Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-blue-600" />
          Assigned Tasks ({assignedTasks.length} total)
        </h2>
        {assignedTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {assignedTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onDelete={handleDeleteTask} 
                onUpdate={handleUpdateTask}
                showPriority={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No tasks assigned yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for new assignments.</p>
          </div>
        )}
      </section>

      {/* Meetings Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-purple-600" />
          Upcoming Meetings ({meetingCount})
        </h2>
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No upcoming meetings scheduled.</p>
            <p className="text-sm text-gray-400 mt-2">Your calendar is clear for now.</p>
          </div>
        )}
      </section>

      {/* Teams Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-indigo-600" />
          My Teams ({teamsData.count || 0})
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
              {unreadCount} unread
            </span>
          )}
        </h2>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You're not currently assigned to any teams.</p>
            <p className="text-sm text-gray-400 mt-2">
              Contact your HR manager to join a team.
            </p>
          </div>
        )}
      </section>

      {/* Employee Information Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Badge className="h-6 w-6 text-green-600" />
          Employee Information
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium text-gray-900">{employeeData.position || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900 capitalize">{employeeData.role || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{employeeData.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-900">{employeeData.contact || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium text-gray-900">
                  {employeeData.hireDate 
                    ? new Date(employeeData.hireDate).toLocaleDateString() 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                employeeData.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900">
                  {employeeData.isOnline ? 'Online' : 'Offline'}
                  {employeeData.available && (
                    <span className="ml-2 text-green-600 text-sm">• Available</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 text-gray-400">#</div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-900">@{employeeData.username || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 text-gray-400">🎂</div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium text-gray-900">{employeeData.age || 'N/A'} years old</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Modal */}
      <MeetingModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
    </div>
  );
};

export default Dashboard;