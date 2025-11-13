// frontend-react/src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import Timer from './components/Timer';
import useChatStream from './hooks/useChatStream'; // ✅ 커스텀 Hook import
import './App.css';

function App() {
  const appTitle = "React 핵심 개념 학습";
  const [showTimer, setShowTimer] = useState(false);
  
  const [chatMessage, setChatMessage] = useState(''); // ✅ 채팅 입력 메시지 상태
 
  // useChatStream Hook 사용: startStreamAction 함수를 받아옵니다.
  const { streamData, isStreaming, error, startStreamAction } = useChatStream(
    'http://localhost:8000/api/stream', // 스트리밍 API URL
    'testUser', // 사용자 ID (임시)
    [], // keywords는 현재 예제에선 필요 없으므로 빈 배열
  );

  useEffect(() => {
    document.title = `${appTitle} | ${showTimer ? '타이머 실행 중' : '타이머 숨김'} ${isStreaming ? '| 스트리밍 중...' : ''}`;
  }, [appTitle, showTimer, isStreaming]);

  // 스트리밍 데이터 수신 변경 감지 
  useEffect(() => {
    if (streamData) {
      console.log('스트리밍 데이터 수신 (App.jsx):', streamData);
    }
  }, [streamData]);

  // error 변경 감지 
  useEffect(() => {
    if (error) {
      console.error('스트리밍 오류 (App.jsx):', error);
    }
  }, [error]);

  // 메시지 전송 핸들러: startStreamAction 함수를 직접 호출합니다.
  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;
    // 실제 앱에서는 여기서 채팅 메시지를 UI에 먼저 추가하고 스트림 호출, 스트림이 완료되면 답변을 업데이트
    console.log(`메시지 전송 요청: ${chatMessage}`);
    startStreamAction(chatMessage); //  useChatStream에서 받은 함수를 직접 호출
    //setChatMessage(''); // 입력창 초기화
  };

  const myEventSourceRef = useRef(null); // EventSource 객체를 저장할 ref
  const [myStreamData, setMyStreamData] = useState('');
  const [myIsStreaming, setMyIsStreaming] = useState(false); 
  const [myError, setMyError] = useState(null);

  // mySampleStream 전용 useEffect (cleanup 역할)
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 또는 이 Effect가 다시 실행되기 전에 기존 연결을 닫습니다.
      if (myEventSourceRef.current) {
        console.log('My Sample Stream: 컴포넌트 언마운트 시 EventSource 연결 정리.');
        myEventSourceRef.current.close();
        myEventSourceRef.current = null;
      }
    };
  }, []); // ✅ 빈 의존성 배열: 마운트 시 한 번만 실행, 언마운트 시 정리

  // 스트림 버튼 샘플 재구현 해보기 
  const mySampleStream = useCallback(() => {
    console.log("mySampleStream 함수가 재생성되었습니다."); // ✅ 함수 재생성 확인용 로그
    if (chatMessage.trim() === '') {
        alert('메시지를 입력하세요.');
        return;
    }
    if (myIsStreaming) {
        console.warn('My Simple Stream: 이미 스트리밍 중입니다.');
        return;
    }
    
    setMyError(null);
    setMyStreamData('');
    setMyIsStreaming(true);


    console.log(`My Sample Stream 전송 요청: ${chatMessage}`);
    
    const path = `http://localhost:8000/api/stream?user_id=quest&message=${encodeURIComponent(chatMessage)}`;
                    
    myEventSourceRef.current = new EventSource(path); // EventSource 생성 및 ref에 저장

    myEventSourceRef.current.onopen = () => {
      console.log('myUseChatStream: EventSource 연결됨.');
    };

    myEventSourceRef.current.onmessage = (event) => {
      console.log('onmessage 수신 ')
      const data = event.data;
      if (data === "[DONE]") {
        console.log('My Sample Stream: 스트리밍 완료.');
        myEventSourceRef.current.close(); // 연결 종료
        myEventSourceRef.current = null;  // ref 비움
        setMyIsStreaming(false); // ✅ 스트리밍 완료 상태로 변경

        // 추가적으로 스트리밍 종료 했을 때 작업이 필요하다면 여기서 진행 
      } else {
        console.log('My Sample Stream: Streamming Data: ', data);
        setMyStreamData(prevData => prevData + data);

      }
    };

    myEventSourceRef.current.onerror = (err) => {
      console.error('My Sample Stream: 스트리밍 오류 발생:', err, 'readyState:', myEventSourceRef.current?.readyState);
      setMyError(err);
      if (myEventSourceRef.current) {
        myEventSourceRef.current.close();
        myEventSourceRef.current = null;
      }
      setMyIsStreaming(false); // ✅ 오류 발생 시 스트리밍 완료 상태로 변경
    };

  }, [chatMessage ]);

  return (
    <div className="app-container">
      <Header message={appTitle} /> 
      
      <section className="main-content">
        <p>아래 카운터는 자체적으로 상태를 관리합니다.</p>
        <Counter /> 

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={() => setShowTimer(!showTimer)}>
            {showTimer ? '타이머 숨기기' : '타이머 보이기'}
          </button>
        </div>

        {showTimer && <Timer />} 

        <div className="streaming-test-area">
            <h2>스트리밍 테스트</h2>
            <div className="streaming-test-input-group">
                <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => {
                        setChatMessage(e.target.value);
                    }}
                    placeholder="스트리밍 메시지 입력"
                />
                <button onClick={handleSendMessage} disabled={isStreaming || chatMessage.trim() === ''}>
                    {isStreaming ? '스트리밍 중...' : '메시지 전송'}
                </button>
            </div>
            {streamData && (
                <p>
                    수신된 스트림: <strong>{streamData}</strong>
                </p>
            )}
            {error && <p className="error-message">에러 발생: {error.message}</p>}
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={mySampleStream} disabled={myIsStreaming} >
            {myIsStreaming ? '스트리밍 중...' : 'My Stream 전송'}
          </button>
          <p>
              수신된 My Stream: <strong>{myStreamData}</strong>
          </p>
          {myError && <p className="error-message">My Stream 에러 발생: {myError.message}</p>}
        
        </div>
        
      </section>
      
      <footer>
        <p>&copy; 2025 React Learning</p>
      </footer>
    </div>
  );
}

export default App;