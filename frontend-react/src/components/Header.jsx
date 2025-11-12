// frontend-react/src/components/Header.jsx
import React from 'react'; 
// React를 사용하려면 import 해야 합니다. (Vite는 자동 처리할 때도 있지만 명시하는 것이 좋습니다)

// Header 컴포넌트는 message라는 prop을 받습니다.
function Header(props) {
  return (
    <header>
      <h1>{props.message}</h1> {/* props.message 값을 사용 */}
      <p>Welcome to React Props & State Demo</p>
    </header>
  );
}

export default Header;