// frontend-react/src/components/Sidebar/Sidebar.jsx
import React from 'react';
import AgentMenu from './AgentMenu';
import UserProfile from './UserProfile';

// 1. Sidebar 컴포넌트에서 모든 props를 제거합니다.
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">AI CHAT PROFESSIONAL</div>
      {/* 2. AgentMenu와 UserProfile에 더 이상 props를 전달하지 않습니다. */}
      <AgentMenu />
      <UserProfile />
    </aside>
  );
}

export default Sidebar;