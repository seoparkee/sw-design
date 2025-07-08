import { useState } from "react";

// 할 일 추가 폼
function AddTodoForm({ onAdd }) {
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState(0);

  const handleAdd = () => {
    if (todo.trim()) {
      onAdd(todo, priority);
      setTodo("");
      setPriority(0);
    }
  };

  return (
    <div
      style={{
        width: 300,
        padding: 16,
        borderRadius: 0,
        flexDirection: "column",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        margin: "20px -15px",
      }}
    >
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        style={{
          width: "350px",
          padding: 10,
          fontSize: 16,
        }}
      />
      <div style={{ margin: "12px 0" }}>
        <label>
          <strong>중요도:</strong>{" "}
        </label>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => setPriority(num)}
            style={{
              cursor: "pointer",
              color: num <= priority ? "yellow" : "white",
              fontSize: 24,
              userSelect: "none",
              marginRight: 4,
            }}
          >
            ★
          </span>
        ))}
      </div>
      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#1976d2",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        TODO 추가
      </button>
    </div>
  );
}

// 사람별 할 일 완료율 표
function TodoCompletionTable({ data }) {
  return (
    <table
      style={{
        marginTop: 0,
        borderCollapse: "collapse",
        fontSize: 15,
        background: "white",
        position: "absolute",
        bottom: "22%",
        left: "80.7%",
        transform: "translate(-72.3%, 0)",
        width: 387,
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              borderBottom: "2px solid #1976d2",
              padding: 8,
              textAlign: "left",
              color: "#1976d2",
              background: "#f5faff",
            }}
          >
            ID
          </th>
          <th
            style={{
              borderBottom: "2px solid #1976d2",
              padding: 8,
              textAlign: "center",
              color: "#1976d2",
              background: "#f5faff",
            }}
          >
            할 일 개수
          </th>
          <th
            style={{
              borderBottom: "2px solid #1976d2",
              padding: 8,
              textAlign: "center",
              color: "#1976d2",
              background: "#f5faff",
            }}
          >
            할 일 완료율 (%)
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, totalTodos, completionRate }) => (
          <tr key={id}>
            <td
              style={{
                borderBottom: "1px solid #eee",
                padding: 8,
                background: "#fff",
              }}
            >
              {id}
            </td>
            <td
              style={{
                borderBottom: "1px solid #eee",
                padding: 0,
                textAlign: "center",
                background: "#fff",
              }}
            >
              {totalTodos}
            </td>
            <td
              style={{
                borderBottom: "1px solid #eee",
                padding: 0,
                textAlign: "center",
                background: "#fff",
              }}
            >
              {completionRate}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 오른쪽 콘텐츠 전체
function RightContent({ onAddTodo, completionRate }) {
  // 예시 데이터 (실제로는 props나 상태로 관리 가능)
  const [todoStats, setTodoStats] = useState([
    { id: "user1", totalTodos: 10, completionRate: 80 },
    { id: "user2", totalTodos: 7, completionRate: 57 },
    { id: "user3", totalTodos: 15, completionRate: 93 },
    { id: "user4", totalTodos: 5, completionRate: 40 },
  ]);

  // 할 일 추가 시 통계 갱신 (예시)
  const handleAddTodo = (todo, priority) => {
    // 실제로는 할 일 데이터와 사용자 정보에 따라 통계 갱신
    // 여기서는 예시로 첫 번째 유저의 할 일 개수와 완료율만 증가
    setTodoStats((prev) =>
      prev.map((stat, idx) =>
        idx === 0
          ? {
              ...stat,
              totalTodos: stat.totalTodos + 1,
              completionRate: Math.min(100, stat.completionRate + 2),
            }
          : stat
      )
    );
    if (onAddTodo) onAddTodo(todo, priority);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* 전체 진행률 원 */}
      <div
        className="progress-circle"
        style={{ position: "relative", width: 122, height: 122 }}
      >
        <svg width="122" height="122" style={{ display: "block" }}>
          <circle cx="61" cy="61" r="54" stroke="none" fill="#e3f2fd" />
          <circle
            cx="61"
            cy="61"
            r="54"
            stroke="#1976d2"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - completionRate / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
          <text
            x="61"
            y="50"
            textAnchor="middle"
            fontSize="0.9rem"
            fill="#1976d2"
            fontWeight="bold"
            dominantBaseline="middle"
          >
            전체 진행률
          </text>
          <text
            x="61"
            y="75"
            textAnchor="middle"
            fontSize="1.3rem"
            fill="#000"
            fontWeight="bold"
            dominantBaseline="middle"
          >
            {Math.round(completionRate)}%
          </text>
        </svg>
      </div>

      {/* 오른쪽 흰 부분에 할 일 추가 폼 */}
      <div style={{ marginTop: 40, width: 300 }}>
        <AddTodoForm onAdd={handleAddTodo} />

        {/* 추가 버튼 아래에 표 추가 */}
        <TodoCompletionTable data={todoStats} />
      </div>
    </div>
  );
}

export default RightContent;
