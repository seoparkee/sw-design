import React, { useEffect, useMemo, useState, useCallback } from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

export function SplitLayout({ leftContent, rightContent }) {
  return (
    <div className="container">
      <div className="left">{leftContent}</div>
      <div className="right">{rightContent}</div>
    </div>
  );
}

function Toto() {
  const navigate = useNavigate();

  function memberTasksUrl(id) {
    return `member/${id}/tasks/`; // 멤버별 할일
  }
  function taskDetailUrl(taskNum) {
    return `tasks/${taskNum}/`; // 할일 상세
  }

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const teamNum = storedUser?.teamnum ?? storedUser?.teamNum ?? null;
  const [teamName, setTeamName] = useState(storedUser?.teamname || "To do Together");
  const [currentUserId, setCurrentUserId] = useState(storedUser?.userNum ?? storedUser?.id ?? null);

  const [students, setStudents] = useState([]); // [{ id, name }]
  const [studentTodos, setStudentTodos] = useState({}); // { [userNum]: Task[] }
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayIdMap = useMemo(
    () => Object.fromEntries(students.map((s) => [String(s.id), s.seq])),
    [students]
  );

  // 초기 데이터
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !storedUser?.userID || !teamNum) {
      console.warn("로그인 정보가 없어 /toto 데이터를 불러올 수 없습니다.");
      return;
    }

    (async () => {
      setLoading(true);
      try {
        // 1) 팀 멤버
        const { data: teamData } = await axiosInstance.get(`team/${teamNum}/members/`);
        const members = teamData?.members ?? [];
        const getJoinTime = (m) =>
          new Date(m.joinedAt ?? m.joinAt ?? m.createdAt ?? m.created ?? 0).getTime();

        const normalized = members
          .slice()
          .sort((a, b) => getJoinTime(a) - getJoinTime(b))
          .map((m, i) => ({
            id: m.userNum ?? m.id,
            name: m.userID,
            seq: i + 1,
          }));

        setStudents(normalized);
        setTeamName(storedUser?.teamname || "To do Together");
        setCurrentUserId(storedUser?.userNum ?? storedUser?.id);

        // 2) 각 멤버 할 일 병렬
        const entries = await Promise.all(
          normalized.map(async (m) => {
            const r = await axiosInstance.get(memberTasksUrl(m.id));
            return [m.id, r.data || []];
          })
        );
        setStudentTodos(Object.fromEntries(entries));
      } catch (err) {
        console.error("초기 데이터 불러오기 실패:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [storedUser, teamNum]);

  // 전체 진행률
  const completionRate = useMemo(() => {
    const lists = Object.values(studentTodos);
    const { total, done } = lists.reduce(
      (acc, arr) => {
        const a = Array.isArray(arr) ? arr : [];
        acc.total += a.length;
        acc.done += a.filter((t) => !!t.done).length;
        return acc;
      },
      { total: 0, done: 0 }
    );
    return total ? Math.round((done / total) * 100) : 0;
  }, [studentTodos]);

  // 내 할 일 추가
  const addMyTodo = useCallback(
    async (title, priority) => {
      if (!currentUserId) return alert("로그인 정보가 없어요.");
      const pr = Math.max(1, Math.min(5, Number(priority) || 1));
      try {
        await axiosInstance.post(memberTasksUrl(currentUserId), {
          title, // serializers가 content로 매핑
          done: false,
          priority: pr,
        });

        const { data } = await axiosInstance.get(memberTasksUrl(currentUserId));
        setStudentTodos((prev) => ({ ...prev, [currentUserId]: data || [] }));
      } catch (e) {
        console.error("할 일 추가 실패:", e.response?.data || e.message);
        alert("할 일 추가에 실패했어요.");
      }
    },
    [currentUserId]
  );

  // 멤버 한 명의 TODO 목록 다시 불러오기
  const refreshMemberTasks = async (memberId) => {
    const { data } = await axiosInstance.get(memberTasksUrl(memberId));
    setStudentTodos((prev) => ({ ...prev, [memberId]: data || [] }));
  };

  // POST는 member/<id>/tasks/ 로!
  const handleAddTodo = async (title, priority) => {
    if (!currentUserId) return alert("로그인 정보가 없어요.");
    const pr = Math.max(1, Math.min(5, Number(priority) || 1));
    try {
      await axiosInstance.post(memberTasksUrl(currentUserId), {
        title,
        priority: pr,
        done: false,
      });
      await refreshMemberTasks(currentUserId);
    } catch (e) {
      console.error("할 일 추가 실패:", e.response?.data || e.message);
      alert("할 일 추가에 실패했어요.");
    }
  };

  // 완료 토글
  const handleToggleDone = async (taskNum) => {
    const myList = studentTodos[currentUserId] || [];
    const t = myList.find((x) => x.taskNum === taskNum);
    if (!t) return;

    try {
      await axiosInstance.patch(taskDetailUrl(taskNum), { done: !t.done });
      await refreshMemberTasks(currentUserId);
    } catch (e) {
      console.error("완료 토글 실패:", e.response?.data || e.message);
    }
  };

  // 삭제(본인 것만)
  const handleDeleteTodo = async (taskNum, ownerUserNum) => {
    if (String(ownerUserNum) !== String(currentUserId)) {
      return alert("내 할 일만 삭제할 수 있어요.");
    }
    try {
      await axiosInstance.delete(taskDetailUrl(taskNum), {
        data: { member: currentUserId },
      });
      await refreshMemberTasks(currentUserId);
    } catch (e) {
      console.error("삭제 실패:", e.response?.data || e.message);
    }
  };

  // 로그아웃
  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("logout/");
    } catch (e) {
      console.warn("logout request failed (ignored):", e?.message || e);
    }

    // 로컬 정리
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("teamName");
      localStorage.removeItem("userID");
      localStorage.removeItem("userNum");
      if (axiosInstance?.defaults?.headers?.common?.Authorization) {
        delete axiosInstance.defaults.headers.common.Authorization;
      }
    } finally {
      // 상태 초기화 후 이동
      setStudents([]);
      setStudentTodos({});
      setCurrentUserId(null);
      setTeamName("To do Together");
      try {
        navigate("/", { replace: true });
      } catch {
        window.location.assign("/");
      }
    }
  }, [navigate]);

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
          teamName={teamName}
          displayIdMap={displayIdMap}
          onLogout={handleLogout}
        />
      }
      rightContent={
        <RightContent
          onAddTodo={handleAddTodo}
          completionRate={completionRate}
          students={students}
          studentTodos={studentTodos}
          displayIdMap={displayIdMap}
          currentUserId={currentUserId}
        />
      }
    />
  );
}

export default Toto;
