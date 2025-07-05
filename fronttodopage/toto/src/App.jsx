import React from 'react';
import { useState } from 'react'
import './App.css'

export function SplitLayout({leftContent, rightContent}) {
  return (
    <div className="container">
      <div className="left">{leftContent}</div>
      <div className="right">{rightContent}</div>
    </div>
  );
}

function App() {
  return (
    <SplitLayout
      leftContent={
        <div>
          <div className='teamName'>
            <p>성신 2조(팀이름 예시)</p>
            {/*<marquee>기본적인 방향 왼쪽으로 이동</marquee>*/}
          </div>
          <div className="box">
            <p>20250001 학생1 <button className='toggle_button'>66</button></p>
            <p>20250002 학생2 <button className='toggle_button'>70</button></p>
            <p>20250003 학생3 <button className='toggle_button'>0</button></p>
            <p>20250004 학생4 <button className='toggle_button'>100</button></p>
            <p>20250005 학생5 <button className='toggle_button'>70</button></p>
            <p>20250006 학생6 <button className='toggle_button'>70</button></p>
            <p>20250007 학생7 <button className='toggle_button'>70</button></p>
            <p>20250008 학생8 <button className='toggle_button'>70</button></p>
            {/*
              {array.map((student, i) => (
                <tr key={i}>
                  <td>{student.id}{student.name}</td>
                </tr>
              ))}
            */}
          </div>
        </div>
      }
      //여기 rightContent가 분할 오른쪽 화면 코드작성 공간입니다.
      rightContent={
      <div>
        {/*여기부터 작성해주시면 됩니다.*/}
      </div>
      }
    />
  );
}

export default App
