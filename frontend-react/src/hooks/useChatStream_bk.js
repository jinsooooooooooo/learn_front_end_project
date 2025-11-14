// frontend-react/src/hooks/useChatStream.js
import { useState, useEffect, useRef, useCallback } from 'react';

// useChatStream 커스텀 Hook 정의 (onClick 직접 호출 버전)
function useChatStream(apiUrl, userId, keywords = []) { // ✅ message와 trigger는 props로 받지 않음
  const [streamData, setStreamData] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null); // EventSource 객체를 저장할 ref

  // ✅ 스트림을 시작하는 함수를 Hook이 반환하도록 합니다.
  const startStreamAction = useCallback(async (messageToStream) => { // ✅ 메시지를 인자로 받음
    if (!messageToStream || isStreaming) {
      console.warn("useChatStream: 메시지가 없거나 이미 스트리밍 중이므로 새 스트림을 시작하지 않습니다.");
      return;
    }

    if (eventSourceRef.current) {
        console.log('useChatStream: 기존 EventSource 연결 강제 정리.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
    }

    setError(null);
    setStreamData('');
    setIsStreaming(true);

    const fullUrl = `${apiUrl}?user_id=${userId}&message=${encodeURIComponent(messageToStream)}` +
                    (keywords.length > 0 ? `&keywords=${encodeURIComponent(keywords.join(','))}` : '');
    
    try {
        eventSourceRef.current = new EventSource(fullUrl);

        eventSourceRef.current.onopen = () => { console.log('useChatStream: EventSource 연결됨.'); };
        eventSourceRef.current.onmessage = (event) => {
          const data = event.data;
          if (data === "[DONE]") {
            console.log('useChatStream: 스트리밍 완료.');
            setIsStreaming(false);
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          } else {
            setStreamData(prevData => prevData + data);
          }
        };
        eventSourceRef.current.onerror = (err) => {
          console.error('useChatStream: 스트리밍 오류 발생:', err, 'readyState:', eventSourceRef.current?.readyState);
          setError(err);
          setIsStreaming(false);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        };
    } catch (e) {
        console.error("useChatStream: EventSource 생성 중 오류:", e);
        setError(e);
        setIsStreaming(false);
    }
  }, [apiUrl, userId, keywords, isStreaming]);

  // ✅ useEffect는 컴포넌트 언마운트 시에만 정리 역할을 합니다.
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        console.log('useChatStream: 컴포넌트 언마운트 시 EventSource 연결 정리.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []); // ✅ 빈 의존성 배열

  // ✅ Hook이 반환하는 값들 (스트림 시작 함수 포함)
  return { streamData, isStreaming, error, startStreamAction };
}

export default useChatStream;