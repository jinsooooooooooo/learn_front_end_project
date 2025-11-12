import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> /* StrictMode 비활성화 (학습용) */}
    <App />
  // </StrictMode>,
)
