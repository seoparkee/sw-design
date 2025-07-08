import { useState } from 'react';
import './App.css';
import gripImage from './assets/grip.png';
import RightContent from './RightContent';
import LeftContent from './LeftContent';

export function SplitLayout({ leftContent, rightContent }) {
  return (
    <div className="container">
      <div className="left">{leftContent}</div>
      <div className="right">{rightContent}</div>
    </div>
  );
}

function App() {
  // 학생 정보(학번, 이름)
  const students = [
    { id: '20250001', name: '학생1' },
    { id: '20250002', name: '학생2' },
    { id: '20250003', name: '학생3' },
    { id: '20250004', name: '학생4' },
    { id: '20250005', name: '학생5' },
    { id: '20250006', name: '학생6' },
    { id: '20250007', name: '학생7' },
    { id: '20250008', name: '학생8' },
    { id: '20250009', name: '학생9' },
    { id: '20250010', name: '학생10' },
  ];

  // 로그인한 학생 id
  const [currentUserId] = useState('20250001');

  // 학생별 할 일 목록 (각 todo: { text, priority, done })
  const [studentTodos, setStudentTodos] = useState({
    '20250001': [],
    '20250002': [],
    '20250003': [],
    '20250004': [],
    '20250005': [],
    '20250006': [],
    '20250007': [],
    '20250008': [],
    '20250009': [],
    '20250010': [],
  });

  // 펼쳐진 학생 인덱스 (아코디언)
  const [openIndex, setOpenIndex] = useState(null);

  // 할 일 추가
  const handleAddTodo = (text, priority) => {
    setStudentTodos(prev => ({
      ...prev,
      [currentUserId]: [...(prev[currentUserId] || []), { text, priority, done: false }]
    }));
  };

  // 할 일 삭제
  const handleDeleteTodo = (studentId, idx) => {
    setStudentTodos(prev => ({
      ...prev,
      [studentId]: prev[studentId].filter((_, i) => i !== idx)
    }));
  };

  // 할 일 완료 토글
  const handleToggleDone = (studentId, idx) => {
    setStudentTodos(prev => ({
      ...prev,
      [studentId]: prev[studentId].map((todo, i) =>
        i === idx ? { ...todo, done: !todo.done } : todo
      )
    }));
  };

  // 전체 진행률 계산 (RightContent로 전달)
  const allTodos = Object.values(studentTodos).flat();
  const total = allTodos.length;
  const completed = allTodos.filter(todo => todo.done).length;
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

export default App;