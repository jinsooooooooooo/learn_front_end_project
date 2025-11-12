// src/components/Counter.jsx

import React, { useState } from 'react';
// CSS 파일은 동일 폴더에 있으므로 './Counter.css'로 import 합니다.
import './Counter.css'; 

/**
 * 카운터 컴포넌트: React의 상태 관리(useState) 및 함수 기반 업데이트를 시연
 */
function Counter() {
  // 상태 변수 선언: [현재 상태 값, 상태 업데이트 함수] = 초기값(0)
  const [count, setCount] = useState(0);

  // ✅ 함수 기반 업데이트를 사용하는 함수 (권장: 이전 상태에 의존할 때)
  const handleIncrement = () => {
    // setCount에 함수(Callback)를 전달하여, React가 보장하는 최신 상태(prevCount)를 사용합니다.
    setCount(prevCount => prevCount + 1);
    
    // (만약 한 번의 클릭에 3을 증가시키려면 이렇게 세 번 호출해야 안전합니다.)
    // setCount(prevCount => prevCount + 1);
    // setCount(prevCount => prevCount + 1);
  };

  // ❌ 값 기반 업데이트의 한계를 보여주는 함수 (이전 상태에 의존할 때 비추천)
  // 이 버튼은 눌러도 한 번에 1만 증가합니다.
  const handleUnsafeIncrementThree = () => {
    // 현재 count 값(예: 0)에 1을 더한 '1'을 세 번 예약합니다.
    setCount(count + 1); 
    setCount(count + 1); 
    setCount(count + 1); 

    console.log(`불안전 업데이트 요청: 현재 count(${count})에 기반하여 예약되었습니다.`);
  };


  return (
    <div className="counter-container">
      <h2>현재 카운트: <span className="count-display">{count}</span></h2>
      
      <div className="button-group">
        <button 
          onClick={handleIncrement} 
          className="safe-btn"
        >
          ✅ 안전하게 +1 증가
        </button>
        
        <button 
          onClick={handleUnsafeIncrementThree} 
          className="unsafe-btn"
        >
          ❌ 불안전하게 +3 시도 (실제로는 +1)
        </button>
      </div>
    </div>
  );
}

export default Counter;