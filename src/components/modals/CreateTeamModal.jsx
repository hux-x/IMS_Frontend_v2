// src/components/team/CreateTeamModal.jsx
import React, { useState } from "react";
import { FaTimes, FaSearch, FaUser, FaCrown } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const teamColors = [
  "#4A90E2",
  "#7ED321",
  "#9013FE",
  "#F5A623",
  "#D0021B",
  "#50E3C2",
]; // Example colors

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam, allUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filter employees based on search term
  const filteredEmployees = allUsers.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Team name is required"),
    teamLeadId: Yup.string().required("Team lead is required"),
    members: Yup.array().min(1, "At least one member is required"),
    description: Yup.string(),
    color: Yup.string(),
  });

  // Initial form values
  const initialValues = {
    name: "",
    description: "",
    teamLeadId: "",
    members: [],
    color: teamColors[0],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);
      await onCreateTeam(values);
      resetForm();
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create New Team
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition duration-150"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              // Auto-include team lead in members
              const handleLeadChange = (leadId) => {
                setFieldValue("teamLeadId", leadId);
                if (leadId && !values.members.includes(leadId)) {
                  setFieldValue("members", [...values.members, leadId]);
                }
              };

              const handleMemberChange = (userId) => {
                if (values.members.includes(userId)) {
                  // Don't allow removing team lead from members
                  if (userId === values.teamLeadId) {
                    return;
                  }
                  setFieldValue(
                    "members",
                    values.members.filter((id) => id !== userId)
                  );
                } else {
                  setFieldValue("members", [...values.members, userId]);
                }
              };

              return (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Team Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter team name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Color
                      </label>
                      <div className="flex items-center space-x-2 h-10">
                        {teamColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              values.color === color
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-gray-200 hover:border-gray-300"
                            } transition-all duration-200`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFieldValue("color", color)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="3"
                      placeholder="Enter team description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition duration-200 ease-in-out"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teamLeadId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Team Lead <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="teamLeadId"
                      name="teamLeadId"
                      value={values.teamLeadId}
                      onChange={(e) => handleLeadChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                      <option value="">Select team lead</option>
                      {allUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} - {user.position} ({user.role})
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="teamLeadId"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Members <span className="text-red-500">*</span>
                    </label>

                    {/* Search bar for employees */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Employee list */}
                    <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                      {filteredEmployees.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {searchTerm
                            ? "No employees found matching your search."
                            : "No employees available."}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {filteredEmployees.map((employee) => {
                            const isSelected = values.members.includes(
                              employee._id
                            );
                            const isTeamLead =
                              values.teamLeadId === employee._id;

                            return (
                              <div
                                key={employee._id}
                                className={`p-3 hover:bg-gray-50 transition-colors duration-150 ${
                                  isSelected ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`member-${employee._id}`}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleMemberChange(employee._id)
                                    }
                                    disabled={isTeamLead}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                  />
                                  <label
                                    htmlFor={`member-${employee._id}`}
                                    className="ml-3 flex items-center flex-1 cursor-pointer"
                                  >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                                      {getInitials(employee.name)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-900">
                                          {employee.name}
                                        </span>
                                        {isTeamLead && (
                                          <FaCrown
                                            className="ml-2 text-yellow-500"
                                            size={14}
                                          />
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {employee.position}
                                      </div>
                                      <div className="flex items-center mt-1">
                                        <span
                                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            employee.role === "admin"
                                              ? "bg-purple-100 text-purple-800"
                                              : employee.role === "manager"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {employee.role}
                                        </span>
                                        <span
                                          className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            employee.status === "active"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {employee.status}
                                        </span>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                                {isTeamLead && (
                                  <div className="mt-2 ml-7">
                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                      <FaCrown className="mr-1" size={10} />
                                      Team Lead (automatically included)
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <ErrorMessage
                      name="members"
                      component="p"
                      className="text-red-500 text-sm mt-2"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Selected: {values.members.length} member
                        {values.members.length !== 1 ? "s" : ""}
                      </p>
                      {values.members.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFieldValue("members", [])}
                          className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-150"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition duration-200 ease-in-out disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        "Create Team"
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
