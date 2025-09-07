import React, { useState, useCallback } from 'react';

export default function ChecklistManager({ checklist = [], onChange }) {
  const [newTask, setNewTask] = useState('');

  const handleAdd = useCallback(() => {
    if (!newTask.trim()) return;
    onChange([...checklist, { task: newTask, isCompleted: false }]);
    setNewTask('');
  }, [newTask, checklist, onChange]);

  const handleToggle = useCallback(
    (index) => {
      const updated = [...checklist];
      updated[index].isCompleted = !updated[index].isCompleted;
      onChange(updated);
    },
    [checklist, onChange]
  );

  const handleDelete = useCallback(
    (index) => {
      onChange(checklist.filter((_, i) => i !== index));
    },
    [checklist, onChange]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Design Checklist</label>
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Add new task"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() => handleToggle(i)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className={`flex-1 ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item.task}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(i)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}