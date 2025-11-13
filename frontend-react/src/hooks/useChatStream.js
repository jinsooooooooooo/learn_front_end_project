// frontend-react/src/hooks/useChatStream.js
import { useState, useEffect, useRef, useCallback } from 'react';


// messages 상태 타입 정의 (앞으로 활용할 예정)
// type Message = { type: 'user' | 'agent', contentType: 'text' | 'html', content: string };


// useChatStream 커스텀 Hook 정의
// apiUrl: 스트리밍 API의 기본 URL (예: "/api/stream")
// userId: 현재 사용자 ID
// keywords: 뉴스 검색 등의 키워드 배열 (선택 사항)

// useChatStream 커스텀 Hook 정의 (가장 단순한 스트리밍 테스트 버전)
// Hook은 이제 스트림을 시작하는 'startStreamAction' 함수를 반환합니다.
function useChatStream(apiUrl, userId, keywords = []) { // ✅ message와 trigger는 이제 props로 받지 않음
  const [streamData, setStreamData] = useState(''); // 스트리밍된 데이터를 누적할 상태
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null); // EventSource 객체를 저장할 ref

  // ✅ 스트림을 시작하는 함수를 Hook이 반환하도록 합니다.
  const startStreamAction = useCallback(async (messageToStream) => { // ✅ 메시지를 인자로 받음
    // message가 없거나, 이미 스트리밍 중이라면 효과를 실행하지 않습니다.
    if (!messageToStream || isStreaming) {
      console.warn("useChatStream: 메시지가 없거나 이미 스트리밍 중이므로 새 스트림을 시작하지 않습니다.");
      return;
    }

    // 이전 스트림이 있다면 강제 종료 (클린업은 주로 컴포넌트 언마운트 시)
    if (eventSourceRef.current) {
        console.log('useChatStream: 기존 EventSource 연결 강제 정리.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
    }

    setError(null);       // 새로운 스트림 시작 전에 에러 초기화
    setStreamData('');    
    setIsStreaming(true); // 스트리밍 시작 상태로 변경

    const fullUrl = `${apiUrl}?user_id=${userId}&message=${encodeURIComponent(messageToStream)}` +
                    (keywords.length > 0 ? `&keywords=${encodeURIComponent(keywords.join(','))}` : '');
    
    eventSourceRef.current = new EventSource(fullUrl); // EventSource 생성 및 ref에 저장


    eventSourceRef.current.onopen = () => {
      console.log('useChatStream: EventSource 연결됨.');
    };

    eventSourceRef.current.onmessage = (event) => {
      console.log('onmessage 수신 ')
      const data = event.data;
      if (data === "[DONE]") {
        console.log('useChatStream: 스트리밍 완료.');
        setIsStreaming(false);          // 스트리밍 완료 상태로 변경
        eventSourceRef.current.close(); // 연결 종료
        eventSourceRef.current = null;  // ref 비움
      } else {
        console.log('Streamming Data: ', data);
        setStreamData(prevData => prevData + data); // 수신받은 계속 토큰 추가
      }
    };

    eventSourceRef.current.onerror = (err) => {
      console.error('useChatStream: 스트리밍 오류 발생:', err);
      setError(err); // 에러 상태 설정
      setIsStreaming(false); // 스트리밍 완료 상태로 변경
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [apiUrl, userId, keywords, isStreaming]); // ✅ isStreaming은 중복 방지 로직에 사용되므로 의존성에 포함

  // useEffect는 컴포넌트 언마운트 시에만 정리 역할을 합니다.
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        console.log('useChatStream: 컴포넌트 언마운트 시 EventSource 연결 정리.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []); // useEffect는 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행

  // Hook이 반환하는 값들 (스트림 시작 함수 포함)
  return { streamData, isStreaming, error, startStreamAction };
}

export default useChatStream;