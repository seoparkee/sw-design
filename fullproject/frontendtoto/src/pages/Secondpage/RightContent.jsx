import { useState, useEffect } from "react";

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
    <div style={{ width: "100%", maxWidth: "390px", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto", boxSizing: "border-box" }}>
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        style={{ width: "100%", padding: 10, fontSize: 16, boxSizing: "border-box" }}
      />
      <div style={{ margin: "10px 0", width: "100%", textAlign: "center" }}>
        <label style={{ marginRight: 8 }}><strong>중요도:</strong> </label>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => setPriority(num)}
            style={{ cursor: "pointer", color: num <= priority ? "yellow" : "lightgray", fontSize: 24, userSelect: "none", marginRight: 4 }}
          >
            ★
          </span>
        ))}
      </div>
      <button
        onClick={handleAdd}
        style={{ width: "80%", padding: 10, backgroundColor: "#1976d2", color: "white", fontWeight: "bold", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        TODO 추가
      </button>
    </div>
  );
}

function TodoCompletionTable({ data }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, background: "white" }}>
      <thead>
        <tr>
          <th style={thStyle}>Member</th>
          <th style={thStyleCenter}>할 일 개수</th>
          <th style={thStyleCenter}>할 일 완료율 (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, name, totalTodos, completionRate, }) => (
          <tr key={id}>
            <td style={tdStyle}>{name}</td>
            <td style={tdStyleCenter}>{totalTodos}</td>
            <td style={tdStyleCenter}>{completionRate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = { borderBottom: "2px solid #1976d2", padding: 8, textAlign: "left", color: "#1976d2", background: "#f5faff" };
const thStyleCenter = { ...thStyle, textAlign: "center" };
const tdStyle = { borderBottom: "1px solid #eee", padding: 8, background: "#fff" };
const tdStyleCenter = { ...tdStyle, padding: 0, textAlign: "center" };

// 오른쪽 콘텐츠 전체
function RightContent({ onAddTodo, completionRate, students, studentTodos, displayIdMap }) {
  const [todoStats, setTodoStats] = useState([]);

  useEffect(() => {
    const stats = students.map((student) => {
      const todos = studentTodos[student.id] || [];
      const total = todos.length;
      const completed = todos.filter((t) => !!t.done).length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { id: student.id, 
              name:student.name ?? student.userId ?? String(student.id),
              totalTodos: total, 
              completionRate: rate,  };
    });
    setTodoStats(stats);
  }, [students, studentTodos]);

  //  currentUserId를 localStorage에서 직접 가져옴
  const currentUserId = localStorage.getItem("userID");

  const handleAddTodo = (todo, priority) => {
    if (!currentUserId) {
      console.error("currentUserId 없음");
      return;
    }
    onAddTodo(todo, priority);
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 10 }}>
        <button style={{ width: 50, height: 50, backgroundColor: "#eee", color: "#555", border: "none", borderRadius: "50%", cursor: "pointer", fontWeight: "bold", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => alert('')}>?</button>
      </div>
      

      {/* 진행률 */}
      <div className="progress-circle" style={{ position: "relative", width: 122, height: 122 }}>
        <svg width="122" height="122" style={{ display: "block" }}>
          <circle cx="61" cy="61" r="54" stroke="none" fill="#e3f2fd" />
          <circle cx="61" cy="61" r="54" stroke="#1976d2" strokeWidth="10" fill="none"
            strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - completionRate / 100)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
          <text x="61" y="50" textAnchor="middle" fontSize="0.9rem" fill="#1976d2" fontWeight="bold" dominantBaseline="middle">전체 진행률</text>
          <text x="61" y="75" textAnchor="middle" fontSize="1.3rem" fill="#000" fontWeight="bold" dominantBaseline="middle">{Math.round(completionRate)}%</text>
        </svg>
      </div>

      {/* 입력 폼 */}
      <div style={{ width: "100%", maxWidth: "390px", marginTop: 70 }}>
        <AddTodoForm onAdd={handleAddTodo} />
      </div>

      {/* 개인별 통계 */}
      <div style={{ width: "100%", maxWidth: "388px", background: "white", height: "338px", overflowY: "auto" }}>
        <TodoCompletionTable data={todoStats} displayIdMap={displayIdMap} />
      </div>
    </div>
  );
}

export default RightContent;
