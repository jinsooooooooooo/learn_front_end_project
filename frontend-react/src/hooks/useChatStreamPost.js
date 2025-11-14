// frontend-react/src/hooks/useChatStreamPost.js
import { useState, useEffect, useRef, useCallback } from 'react';

// useChatStreamPost 커스텀 Hook 정의 (POST + fetch + ReadableStream 방식)
function useChatStreamPost() { // ✅ API URL 등은 startStreamAction에서 직접 받음
  const [streamData, setStreamData] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null); // ✅ 요청 취소를 위한 AbortController

  // ✅ 스트림을 시작하는 함수: apiUrl, body 등을 인자로 받음
  const startStreamAction = useCallback(async (apiUrl, body) => {
    if (isStreaming) {
      console.warn("useChatStreamPost: 이미 스트리밍 중이므로 새 스트림을 시작하지 않습니다.");
      return;
    }

    // 이전 AbortController가 있다면 취소
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController(); // 새 AbortController 생성
    const signal = abortControllerRef.current.signal;

    setError(null);
    setStreamData('');
    setIsStreaming(true);

    try {
      // ✅ POST 요청으로 변경
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // ✅ body에 데이터 포함
        signal: signal, // ✅ 요청 취소 시그널 연결
      });

      if (!res.ok || !res.body) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      // ✅ ReadableStream 리더 얻기
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8'); // ✅ UTF-8 디코더

      let accumulatedChunk = ''; // 부분적으로 도착한 chunk를 누적
      
      while (true) {
        const { done, value } = await reader.read(); // ✅ 스트림에서 데이터 읽기
        if (done) {
          console.log('useChatStreamPost: 스트림 완료.');
          setIsStreaming(false); // 스트림 완료 상태로 변경
          break; // 스트림 종료
        }

        // ✅ Uint8Array를 텍스트로 디코딩하고, EventStream 형식에 맞춰 파싱
        const chunk = decoder.decode(value, { stream: true });
        accumulatedChunk += chunk;

        // EventStream 규격에 따라 "data: [내용]\n\n"을 파싱
        let messages = accumulatedChunk.split('\n\n');
        accumulatedChunk = messages.pop(); // 마지막 불완전한 메시지는 다음 청크와 합쳐질 수 있음

        messages.forEach(msg => {
          if (msg.startsWith('data: ')) {
            const dataContent = msg.substring(6); // "data: " 제거
            if (dataContent === "[DONE]") {
              // [DONE] 메시지를 받으면 스트림 완료 처리
              console.log('useChatStreamPost: [DONE] 메시지 수신.');
              setIsStreaming(false); // 스트림 완료 상태로 변경
              // reader.cancel() 등을 통해 스트림을 강제 종료할 수도 있습니다.
            } else {
              setStreamData(prevData => prevData + dataContent);
            }
          }
        });
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('useChatStreamPost: fetch 요청이 취소되었습니다.');
      } else {
        console.error('useChatStreamPost: 스트리밍 오류 발생:', err);
        setError(err);
      }
      setIsStreaming(false);
    } finally {
      abortControllerRef.current = null;
    }
  }, [isStreaming]); // ✅ isStreaming은 중복 방지 로직에 사용되므로 의존성에 포함

  // ✅ useEffect는 컴포넌트 언마운트 시에만 정리 역할을 합니다.
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 기존 fetch 요청 취소
      if (abortControllerRef.current) {
        console.log('useChatStreamPost: 컴포넌트 언마운트 시 fetch 요청 취소.');
        abortControllerRef.current.abort();
      }
    };
  }, []); // ✅ 빈 의존성 배열

  return { streamData, isStreaming, error, startStreamAction };
}

export default useChatStreamPost;