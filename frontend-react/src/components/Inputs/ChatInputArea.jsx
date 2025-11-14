// frontend-react/src/components/Inputs/ChatInputArea.jsx

import React from 'react';

function ChatInputArea({ chatMessageInput, setChatMessageInput, handleSendMessage, isStreaming }) {
  return (
    <div className="input-area">
        <input 
            type="text" 
            id="user-input" 
            placeholder="필요한 에이전트 작업 요청을 입력하고 엔터를 누르세요..." 
            value={chatMessageInput} 
            onChange={(e) => setChatMessageInput(e.target.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} 
        />
        <button id="send-btn" onClick={handleSendMessage} disabled={isStreaming || chatMessageInput.trim() === ''}>
            {isStreaming ? '...' : '↑'}
        </button>
    </div>
  );
}

export default ChatInputArea;