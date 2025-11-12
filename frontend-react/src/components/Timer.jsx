// frontend-react/src/components/Timer.jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('Timer 컴포넌트가 마운트되었습니다. 타이머를 시작합니다.');
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1); // 이전 상태를 기반으로 업데이트
    }, 1000);

    // ✅ cleanup 함수: 컴포넌트가 언마운트될 때 (사라질 때) 타이머를 정리합니다.
    // 이 함수가 없으면 컴포넌트가 사라져도 타이머는 계속 작동하여 메모리 누수를 일으킵니다.
    return () => {
      console.log('Timer 컴포넌트가 언마운트되거나 다시 렌더링되기 전에 타이머를 정리합니다.');
      clearInterval(intervalId);
    };
  }, []); // ✅ 빈 의존성 배열: 마운트 시 한 번만 실행, 언마운트 시 정리

  return (
    <div className="timer-card">
      <h2>타이머: {seconds} 초</h2>
      <p>이 타이머는 컴포넌트가 화면에 있을 때만 작동합니다.</p>
    </div>
  );
}

export default Timer;