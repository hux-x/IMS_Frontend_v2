import React, { useState } from "react";

export default function ChecklistManager({ checklist, onChange }) {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (!task.trim()) return;
    onChange([...checklist, { text: task, done: false }]);
    setTask("");
  };

  const toggleDone = (index) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    onChange(updated);
  };

  const removeTask = (index) => {
    onChange(checklist.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium text-gray-800">Design Checklist</label>
      
      <div className="flex space-x-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add new task (e.g., 'Select color palette')"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleDone(i)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-gray-700 ${item.done ? 'line-through text-gray-400' : ''}`}>
                {item.text}
              </span>
            </div>
            <button
              onClick={() => removeTask(i)}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}