// frontend-react/src/components/Sidebar/UserProfile.jsx
import React from 'react';

function UserProfile({ userId }) {
  return (
    <div className="user-profile">
      <div className="avatar">임</div>
      <div className="user-info">
        <strong>{userId}</strong><br/>
      </div>
    </div>
  );
}

export default UserProfile;