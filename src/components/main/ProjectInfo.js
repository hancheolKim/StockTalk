import React, { useState, useEffect } from "react";
import "./ProjectInfo.css";

const ProjectInfo = () => {
  const [progress, setProgress] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  // 진행도 데이터 가져오기 함수
  const fetchProgress = async () => {
    try {
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/ProjectProgress/all");
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error("Failed to fetch progress", error);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchProgress();
  }, []);

  // 수정 모드 활성화
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedData({ ...progress[index] });
  };

  // 변경된 데이터 저장
  const handleSave = async (index) => {
    try {
      const item = { ...editedData };

      // 상태에 따라 진행도 조정
      if (item.taskStatus === "대기") {
        item.completionPercentage = 0;
      } else if (item.taskStatus === "완료") {
        item.completionPercentage = 100;
      }

      const response = await fetch(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/ProjectProgress/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      const updatedProgress = [...progress];
      updatedProgress[index] = item;
      setProgress(updatedProgress);
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setEditIndex(null);
    setEditedData({});
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => {
      let newValue = value;

      // 진행도 값 제한
      if (name === "completionPercentage") {
        newValue = Math.min(Math.max(parseInt(value, 10), 0), 100) || ""; // 0 ~ 100 범위
      }

      // 상태 변경 시 진행도 동기화
      if (name === "taskStatus") {
        if (value === "대기") {
          return { ...prev, [name]: value, completionPercentage: 0 };
        } else if (value === "완료") {
          return { ...prev, [name]: value, completionPercentage: 100 };
        }
      }

      return { ...prev, [name]: newValue };
    });
  };

  return (
    <div>
      <span className="main-title">김한철의 ERP 포트폴리오</span>
      <p className="description">
        이 프로젝트는 ERP 시스템을 구현하여 기업 관리 프로세스를 최적화하기 위한 목적으로 제작되었습니다.
      </p>
      <table className="info-table">
        <tbody>
          <tr>
            <th>📘 개발 언어</th>
            <td>Java (17 버전), JavaScript (ES6 이상)</td>
          </tr>
          <tr>
            <th>💻 개발 환경</th>
            <td>IntelliJ IDEA, Visual Studio Code</td>
          </tr>
          <tr>
            <th>⚙️ 백엔드 서버</th>
            <td>Spring Boot 3 (REST API 기반)</td>
          </tr>
          <tr>
            <th>🌐 프론트엔드 서버</th>
            <td>React (React Router 및 Context API 활용)</td>
          </tr>
          <tr>
            <th>🗄️ DB 서버</th>
            <td>Mysql 8.0.34</td>
          </tr>
          <tr>
            <th>🚀 배포 환경</th>
            <td>AppPass </td>
          </tr>
          <tr>
            <th>💳 결제 API</th>
            <td>포트원 API (PG 연동 및 결제 트래킹 구현)</td>
          </tr>
        </tbody>
      </table>

      <span className="progress-title">개발 진행도</span>

      <table className="progress-table">
        <thead>
          <tr>
            <th>기능</th>
            <th>상태</th>
            <th>진행도</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {progress.length > 0 ? (
            progress.map((item, index) => (
              <tr key={index}>
                <td>{item.taskName}</td>
                <td>
                  {editIndex === index ? (
                    <select
                      name="taskStatus"
                      value={editedData.taskStatus || ""}
                      onChange={handleChange}
                    >
                      <option value="진행중">진행중</option>
                      <option value="완료">완료</option>
                      <option value="대기">대기</option>
                    </select>
                  ) : (
                    item.taskStatus
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="number"
                      name="completionPercentage"
                      value={editedData.completionPercentage || ""}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                  ) : (
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${item.completionPercentage}%` }}
                      >
                        {item.completionPercentage}%
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <>
                      <button onClick={() => handleSave(index)}>저장</button>
                      <button onClick={handleCancel}>취소</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(index)}>수정</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">진행도 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectInfo;
