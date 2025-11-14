// frontend-react/src/components/Layout/AppLayout.jsx
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatMainArea from '../Chat/ChatMainArea';

function AppLayout(props) {
  return (
    <div className="app-container">
      <Sidebar 
        agents={props.agents}
        activeAgent={props.activeAgent}
        userId={props.userId}
        handleAgentChange={props.handleAgentChange}
      />
      <ChatMainArea 
        activeAgent={props.activeAgent}
        userId={props.userId}
        chatMessageInput={props.chatMessageInput}
        setChatMessageInput={props.setChatMessageInput}
        keywordInputs={props.keywordInputs}
        handleKeywordInputChange={props.handleKeywordInputChange}
        messages={props.messages}
        messagesEndRef={props.messagesEndRef}
        handleSendMessage={props.handleSendMessage}
        isStreaming={props.isStreaming}
        handleRecommendationClick={props.handleRecommendationClick}
      />
    </div>
  );
}


export default AppLayout;




// AppLayout 컴포넌트는 모든 상태와 핸들러를 prop으로 받습니다.
// function AppLayout({
//   agents, activeAgent, userId,
//   chatMessageInput, setChatMessageInput,
//   keywordInputs, handleKeywordInputChange,
//   messages, messagesEndRef,
//   handleAgentChange, handleSendMessage,
//   isStreaming
// }) {
//   return (
//     < div className="app-container">
//         <aside className="sidebar">
//             <div className="logo">AI CHAT PROFESSIONAL</div>
//             <nav className="agent-menu">
//                 <h3>Agent 모드 선택</h3>
//                 <ul id="agent-list">
//                     {agents.map((agent, index) => (
//                         <li key={index}
//                             className={`agent-item ${agent.name === activeAgent.name ? 'active' : ''}`}
//                             onClick={() => handleAgentChange(agent)}
//                         >
//                             <span style={{color: '#6c7081', fontWeight: 500, marginRight: '5px'}}>{agent.mode}</span>
//                             {agent.name}
//                         </li>
//                     ))}
//                 </ul>
//             </nav>

//             <div className="user-profile">
//                 <div className="avatar">임</div>
//                 <div className="user-info">
//                     <strong>{userId}</strong><br/>
//                 </div>
//             </div>
//         </aside>

//         <main className="content-area">
//             <header>
//                 <h1>Your Smart Agent AI</h1>
//                 <h2>다양한 에이전트를 실시간으로 테스트하세요</h2>
//             </header>

//             <div className="chat-container">
//                 <div id="chat-messages" className="chat-messages">
//                     {messages.length === 0 && (
//                         <>
//                             <p className="greeting">
//                                 현재 선택된 에이전트: <strong id="current-agent-name">{activeAgent.name}</strong>
//                                 <br/>
//                                 대화를 시작하거나, 좌측에서 다른 에이전트 모드를 선택해주세요.
//                             </p>

//                             <div className="recommendation-cards">
//                                 <h4>이런 대화를 많이 했어요</h4>
//                                 <div className="card-grid">
//                                     <div className="card">추천</div>
//                                     <div className="card">추천</div>
//                                     <div className="card">추천</div>
//                                     <div className="card">추천</div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {messages.map((msg, index) => (
//                       <div key={index}
//                           className={`chat-bubble ${msg.type}-bubble ${msg.isLoading ? 'loading-bubble' : ''} ${msg.isStreaming ? 'loading-bubble' : ''}`}
//                           dangerouslySetInnerHTML={msg.contentType === 'html' ? { __html: msg.content } : undefined}
//                       >
//                           {msg.contentType === 'text' ? msg.content : null}
//                       </div>
//                     ))}

//                     <div ref={messagesEndRef} />
//                 </div>
        
//                 <div id="keyword-input-area"
//                     className={`keyword-input-area ${
//                         activeAgent.name === '네이버뉴스' || activeAgent.name === '뉴스큐레이션' ? '' : 'hidden'
//                     }`}
//                 >
//                     <h3>키워드 입력 (최대 3개)</h3>
//                     <div className="keyword-card-grid">
//                         {[0, 1, 2].map(index => (
//                             <div className="keyword-card" key={index}>
//                                 <label htmlFor={`keyword${index + 1}`}>키워드 {index + 1}:</label>
//                                 <input type="text"
//                                     id={`keyword${index + 1}`}
//                                     className="keyword-input"
//                                     placeholder={index === 0 ? "필수 키워드" : "선택 키워드"}
//                                     value={keywordInputs[index]}
//                                     onChange={(e) => handleKeywordInputChange(index, e.target.value)}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="input-area">
//                     <input type="text"
//                         id="user-input"
//                         placeholder="필요한 에이전트 작업 요청을 입력하고 엔터를 누르세요..."
//                         value={chatMessageInput}
//                         onChange={(e) => setChatMessageInput(e.target.value)}
//                         onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
//                     />
//                     <button id="send-btn" onClick={handleSendMessage} disabled={isStreaming || chatMessageInput.trim() === ''}>
//                         {isStreaming ? '스트리밍 중...' : '↑'}
//                     </button>
//                 </div>
//             </div>
//         </main>
//     </div>
//   );
// }

