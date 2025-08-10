import React, { useMemo } from "react";
import "./App.css";

function LeftContent({
  students,
  currentUserId,
  studentTodos,
  openIndex,
  setOpenIndex,
  handleToggleDone,
  handleDeleteTodo,
  teamName,
  displayIdMap,
  onLogout, // Toto에서 내려옴
}) {
  // 팀명 우선순위: prop → localStorage.user.teamname → localStorage.teamName → 기본값
  const displayTeamName = useMemo(() => {
    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem("user") || "null"); }
      catch { return null; }
    })();
    return (
      teamName ||
      storedUser?.teamname ||
      localStorage.getItem("teamName") ||
      "To do Together"
    );
  }, [teamName]);

  return (
    <div>
      {/* 우측 상단 고정 LOGOUT 버튼 */}
      <div style={{ position: "fixed", top: 30, right: 750, display: "flex", gap: 10, zIndex: 1000 }}>
        <button
          type="button"
          style={{
            width: 80, height: 44,
            backgroundColor: "#ff0000ff", color: "#ffffffff",
            cursor: "pointer", fontWeight: "bold", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", borderRadius: 8
          }}
          onClick={() => onLogout?.()}
        >
          Logout
        </button>
      </div>

      {/*상단 팀명(중앙 고정 스타일은 App.css .teamName에서 처리)*/}
      <div className="teamName" title={displayTeamName}>{displayTeamName}</div>

      {/* 흰 박스 영역 - 스크롤 포함(App.css .box) */}
      <div className="box">
        {students.map((student, idx) => {
          const isOpen = openIndex === idx;
          const isMe = String(student.id) === String(currentUserId);
          const todos = Array.isArray(studentTodos?.[student.id]) ? studentTodos[student.id] : [];

          return (
            <div key={student.id} style={{ padding: 5, marginBottom: 20 }}>
              {/* 학생 헤더 라인 */}
              <p style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                  {displayIdMap?.[String(student.id)] ?? student.seq ?? student.id} {student.name}
                </span>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}
                  aria-label={isOpen ? "접기" : "펼치기"}
                  title={isOpen ? "접기" : "펼치기"}
                >
                  {isOpen ? "▲" : "▼"}
                </button>
              </p>

              {/* TODO 목록 */}
              {isOpen && (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {todos.length === 0 ? (
                    <li style={{ color: "#aaa" }}>할 일이 없습니다.</li>
                  ) : (
                    todos.map((t) => (
                      <li
                        key={t.taskNum}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          gap: 8,
                        }}
                      >
                        {/* 왼쪽: 체크박스 + 제목 + 별 */}
                        <span className="task-text" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <input
                            type="checkbox"
                            checked={!!t.done}
                            disabled={!isMe}
                            onChange={() => isMe && handleToggleDone(t.taskNum)}
                            style={{ marginRight: 6 }}
                          />
                          <span
                            title={t.title}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {t.title}
                          </span>
                          <span className="star-group">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span key={n} className={n <= (t.priority || 0) ? "star active" : "star"}>
                                ★
                              </span>
                            ))}
                          </span>
                        </span>

                        {/* 오른쪽: 삭제 버튼(본인만 가능하도록) */}
                        {isMe && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteTodo(t.taskNum, student.id)}
                            title="삭제"
                          >
                            삭제
                          </button>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftContent;
