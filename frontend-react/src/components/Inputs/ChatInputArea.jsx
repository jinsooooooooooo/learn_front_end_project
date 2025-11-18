// frontend-react/src/components/Inputs/ChatInputArea.jsx

import React from 'react';
// 1. useChat 훅을 import 합니다.
import { useChat } from '../../contexts/ChatContext';

// 2. props를 받지 않도록 수정합니다.
function ChatInputArea() {
//function ChatInputArea({ chatMessageInput, setChatMessageInput, handleSendMessage, isStreaming }) {
  // 3. useChat() 훅을 사용하여 필요한 값들을 직접 가져옵니다.
  const { chatMessageInput, setChatMessageInput, handleSendMessage, isStreaming } = useChat();

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