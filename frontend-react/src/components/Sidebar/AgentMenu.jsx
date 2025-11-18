// frontend-react/src/components/Sidebar/AgentMenu.jsx
import React from 'react';
// 1. useChat 훅을 import 합니다.
import { useChat } from '../../contexts/ChatContext';

// 2. props를 더 이상 받지 않습니다.
function AgentMenu() {
  // 3. useChat() 훅을 호출하여 필요한 데이터와 함수만 구조 분해 할당으로 가져옵니다.
  //    이 컴포넌트는 agents, activeAgent, handleAgentChange만 필요하므로,
  //    다른 불필요한 값들은 가져오지 않습니다.
  const { agents, activeAgent, handleAgentChange } = useChat();

  return (
    <nav className="agent-menu">
      <h3>Agent 모드 선택</h3>
      <ul id="agent-list">
        {/* agents, activeAgent, handleAgentChange는 이제 Context에서 직접 온 값입니다. */}
        {agents.map((agent, index) => (
          <li 
            key={index} 
            className={`agent-item ${agent.name === activeAgent.name ? 'active' : ''}`}
            onClick={() => handleAgentChange(agent)} 
          >
            <span style={{color: '#6c7081', fontWeight: 500, marginRight: '5px'}}>{agent.mode}</span>
            {agent.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AgentMenu;