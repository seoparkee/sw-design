import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css';

// 전역 베이스 URL아그냥고정해버려
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function Login() {
  const [teamName, setTeamName] = useState('');
  const [userID, setUserID] = useState('');
  const [teamPW, setTeamPW] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 저장된 토큰을 전역 헤더에 적용
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common.Authorization = `Token ${token}`;
    else delete axios.defaults.headers.common.Authorization;
  }, []);

  const validateInputs = () => {
    const teamNamePattern = /^[a-zA-Z가-힣]{3,20}$/;
    const idPattern = /^[a-z][a-z0-9]{4,14}$/;
    const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/;

    if (!teamNamePattern.test(teamName)) {
      alert('팀 이름은 한글 또는 영문 3~20자, 특수문자/숫자 제외입니다.');
      return false;
    }
    if (!idPattern.test(userID)) {
      alert('ID는 영문 소문자로 시작하며 숫자 포함 5~15자여야 합니다.');
      return false;
    }
    if (!pwPattern.test(teamPW)) {
      alert('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.');
      return false;
    }
    return true;
  };
  //as a mode 4 alert login(join and create)
  const handleSubmit = async (mode = 'join') => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/login/', {
        teamName,
        userID,
        password: teamPW, mode,
      });
      console.log('[login] raw response:', data);

      const rawAction = data?.action ?? data?.Action ?? data?.result ?? data?.status ?? '';
      const action = String(rawAction).trim().toLowerCase();
      const isCreateByServer = action.includes('create') && (action.includes('team') || action.includes('new'));
      const isJoinByServer   = action.includes('join') || (action.includes('create') && action.includes('member'));

    
    if (isCreateByServer || mode === 'create') {
      window.alert(`${teamName} TOTO가 생성되었습니다!`);
    } else if (isJoinByServer || mode === 'join') {
      window.alert(`${teamName} TOTO에 Join!`);
    } else {
      console.warn('[login] Unrecognized action. rawAction:', rawAction, 'response:', data);
      window.alert('Create와 Join에 오류가 발생하였습니다.');
    }
      if (!data?.token) {
        alert('로그인 실패');
        return;
      }

      // 토큰 저장 + 전역 헤더
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common.Authorization = `Token ${data.token}`;

      //최소한의 정보만 저장할 것, 비밀번호 제외
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.teamname) localStorage.setItem('teamName', data.user.teamname);
        if (data.user.userID)   localStorage.setItem('userID', data.user.userID);
        if (data.user.userNum)  localStorage.setItem('userNum', data.user.userNum);
        if (data.user.id)       localStorage.setItem('userNum', data.user.id); 
      }


      navigate('/toto', { replace: true });
    } catch (err) {
      console.error('로그인 에러 :', err.response?.data || err.message);
      alert(err.response?.data?.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '300px',
    height: '40px',
    fontSize: '16px',
    marginBottom: '10px',
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!loading) handleSubmit();
  };  

  return (
    <div className="login-container">
      <div className="background-wrapper">
        <form className="login-box" onSubmit={onSubmit} >
          <label>TOTO</label>
          <div></div>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={inputStyle}
            autoComplete="organization"
          />
          <div></div>
          <input
            type="text"
            placeholder="ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            style={inputStyle}
            autoComplete="username"
          />
          <div></div>
          <input
            type="password"
            placeholder="PASSWORD"
            value={teamPW}
            onChange={(e) => setTeamPW(e.target.value)}
            style={inputStyle}
            autoComplete="current-password"
          />
        </form>  
        <div style={{ position: "relative", width:"100%", minHeight:"100dvh", pointerEvents:"none"  }}>
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 10, zIndex:10,pointerEvents:"auto" }}>
            <button style={{ width: 50, height: 50, backgroundColor: "#eee", color: "#555", border: "3px solid #000", borderRadius: "50%", cursor: "pointer", fontWeight: "bold", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => alert('notion ')}>?</button>
            <button style={{ width: 70, height: 50, backgroundColor: "#eee", borderColor: "3px solid #000" ,color: "#555", cursor: "pointer", fontWeight: "bold", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => alert('notion ')}>About Us</button>
          </div>
        </div>
        <div className="bus-buttons">
          <button type="button" className="btn" onClick={()=> handleSubmit('create')} disabled={loading}>
            {loading ? 'loading...' : 'Create'}
          </button>
          <button type="button" className="btn" onClick={()=>handleSubmit('join')} disabled={loading}>
            {loading ? 'loading...' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
