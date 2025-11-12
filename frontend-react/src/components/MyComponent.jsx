// frentend-react\src\components\MyCompnoent.jsx
import React, { useEffect, useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  // 1. 기본 사용법 (렌더링될 때마다 실행)
  useEffect(() => {
    console.log('컴포넌트가 렌더링될 때마다 이 효과가 실행됩니다.');
    // cleanup 함수 (선택 사항): 컴포넌트가 언마운트되거나 다음 효과가 실행되기 전에 호출됩니다.
    return () => {
      console.log('이전 효과가 정리됩니다.');
    };
  }); // 💥 의존성 배열이 없으면 매 렌더링마다 실행 (거의 사용 안 함)

  // 2. 마운트될 때 한 번만 실행 (데이터 가져오기, 이벤트 리스너 등록)
  useEffect(() => {
    console.log('컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.');
    // 이벤트 리스너 등록
    const handleScroll = () => console.log('스크롤!');
    window.addEventListener('scroll', handleScroll);

    // cleanup 함수: 컴포넌트가 언마운트될 때 (DOM에서 제거될 때) 호출됩니다.
    return () => {
      console.log('컴포넌트가 언마운트될 때 스크롤 이벤트 리스너가 제거됩니다.');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // ✅ 빈 의존성 배열: 마운트 시 한 번만 실행, 언마운트 시 정리

  // 3. 특정 State/Props가 변경될 때만 실행
  useEffect(() => {
    console.log(`count 값이 변경되었습니다: ${count}`);
    // count 값이 변경될 때마다 특정 API를 호출하거나 로직을 실행
  }, [count]); // ✅ 의존성 배열에 count를 넣으면 count가 변경될 때마다 실행

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}


export default MyComponent;

