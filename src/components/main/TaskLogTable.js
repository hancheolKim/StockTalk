import React, { useState, useEffect } from "react";
import axios from "axios";
import './TaskLogTable.css'; // CSS 파일을 임포트합니다.

const TaskLogTable = () => {
  const [taskLogs, setTaskLogs] = useState([]);
  const [formData, setFormData] = useState({
    logId: "",
    taskId: "",
    taskName: "",
    title: "",
    description: "",
    taskDate: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(""); // 에러 메시지 상태 추가

  // 최근 TaskLog 데이터 가져오기
  const fetchRecentTaskLogs = async () => {
    try {
      const response = await axios.get("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/tasklog/recent");
      setTaskLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch recent task logs:", error);
    }
  };

  useEffect(() => {
    fetchRecentTaskLogs();
  }, []);

  // 입력 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 로그 추가
  const handleAdd = async () => {
    if (validateForm()) {
      try {
        await axios.post("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/tasklog", formData);
        fetchRecentTaskLogs();
        setFormData({
          logId: "",
          taskId: "",
          taskName: "",
          title: "",
          description: "",
          taskDate: "",
        });
        setError(""); // 에러 초기화
      } catch (error) {
        console.error("Failed to add task log:", error);
      }
    }
  };

  // 로그 수정
  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        await axios.put(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/${formData.logId}`, formData);
        fetchRecentTaskLogs();
        setEditing(false);
        setFormData({
          logId: "",
          taskId: "",
          taskName: "",
          title: "",
          description: "",
          taskDate: "",
        });
        setError(""); // 에러 초기화
      } catch (error) {
        console.error("Failed to update task log:", error);
      }
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!formData.taskId || !formData.taskName || !formData.title || !formData.description || !formData.taskDate) {
      setError("모든 필드를 채워주세요.");
      return false;
    }
    return true;
  };

  // 로그 삭제
  const handleDelete = async (logId) => {
    try {
      await axios.delete(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/tasklog/${logId}`);
      fetchRecentTaskLogs();
    } catch (error) {
      console.error("Failed to delete task log:", error);
    }
  };

  // 수정 모드 활성화
  const handleEdit = (log) => {
    setFormData(log);
    setEditing(true);
    setError(""); // 에러 초기화
  };

  return (
    <div className="task-log-container">
      <span className="main-title">Task Log Management</span>
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>작업목표</th>
            <th>제목</th>
            <th>작업일시</th>
          </tr>
        </thead>
        <tbody>
          {taskLogs.length > 0 ?taskLogs.map((log) => (
            <tr key={log.logId}>
              <td>{log.logId}</td>
              <td>{log.taskName}</td>
              <td>{log.title}</td>
              <td>{new Date(log.taskDate).toLocaleDateString()}</td>
            </tr>
          )) : <tr>
                <td colspan="4">작업 기록이 없습니다.</td>
            </tr>}
        </tbody>
      </table>

      <div className="Add-form-container">
        {error && <p className="error">{error}</p>} {/* 에러 메시지 표시 */}
        <form
            onSubmit={(e) => {
            e.preventDefault();
            editing ? handleUpdate() : handleAdd();
            }}
        >
            <ul>
            <li>
                <label>Task ID: </label>
                <input
                type="number"
                name="taskId"
                value={formData.taskId}
                onChange={handleChange}
                required
                />
                <p className="input-description">작업의 고유 번호를 입력하세요.</p>
            </li>
            <li>
                <label>Task Name: </label>
                <input
                type="text"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                required
                />
                <p className="input-description">작업의 이름을 입력하세요.</p>
            </li>
            <li>
                <label>Title: </label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                />
                <p className="input-description">로그의 제목을 입력하세요.</p>
            </li>
            <li>
                <label>Description: </label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                />
                <p className="input-description">로그의 자세한 설명을 작성하세요.</p>
            </li>
            <li>
                <label>Task Date: </label>
                <input
                type="date"
                name="taskDate"
                value={formData.taskDate}
                onChange={handleChange}
                required
                />
                <p className="input-description">작업 일시를 선택하세요.</p>
            </li>
            </ul>
            <button type="submit">{editing ? "Update" : "Add"}</button>
        </form>
        </div>

    </div>
  );
};

export default TaskLogTable;
