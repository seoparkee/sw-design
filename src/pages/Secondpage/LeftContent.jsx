import React from "react";

function LeftContent({
  students,
  currentUserId,
  studentTodos,
  openIndex,
  setOpenIndex,
  handleToggleDone,
  handleDeleteTodo,
}) {
  return (
    <div>
      <div className="teamName">성신 2조(팀이름 예시)</div>
      <div className="box">
        {students.map((student, idx) => (
          <div key={student.id} style={{ padding: 5, marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 18 }}>
                {student.id} {student.name}
              </span>
              <button
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                }}
                onClick={() =>
                  setOpenIndex((prev) => (prev === idx ? null : idx))
                }
              >
                {openIndex === idx ? "▲" : "▼"}
              </button>
            </div>
            {openIndex === idx && (
              <ul>
                {(studentTodos[student.id] || []).length === 0 ? (
                  <li style={{ color: "#aaa" }}>할 일이 없습니다.</li>
                ) : (
                  studentTodos[student.id].map((todo, tIdx) => (
                    <li
                      key={tIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <input
                          type="checkbox"
                          checked={!!todo.done}
                          onChange={() => handleToggleDone(student.id, tIdx)}
                          disabled={student.id !== currentUserId}
                          style={{ marginRight: 8 }}
                        />
                        {todo.text}
                        <span className="star-group">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={
                                num <= todo.priority ? "star active" : "star"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </span>
                      </span>
                      {student.id === currentUserId && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTodo(student.id, tIdx)}
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
        ))}
      </div>
    </div>
  );
}

export default LeftContent;
