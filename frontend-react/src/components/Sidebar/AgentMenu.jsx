// frontend-react/src/components/Sidebar/AgentMenu.jsx

import React from 'react';

function AgentMenu({ agents, activeAgent, handleAgentChange }) {
  return (
    <nav className="agent-menu">
      <h3>Agent 모드 선택</h3>
      <ul id="agent-list">
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