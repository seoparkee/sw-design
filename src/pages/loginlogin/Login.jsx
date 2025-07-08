import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginpage.css';

function Login() {
  const [teamName, setTeamName] = useState('');
  const [userID, setUserID] = useState('');
  const [teamPW, setTeamPW] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const teamNamePattern = /^[a-zA-Z가-힣]{3,20}$/;
    const idPattern = /^[a-z][a-z0-9]{4,14}$/;
    const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/;

    if (!teamNamePattern.test(teamName)) {
      alert('팀 이름은 한글 또는 영문 3~20자, 특수문자/숫자 제외입니다.');
      return;
    }
    if (!idPattern.test(userID)) {
      alert('ID는 영문 소문자로 시작하며 숫자 포함 5~15자여야 합니다.');
      return;
    }
    if (!pwPattern.test(teamPW)) {
      alert('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.');
      return;
    }

    alert(`${teamName} TOTO가 생성되었습니다!`);
    navigate('/toto');
  };

  const inputStyle = {
    width: '300px',
    height: '40px',
    fontSize: '16px',
    marginBottom: '10px'
  };

  return (
    <div className="login-container">
      <div className="background-wrapper">
        <div className="login-box">
          <label>TOTO</label>
          <div></div>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={inputStyle}
          />
          <div></div>
          <input
            type="text"
            placeholder="ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            style={inputStyle}
          />
          <div></div>
          <input
            type="password"
            placeholder="PASSWORD"
            value={teamPW}
            onChange={(e) => setTeamPW(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div className="bus-buttons">
          <button className="btn" onClick={validateForm}>Create</button>
          <button className="btn">Join</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
