// src/components/team/CreateTeamModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const teamColors = ['#4A90E2', '#7ED321', '#9013FE', '#F5A623', '#D0021B', '#50E3C2']; // Example colors

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam, allUsers }) => {
    if (!isOpen) return null;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Team name is required'),
        teamLeadId: Yup.string().required('Team lead is required'),
        members: Yup.array().min(1, 'At least one member is required'),
        description: Yup.string(),
        color: Yup.string()
    });

    // Initial form values
    const initialValues = {
        name: '',
        description: '',
        teamLeadId: '',
        members: [],
        color: teamColors[0]
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log(values)
            await onCreateTeam(values);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Create New Team</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 transition duration-150"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

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
                                setFieldValue("members", values.members.filter(id => id !== userId));
                            } else {
                                setFieldValue("members", [...values.members, userId]);
                            }
                        };

                        return (
                            <Form className="mt-6 space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Team Name <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter team name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="teamLeadId" className="block text-sm font-medium text-gray-700 mb-1">
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
                                            {allUsers.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.role})
                                                </option>
                                            ))}
                                        </select>
                                        <ErrorMessage name="teamLeadId" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Color</label>
                                        <div className="flex items-center space-x-2 h-10">
                                            {teamColors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-8 h-8 rounded-full border-2 ${values.color === color ? 'border-blue-500' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setFieldValue("color", color)}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team Members <span className="text-red-500">*</span>
                                    </label>
                                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                                        <div className="grid grid-cols-1 gap-2">
                                            {allUsers.map(user => (
                                                <div key={user.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`member-${user.id}`}
                                                        checked={values.members.includes(user.id)}
                                                        onChange={() => handleMemberChange(user.id)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`member-${user.id}`} className="ml-2 flex items-center text-sm text-gray-700 flex-1">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold mr-2">
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div>
                                                            <div>{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.role} - {user.position}</div>
                                                        </div>
                                                        {values.teamLeadId === user.id && (
                                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                Team Lead
                                                            </span>
                                                        )}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ErrorMessage name="members" component="p" className="text-red-500 text-sm mt-1" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Selected: {values.members.length} member{values.members.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition duration-200 ease-in-out"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Team'
                                        )}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default CreateTeamModal;
