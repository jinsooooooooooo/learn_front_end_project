// frontend-react/src/App.jsx
import React, { useState, useEffect, useRef } from 'react'; // ✅ useCallback 제거 (단순화)
import useChatStreamPost from './hooks/useChatStreamPost'; // ✅ POST 방식 스트림 Hook 임포트
import AppLayout from './components/Layout/AppLayout'; // ✅ AppLayout 컴포넌트 임포트
// import './App.css'; // Global.css를 사용한다고 가정 (App.css는 비워둠)


// 헬퍼 함수 정의 (컴포넌트 바깥에서 선언)
// 1) 뉴스 응답 HTML을 생성하는 함수 (DOM 조작 대신 HTML 문자열 반환)
function createNewsHtml(data) {
  if (!data.articles || data.articles.length === 0) {
    return `검색된 뉴스 기사가 없습니다.`;
  }
  let newsHtml = `<div class="news-container"><ul class="news-list">`;
  data.articles.forEach(article => {
    newsHtml += `
      <li class="news-item">
        <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-title-link">${article.title}</a>
        <p class="news-description">${article.description}</p>
      </li>
    `;
  });
  newsHtml += `</ul></div>`;
  return newsHtml;
}

// 2) 일반 텍스트 응답을 반환하는 함수
function createChatText(data) {
  return data.reply || data.response || "응답이 없습니다.";
}





