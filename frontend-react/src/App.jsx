// frontend-react/src/App.jsx
import React, { useState, useEffect } from 'react'; // useState와 useEffect Hook import
import Header from './components/Header';
import Counter from './components/Counter';
import Timer from './components/Timer'; // Timer 컴포넌트 import
import './App.css';

function App() {
  const appTitle = "React 핵심 개념 학습";
  const [showTimer, setShowTimer] = useState(false); // Timer 컴포넌트를 보여줄지 말지 결정하는 state

  // ✅ useEffect를 사용하여 문서 제목 변경
  useEffect(() => {
    console.log(document.title);
    document.title = `${appTitle} | 현재 ${showTimer ? '타이머 실행 중' : '타이머 숨김'}`;
    console.log('문서 제목이 변경되었습니다.');

  }, [appTitle, showTimer]); // appTitle 또는 showTimer 값이 변경될 때마다 실행

  return (
    <div className="app-container">
      <Header message={appTitle} /> 
      
      <section className="main-content">
        <p>아래 카운터는 자체적으로 상태를 관리합니다.</p>
        <Counter /> 

        {/* ✅ 버튼 클릭에 따라 Timer 컴포넌트를 조건부 렌더링 */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={() => setShowTimer(!showTimer)}>
            {showTimer ? '타이머 숨기기' : '타이머 보이기'}
          </button>
        </div>

        {/* showTimer가 true일 때만 Timer 컴포넌트를 렌더링 */}
        {showTimer && <Timer />} 
        
      </section>
      
      <footer>
        <p>&copy; 2025 React Learning</p>
      </footer>
    </div>
  );
}

export default App;