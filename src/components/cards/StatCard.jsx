import React from "react";

const StatCard = ({ title, percentage, subText, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:w-[20vw] sm:w-[45vw]">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-600">{title}</p>
        {Icon && <Icon className="text-gray-500 w-4 h-4" />}
      </div>
      <p className="text-2xl font-semibold mt-2">{percentage}</p>
      <p className="text-sm text-gray-500">{subText}</p>
    </div>
  );
};

export default StatCard;
