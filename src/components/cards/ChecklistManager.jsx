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
    <div>
      <label className="block mb-1 font-medium">Checklist</label>
      <div className="flex gap-2 mb-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add task"
          className="border p-2 rounded flex-1"
        />
        <button type="button" onClick={handleAdd} className="bg-blue-500 text-white px-3 rounded">Add</button>
      </div>
      <ul>
        {checklist.map((item, i) => (
          <li key={i} className="flex justify-between items-center border p-1 rounded mb-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={item.done} onChange={() => toggleDone(i)} />
              <span className={item.done ? "line-through text-gray-500" : ""}>{item.text}</span>
            </div>
            <button type="button" onClick={() => removeTask(i)} className="text-red-500 text-xs">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
