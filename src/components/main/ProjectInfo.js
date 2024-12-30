import React, { useState, useEffect } from "react";
import "./ProjectInfo.css";
import EditProgress from "./EditProgress";

const ProjectInfo = () => {
  const [progress, setProgress] = useState([]);
  const [editItem, setEditItem] = useState(null);

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

  // 저장 후 처리
  const handleSave = () => {
    setEditItem(null); // 수정 완료 후 편집 모드 종료
    fetchProgress(); // 데이터 다시 가져오기
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

      {editItem && (
        <EditProgress
          item={editItem}
          onSave={handleSave}
          onCancel={() => setEditItem(null)}
        />
      )}

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
                <td>{item.taskStatus}</td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${item.completionPercentage}%` }}
                    >
                      {item.completionPercentage}%
                    </div>
                  </div>
                </td>
                <td>
                  <button onClick={() => setEditItem(item)}>수정</button>
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
