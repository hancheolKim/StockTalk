import React, { useState, useEffect } from "react";
import "./ProjectInfo.css";

const ProjectInfo = () => {
  // 진행도 데이터
  const [progress, setProgress] = useState([
    { feature: "로그인 및 인증 시스템", status: "완료", progress: 100 },
    { feature: "상품 관리 모듈", status: "진행 중", progress: 70 },
    { feature: "판매 데이터 분석", status: "대기", progress: 0 },
    { feature: "결제 연동", status: "진행 중", progress: 40 },
  ]);

  // 진행도 업데이트 로직 (주기적 변경 시뮬레이션)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress.map((item) => {
          // 예제: 진행 중인 작업을 자동 업데이트
          if (item.status === "진행 중" && item.progress < 100) {
            return { ...item, progress: item.progress + 5 };
          }
          // 진행 완료 시 상태 변경
          if (item.progress >= 100) {
            return { ...item, status: "완료" };
          }
          return item;
        })
      );
    }, 5000); // 5초마다 업데이트

    return () => clearInterval(interval);
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {progress.map((item, index) => (
            <tr key={index}>
              <td>{item.feature}</td>
              <td>{item.status}</td>
              <td>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${item.progress}%` }}
                  >
                    {item.progress}%
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectInfo;
