import SectionHeader from "@/components/layout/SectionHeader";
import StatCard from "@/components/cards/StatCard"; // Make sure to import your StatCard component
import { BarChart3, Users, ShoppingCart, DollarSign } from "lucide-react";
import TaskCard from "@/components/cards/TaskCard";
import TeamCard from "@/components/cards/TeamCard";
const Dashboard = () => {
  // Array of card data
  const stats = [
    {
      title: "New Orders",
      percentage: "100%",
      subText: "Since last month",
      icon: BarChart3,
    },
    {
      title: "New Customers",
      percentage: "100%",
      subText: "Since last month",
      icon: Users,
    },
    {
      title: "Sales",
      percentage: "100%",
      subText: "Since last month",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      percentage: "100%",
      subText: "Since last month",
      icon: DollarSign,
    },
  ];
  const teams = [{name:"web",members:10},{name:"mobile",members:5},{name:"design",members:3}]
  const tasks = [
  { 
    title: "Implement JWT Auth", 
    status: "In Progress",
    description: "Set up JSON Web Token authentication for user login and secure API endpoints.",
    dueDate: "2025-08-05"
  },
  { 
    title: "Add Search Functionality", 
    status: "Completed",
    description: "Implement search across all user data with debounced input and API integration.",
    dueDate: "2025-07-20"
  },
  { 
    title: "Add User Management", 
    status: "In Progress",
    description: "Create admin panel features for adding, editing, and deleting user accounts.",
    dueDate: "2025-08-10"
  }
];


  return (
    <div>
      <SectionHeader
        title="Welcome back, Hasnain and Saud ma bhi sath sath kam ker raha houn ai smaj !"
        subtitle="Here's what's happening with your work today."
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

      {/*current tasks*/}
      <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          My Tasks
        </h2>
        {
          tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))
        }
      </section>
        {/*assigned tasks*/}
       <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          Assigned Tasks
        </h2>
        {
          tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))
        }
      </section>

       <section className="mt-4 p-8 bg-white shadow-sm w-[75vw]">
  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
    My Teams
  </h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {teams.map((team, index) => (
      <TeamCard key={index} team={team} />
    ))}
  </div>
</section>

    </div>
  );
};

export default Dashboard;
