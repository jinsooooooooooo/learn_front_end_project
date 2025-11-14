// frontend-react/src/components/Sidebar/Sidebar.jsx
import React from 'react';
import AgentMenu from './AgentMenu';
import UserProfile from './UserProfile';

function Sidebar({ agents, activeAgent, userId, handleAgentChange }) {
  return (
    <aside className="sidebar">
      <div className="logo">AI CHAT PROFESSIONAL</div>
      <AgentMenu 
        agents={agents}
        activeAgent={activeAgent}
        handleAgentChange={handleAgentChange}
      />
      <UserProfile userId={userId} />
    </aside>
  );
}

export default Sidebar;