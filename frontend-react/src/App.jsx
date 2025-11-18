// 1. React와 관련된 import는 대부분 필요 없어집니다.
// useState, useEffect, useRef 등을 모두 삭제합니다.
import React from 'react';
// 2. AppLayout과 같은 UI 컴포넌트는 그대로 둡니다.
import AppLayout from './components/Layout/AppLayout';
// 3. 이제 필요하 정보들은 chatContext로 분리하여 사용합니다.
import { useChat } from './contexts/ChatContext';

function App() {
  // 4. useChat() 훅을 호출하여 필요한 모든 것을 한번에 가져옵니다.
  // 이 한 줄이 이전에 있던 수십 줄의 상태 관리 코드를 대체합니다.
  const {
    agents,
    activeAgent,
    userId,
    chatMessageInput,
    setChatMessageInput,
    keywordInputs,
    handleKeywordInputChange,
    messages,
    messagesEndRef,
    handleAgentChange,
    handleSendMessage,
    isStreaming,
    handleRecommendationClick,
  } = useChat();

  // 5. App 컴포넌트는 이제 UI 렌더링에만 집중합니다.
  // 복잡한 로직이 모두 사라지고, 어떤 UI를 그릴지만 명확하게 보입니다.
  return (
    <AppLayout
      // props는 이전과 동일하게 전달하지만,
      // 이제 이 값들의 원천은 App.jsx가 아닌 ChatContext 입니다.
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
    />
  );
}

export default App;

