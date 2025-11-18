import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 사용자기 지정한 Context인 ChatProvider를 import 합니다.
import { ChatProvider } from './contexts/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> /* StrictMode 비활성화 (학습용) */}
    // 2. App 컴포넌트를 ChatProvider로 감싸줍니다.
    // 이렇게 하면 App 컴포넌트와 그 아래의 모든 자식 컴포넌트들이
    // ChatContext에 접근할 수 있게 됩니다.
    <ChatProvider>
      <App />
    </ChatProvider>
  // </StrictMode>,
)
