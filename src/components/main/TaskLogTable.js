import React, { useState, useEffect } from "react";
import axios from "axios";
import './TaskLogTable.css'; // CSS 파일을 임포트합니다.

const TaskLogTable = () => {
  const [taskLogs, setTaskLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [pageSize, setPageSize] = useState(5); // 한 페이지에 표시할 데이터 수
  const [formData, setFormData] = useState({
    logId: "",
    taskId: "",
    taskName: "",
    title: "",
    description: "",
    taskDate: "",
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false); // 폼을 보이게 할지 말지 상태
  const [error, setError] = useState(""); // 에러 메시지 상태 추가

  // 최근 TaskLog 데이터 가져오기
  const fetchTaskLogs = async () => {
    try {
      const response = await axios.get("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/tasklog/recent");
      setTaskLogs(response.data); // 모든 데이터를 상태에 저장
    } catch (error) {
      console.error("Failed to fetch task logs:", error);
    }
  };

  useEffect(() => {
    fetchTaskLogs();
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
        fetchTaskLogs(); // 추가 후 데이터를 다시 가져옵니다.
        setFormData({
          logId: "",
          taskId: "",
          taskName: "",
          title: "",
          description: "",
          taskDate: "",
        });
        setShowForm(false); // 폼 숨기기
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
        await axios.put(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/tasklog/${formData.logId}`, formData);
        fetchTaskLogs(); // 수정 후 데이터를 다시 가져옵니다.
        setEditing(false);
        setShowForm(false); // 폼 숨기기
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
      fetchTaskLogs(); // 삭제 후 데이터를 다시 가져옵니다.
      setShowForm(false);
    } catch (error) {
      console.error("Failed to delete task log:", error);
    }
  };

  // 수정 모드 활성화
  const handleEdit = (log) => {
    setFormData(log);
    setEditing(true);
    setShowForm(true); // 폼 보이기
    setError(""); // 에러 초기화
  };

  // 테이블 상단의 "작업 내역 추가" 버튼 클릭시 폼 보이기
  const handleAddButtonClick = () => {
    setShowForm(true); // 폼 보이기
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
  };

  // 페이징된 데이터 추출
  const paginatedTaskLogs = taskLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="task-log-container">
      <div className="same-line">
        <span>작업 내역</span>
        {/* 작업 내역 추가 버튼 */}
        <button className="add-button" onClick={handleAddButtonClick}>작업 내역 추가</button>
      </div>
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
          {paginatedTaskLogs.length > 0 ? paginatedTaskLogs.map((log) => (
            <tr key={log.logId} onClick={() => handleEdit(log)} style={{ cursor: 'pointer' }}>
              <td>{log.logId}</td>
              <td>{log.taskName}</td>
              <td>{log.title}</td>
              <td>{new Date(log.taskDate).toLocaleDateString()}</td>
            </tr>
          )) : <tr><td colSpan="4">작업 기록이 없습니다.</td></tr>}
        </tbody>
      </table>

      {/* 페이지 네비게이션 */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(taskLogs.length / pageSize) }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* 추가/수정 폼 */}
      {showForm && (
        <div className="Add-form-container">
            {error && <p className="error">{error}</p>}
            <form
            onSubmit={(e) => {
                e.preventDefault();
                editing ? handleUpdate() : handleAdd();
            }}
            >
            <ul>
                <li>
                <label>작업 번호 : </label>
                <input
                    type="number"
                    name="taskId"
                    value={formData.taskId}
                    onChange={handleChange}
                    required
                    placeholder="작업의 고유 번호를 입력하세요."
                />
                </li>
                <li>
                <label>작업 대상 : </label>
                <input
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    required
                    placeholder="작업의 이름을 입력하세요."
                />
                </li>
                <li>
                <label>제목 : </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="로그의 제목을 입력하세요."
                />
                </li>
                <li>
                <label>설명명 : </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="로그의 자세한 설명을 작성하세요."
                />
                </li>
                <li>
                    <label>작업 일시 : </label>
                    <input
                        type="date"
                        name="taskDate"
                        value={formData.taskDate}
                        onChange={handleChange}
                        required
                        placeholder="작업 일시를 선택하세요."
                        disabled={editing}  // 수정 불가능하도록 설정
                    />
                </li>
            </ul>
            <div className="form-actions">
                <button type="submit">{editing ? "수정" : "추가"}</button>
                {editing && (
                <button
                    type="button"
                    onClick={() => {
                    if (window.confirm("정말로 삭제하시겠습니까?")) {
                        handleDelete(formData.logId);
                    }
                    }}
                >
                    삭제
                </button>
                )}
            </div>
            </form>
        </div>
        )}


    </div>
  );
};

export default TaskLogTable;
