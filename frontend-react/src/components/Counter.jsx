// frontend-react/src/components/Counter.jsx
import React, { useState } from 'react'; 
// useState Hook을 사용하기 위해 import 합니다.

function Counter() {
  // count라는 state 변수와 이를 업데이트할 setCount 함수를 선언하고 초기값을 0으로 설정합니다.
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1); // setCount 함수를 호출하여 count state를 1 증가시킵니다.
    // 상태 업데이트 함수를 호출하면 컴포넌트가 재렌더링됩니다.
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1); // count state를 1 감소시킵니다.
  };

  return (
    <div className="counter-card">
      <h2>현재 카운트: {count}</h2>
      <button onClick={increment}>증가 (+)</button>
      <button onClick={decrement} style={{ marginLeft: '10px' }}>감소 (-)</button>
    </div>
  );
}

export default Counter;