function App() {
  // 1. 상태 정의 -----------------------------------------------------------------
  const [agents, setAgents] = useState([
    { name: '채팅', apiPath: '/api/chat', mode: 'Chat', messages: [], 
      recommendations: ['오늘 날씨 알려줘', '요즘 인기 있는 영화 추천해줘', '재미있는 농담 해봐','추천']
    },
    { name: '회의실', apiPath: '/api/meeting', mode: 'Chat', messages: [], 
      recommendations: ['다음 주 월요일 10시 회의실 예약해줘', '가장 가까운 빈 회의실 찾아줘','추천']
    },
    { name: '네이버뉴스', apiPath: '/api/naver_news', mode: 'Chat', messages: [],
      recommendations: ['최신 AI 기술','IT','취업시장','채용','추천']
     },
    { name: '뉴스큐레이션', apiPath: '/api/news', mode: 'Chat', messages: [],
      recommendations: ['AI 관련 뉴스 3개', '경제 동향 요약','추천','추천','추천']
     },
    { name: 'Langchain채팅', apiPath: '/api/langchain/chat', mode: 'Chat', messages: [], 
      recommendations: ['안녕 오늘 날씨 어때?', 'LangChain이 뭐야?', 'React에 대해 설명해줘','추천']
    },
    { name: 'StreamResponse', apiPath: '/api/stream', mode: 'Stream', method: 'POST', messages: [] , 
      recommendations: ['스트림', 'Event Stream', '1장,2장,3장','추천','추천']
    },
    { name: 'LangchainStream', apiPath: '/api/langchain/chatstream', method: 'POST', mode: 'Stream', messages: [],
      recommendations: ['내 이름은 곽준빈이야', '내 이름은?','내 이름은 jin이야','여기는 어디?']
     }
    // ✅ 나중에 여기에 새로운 Stream 에이전트 추가 가능
  ]);
  const [activeAgent, setActiveAgent] = useState(agents[0]); // 현재 활성 에이전트
  const [userId, setUserId] = useState("jinsoo"); 
  const [chatMessageInput, setChatMessageInput] = useState(''); // 입력 필드 메시지 상태
  const [keywordInputs, setKeywordInputs] = useState(['', '', '']); // 키워드 입력 필드 상태
  const [messages, setMessages] = useState([]); // ✅ 현재 채팅 화면에 표시될 메시지 목록
  

  // // 2. useChatStream Hook (StreamResponse 에이전트용) -- 사용 안함으로 주석 처리
  // const { 
  //   streamData, 
  //   isStreaming, 
  //   error: streamError,
  //   startStreamAction 
  // } = useChatStream(
  //   userId, 
  //   keywordInputs.filter(kw => kw.trim() !== '')
  // );

  // 2 useChatStreamPost 스트림 커스텀 Hook (POST 방식) ---------------------------------
   const { 
    streamData, 
    isStreaming, 
    error: streamError,
    startStreamAction 
  } = useChatStreamPost();


  // 3. UI 업데이트를 위한 useEffect  ---------------------------------------------------
  const messagesEndRef = useRef(null); // 메시지 목록 맨 아래를 참조 (스크롤용)
  // 3.1 // 문서 제목 업데이트 (isStreaming 상태 반영)
  useEffect(() => {
    document.title = `Multi-Agent | ${activeAgent.name} ${isStreaming ? '| 스트리밍 중...' : ''}`;
  }, [activeAgent.name, isStreaming]);

  // 3.2 스트리밍 데이터 수신 시 메시지 상태 업데이트
  useEffect(() => {
    if (activeAgent.mode === 'Stream' && isStreaming && streamData) {
      setMessages(prevMessages => {
        // 마지막 메시지가 현재 스트리밍 중인 메시지이면 업데이트
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.type === 'agent' && lastMessage.isStreaming) {
          return prevMessages.map((msg, index) => 
            index === prevMessages.length - 1 
              ? { ...msg, content: streamData } 
              : msg
          );
        } else if (streamData !== '') {
          return [...prevMessages, { type: 'agent', contentType: 'text', content: streamData, isStreaming: true }];
        }
        return prevMessages;
      });
    } else if (activeAgent.mode === 'Stream' && !isStreaming && streamData) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.isStreaming) {
          setMessages(prevMessages => prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 ? { ...msg, isStreaming: false } : msg
          ));
        }
    }
  }, [streamData, isStreaming, activeAgent.mode]);

  // 3.3 에러 발생 시 메시지 상태 업데이트
  useEffect(() => {
    if (activeAgent.mode === 'Stream' && streamError) {
      setMessages(prevMessages => [...prevMessages, { type: 'agent', contentType: 'text', content: ` 스트리밍 오류: ${streamError.message}` }]);
    }
  }, [streamError, activeAgent.mode]);


  // 3.4 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamData]); // 메시지나 스트림 데이터가 변경될 때마다 스크롤


  // 4. 이벤트 핸들러 정의 ------------------------------------------------
  // 4.1 메세지 전송 이벤트 핸들러
  const handleSendMessage = async () => {
    // 메세지가 없을 경우 요청 방지
    if (chatMessageInput.trim() === '') return;
    // 스트림이 이미 진행 중이면 새 요청 방지
    if (isStreaming) {
      console.warn("App.jsx: 이미 스트리밍 중이므로 새 메시지 전송을 막습니다.");
      return;
    }

    // 사용자 메시지 히스토리 기록
    const newUserMessage = { type: 'user', contentType: 'text', content: chatMessageInput };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // 키워드 입력 필드 초기화
    const currentKeywords = keywordInputs.filter(kw => kw.trim() !== '');
    // 입력창 초기화 (UX)
    const messageToSend = chatMessageInput; // 상태 업데이트 전에 값 저장
    setChatMessageInput('');
    setKeywordInputs(['', '', '']);
    

    const fullApiPath = "http://127.0.0.1:8000" + activeAgent.apiPath;
    console.log(`[${activeAgent.name} 에이전트로 전송: ${messageToSend}`);
    
    // ✅ Agent 모드에 따른 API 호출 및 응답 처리
    if (activeAgent.mode === 'Chat') {
        // 로딩 메시지 추가
        const loadingMessage = { type: 'agent', contentType: 'text', content: '...생각 중...', isLoading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        // let fullApiPath = "http://127.0.0.1:8000" + activeAgent.apiPath;
        try {
            const res = await fetch(fullApiPath, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "user_id": userId, "message": messageToSend, "keywords": currentKeywords }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`서버 오류 발생: ${res.status} - ${errorText}`);
            }

            const data = await res.json(); 
            console.log("Parsed JSON Data:", data);
            
            // 로딩 메시지 제거 및 응답 메시지로 대체
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.filter(msg => !msg.isLoading);
                
                let agentResponseContent = '';
                let agentResponseContentType = 'text';

                if (activeAgent.name === '네이버뉴스' || activeAgent.name === '뉴스큐레이션') {
                    agentResponseContent = createNewsHtml(data);
                    agentResponseContentType = 'html';
                } else {
                    agentResponseContent = createChatText(data);
                }
                return [...updatedMessages, { type: 'agent', contentType: agentResponseContentType, content: agentResponseContent }];
            });

        } catch (err) {
            console.error(" 최종 오류 발생:", err);
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.filter(msg => !msg.isLoading);
                return [...updatedMessages, { type: 'agent', contentType: 'text', content: `❌ 오류: ${err.message}` }];
            });
        }
    } else if (activeAgent.mode === 'Stream'){

      if (activeAgent.method === 'GET') {
        // 스트리밍 모드: useChatStream Hook 활용
        //setStreamTriggerMessage(messageToSend); // ✅ Hook을 트리거할 메시지 상태 업데이트
        // startStreamAction(messageToSend); 
      } else if (activeAgent.method === 'POST'){
        const body = {
            user_id: userId,
            message: messageToSend,
            keywords: keywordInputs.filter(kw => kw.trim() !== '')
        };

        console.log(`POST Stream 전송 요청: ${messageToSend}`);
        startStreamAction(fullApiPath, body); // ✅ POST 스트림 시작
      }

    }
        
  };

  // 4.2 Agent 변경 핸들러
  const handleAgentChange = (agent) => {
    // 현재 활성 Agent의 메시지 기록을 agents 배열에 저장
    setAgents(prevAgents => prevAgents.map(a => 
      a.name === activeAgent.name ? { ...a, messages } : a
    ));
    // 새 Agent 선택 및 메시지 기록 로드
    setActiveAgent(agent);
    setMessages(agent.messages); // 선택된 에이전트의 메시지 기록을 현재 메시지 상태로 설정
    setChatMessageInput('');
    setKeywordInputs(['', '', '']);
  };

  // 4.3 키워드 입력 필드 변경 핸들러
  const handleKeywordInputChange = (index, value) => {
    setKeywordInputs(prevKeywords => {
      const newKeywords = [...prevKeywords];
      newKeywords[index] = value;
      return newKeywords;
    });
  };

  // 4.4 추천카드 이벤트 핸들러 
  const handleRecommendationClick = (recommendationText) => {
    setChatMessageInput(recommendationText);
    handleSendMessage(recommendationText);
  };


  // 5. JSX 렌더링 - singlie 버전
  // return (
  //   <div className="app-container">
  //       <aside className="sidebar">
  //           <div className="logo">AI CHAT PROFESSIONAL</div>
  //           <nav className="agent-menu">
  //               <h3>Agent 모드 선택</h3>
  //               <ul id="agent-list">
  //                   {agents.map((agent, index) => (
  //                       <li 
  //                           key={index} 
  //                           className={`agent-item ${agent.name === activeAgent.name ? 'active' : ''}`}
  //                           onClick={() => handleAgentChange(agent)} 
  //                       >
  //                           <span style={{color: '#6c7081', fontWeight: 500, marginRight: '5px'}}>{agent.mode}</span>
  //                           {agent.name}
  //                       </li>
  //                   ))}
  //               </ul>
  //           </nav>
            
  //           <div className="user-profile">
  //               <div className="avatar">임</div>
  //               <div className="user-info">
  //                   <strong>{userId}</strong><br/>
  //               </div>
  //           </div>
  //       </aside>

  //       <main className="content-area">
  //           <header>
  //               <h1>Your Smart Agent AI</h1>
  //               <h2>다양한 에이전트를 실시간으로 테스트하세요</h2>
  //           </header>
            
  //           <div className="chat-container">
  //               <div id="chat-messages" className="chat-messages">
  //                   {/* greeting, recommendation-cards는 조건부 렌더링 */}
  //                   {messages.length === 0 && ( // messages 상태를 기준으로 조건부 렌더링
  //                       <>
  //                           <p className="greeting">
  //                               현재 선택된 에이전트: <strong id="current-agent-name">{activeAgent.name}</strong>
  //                               <br/>
  //                               대화를 시작하거나, 좌측에서 다른 에이전트 모드를 선택해주세요.
  //                           </p>
                            
  //                           <div className="recommendation-cards">
  //                               <h4>이런 대화를 많이 했어요</h4>
  //                               <div className="card-grid">
  //                                   <div className="card">추천</div>
  //                                   <div className="card">추천</div>
  //                                   <div className="card">추천</div>
  //                                   <div className="card">추천</div>
  //                               </div>
  //                           </div>
  //                       </>
  //                   )}
                    
  //                   {/* 메시지들이 여기에 렌더링될 예정 */}
  //                   {messages.map((msg, index) => ( // ✅ messages 상태를 맵핑하여 렌더링
  //                     <div 
  //                         key={index} 
  //                         className={`chat-bubble ${msg.type}-bubble ${msg.isLoading ? 'loading-bubble' : ''} ${msg.isStreaming ? 'loading-bubble' : ''}`}
  //                         dangerouslySetInnerHTML={msg.contentType === 'html' ? { __html: msg.content } : undefined}
  //                     >
  //                         {msg.contentType === 'text' ? msg.content : null}
  //                     </div>
  //                   ))}

  //                   {/* 스크롤 위치를 잡아줄 빈 div */}
  //                   <div ref={messagesEndRef} />
  //               </div>

  //               {/* Keyword Input Area */}
  //               <div 
  //                   id="keyword-input-area" 
  //                   className={`keyword-input-area ${
  //                       activeAgent.name === '네이버뉴스' || activeAgent.name === '뉴스큐레이션' ? '' : 'hidden'
  //                   }`}
  //               >
  //                   <h3>키워드 입력 (최대 3개)</h3>
  //                   <div className="keyword-card-grid">
  //                       {[0, 1, 2].map(index => (
  //                           <div className="keyword-card" key={index}>
  //                               <label htmlFor={`keyword${index + 1}`}>키워드 {index + 1}:</label>
  //                               <input 
  //                                   type="text" 
  //                                   id={`keyword${index + 1}`} 
  //                                   className="keyword-input" 
  //                                   placeholder={index === 0 ? "필수 키워드" : "선택 키워드"}
  //                                   value={keywordInputs[index]} 
  //                                   onChange={(e) => handleKeywordInputChange(index, e.target.value)} 
  //                               />
  //                           </div>
  //                       ))}
  //                   </div>
  //               </div>

  //               {/* Main Input Area */}
  //               <div className="input-area">
  //                   <input 
  //                       type="text" 
  //                       id="user-input" 
  //                       placeholder="필요한 에이전트 작업 요청을 입력하고 엔터를 누르세요..." 
  //                       value={chatMessageInput} 
  //                       onChange={(e) => setChatMessageInput(e.target.value)} 
  //                       onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} 
  //                   />
  //                   <button id="send-btn" onClick={handleSendMessage} disabled={isStreaming || chatMessageInput.trim() === ''}>
  //                       {isStreaming ? '...' : '↑'}
  //                   </button>
  //               </div>
  //           </div>
  //       </main>
  // //   </div>
  // );


  // 5. JSX 렌더링 - component 분리
  return (
    <AppLayout
      agents={agents}
      activeAgent={activeAgent}
      userId={userId}
      chatMessageInput={chatMessageInput}
      setChatMessageInput={setChatMessageInput}
      keywordInputs={keywordInputs}
      handleKeywordInputChange={handleKeywordInputChange}
      messages={messages}
      messagesEndRef={messagesEndRef}
      handleAgentChange={handleAgentChange}
      handleSendMessage={handleSendMessage}
      isStreaming={isStreaming}
      handleRecommendationClick={handleRecommendationClick} 
      // 수 많은 props
    />
  );
}


export default App;