import React, { useState, useEffect } from "react";
import "./EditProgress.css";

const EditProgress = ({ item, onSave, onCancel }) => {
  const [taskName, setTaskName] = useState(item?.taskName || "");
  const [taskStatus, setTaskStatus] = useState(item?.taskStatus || "");
  const [completionPercentage, setCompletionPercentage] = useState(
    item?.completionPercentage || 0
  );

  useEffect(() => {
    if (item) {
      setTaskName(item.taskName);
      setTaskStatus(item.taskStatus);
      setCompletionPercentage(item.completionPercentage);
    }
  }, [item]);

  const handleSave = async () => {
    try {
      const response = await fetch(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName,
          taskStatus,
          completionPercentage,
        }),
      });
      if (!response.ok) throw new Error("Failed to update progress");
      onSave();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="edit-progress">
      <h3>진행도 수정</h3>
      <div>
        <label>기능명:</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      <div>
        <label>상태:</label>
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="시작 안됨">시작 안됨</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
        </select>
      </div>
      <div>
        <label>진행도 (%):</label>
        <input
          type="number"
          value={completionPercentage}
          onChange={(e) => setCompletionPercentage(Number(e.target.value))}
          min="0"
          max="100"
        />
      </div>
      <button onClick={handleSave}>저장</button>
      <button onClick={onCancel}>취소</button>
    </div>
  );
};

export default EditProgress;
