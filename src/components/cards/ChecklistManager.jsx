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
      <label className="block font-medium">Project Checklist</label>
      
      <div className="flex space-x-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add new task"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleDone(i)}
                className="h-5 w-5 rounded"
              />
              <span className={item.done ? "line-through text-gray-500" : ""}>
                {item.text}
              </span>
            </div>
            <button
              onClick={() => removeTask(i)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}