import { useState } from "react";
import "./App.css";
import RightContent from "./RightContent";
import LeftContent from "./LeftContent";

export function SplitLayout({ leftContent, rightContent }) {
  return (
    <div className="container">
      <div className="left">{leftContent}</div>
      <div className="right">{rightContent}</div>
    </div>
  );
}

function Toto() {
  const students = [
    { id: "20250001", name: "학생1" },
    { id: "20250002", name: "학생2" },
    { id: "20250003", name: "학생3" },
    { id: "20250004", name: "학생4" },
    { id: "20250005", name: "학생5" },
    { id: "20250006", name: "학생6" },
    { id: "20250007", name: "학생7" },
    { id: "20250008", name: "학생8" },
    { id: "20250009", name: "학생9" },
    { id: "20250010", name: "학생10" },
  ];

  const [currentUserId] = useState("20250001");

  const [studentTodos, setStudentTodos] = useState({
    20250001: [],
    20250002: [],
    20250003: [],
    20250004: [],
    20250005: [],
    20250006: [],
    20250007: [],
    20250008: [],
    20250009: [],
    20250010: [],
  });

  const [openIndex, setOpenIndex] = useState(null);

  const handleAddTodo = (text, priority) => {
    setStudentTodos((prev) => ({
      ...prev,
      [currentUserId]: [
        ...(prev[currentUserId] || []),
        { text, priority, done: false },
      ],
    }));
  };

  const handleDeleteTodo = (studentId, idx) => {
    setStudentTodos((prev) => ({
      ...prev,
      [studentId]: prev[studentId].filter((_, i) => i !== idx),
    }));
  };

  const handleToggleDone = (studentId, idx) => {
    setStudentTodos((prev) => ({
      ...prev,
      [studentId]: prev[studentId].map((todo, i) =>
        i === idx ? { ...todo, done: !todo.done } : todo
      ),
    }));
  };

  const allTodos = Object.values(studentTodos).flat();
  const total = allTodos.length;
  const completed = allTodos.filter((todo) => todo.done).length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return (
    <SplitLayout
      leftContent={
        <LeftContent
          students={students}
          currentUserId={currentUserId}
          studentTodos={studentTodos}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
          handleToggleDone={handleToggleDone}
          handleDeleteTodo={handleDeleteTodo}
        />
      }
      rightContent={
        <RightContent
          onAddTodo={handleAddTodo}
          completionRate={completionRate}
        />
      }
    />
  );
}

export default Toto;
