// frontend-react/src/components/Chat/ChatMessageList.jsx
import React from 'react';

function ChatMessageList({ messages, activeAgent, messagesEndRef }) {
  return (
    <div id="chat-messages" className="chat-messages">
      {messages.length === 0 && (
        <>
          <p className="greeting">
            현재 선택된 에이전트: <strong id="current-agent-name">{activeAgent.name}</strong><br/>
            대화를 시작하거나, 좌측에서 다른 에이전트 모드를 선택해주세요.
          </p>
          <div className="recommendation-cards">
            <h4>이런 대화를 많이 했어요</h4>
            <div className="card-grid">
              <div className="card">추천</div>
              <div className="card">추천</div>
              <div className="card">추천</div>
              <div className="card">추천</div>
            </div>
          </div>
        </>
      )}
      {messages.map((msg, index) => (
        <div 
            key={index} 
            className={`chat-bubble ${msg.type}-bubble ${msg.isLoading || msg.isStreaming ? 'loading-bubble' : ''}`}
            // ✅ msg.contentType이 'html'일 때만 dangerouslySetInnerHTML을 설정
            {...(msg.contentType === 'html' ? { dangerouslySetInnerHTML: { __html: msg.content } } : {})}
        >
            {/* ✅ msg.contentType이 'text'일 때만 자식 요소를 렌더링 */}
            {msg.contentType === 'text' && (
              // ✅ isLoading일 때 로딩 스피너와 텍스트를 함께 표시
              msg.isLoading || msg.isStreaming ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>{msg.content}</span>
                </div>
              ) : (
                msg.content
              )
            )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessageList;