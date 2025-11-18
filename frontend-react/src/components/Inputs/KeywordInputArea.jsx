// frontend-react/src/components/Inputs/KeywordInputArea.jsx
import React from 'react';
// 1. useChat 훅을 import 합니다.
import { useChat } from '../../contexts/ChatContext';

// 2. props를 받지 않도록 수정합니다.
//function KeywordInputArea({ activeAgent, keywordInputs, handleKeywordInputChange }) {
function KeywordInputArea() {
  // 3. useChat() 훅을 사용하여 필요한 값들을 직접 가져옵니다.
  const { activeAgent, keywordInputs, handleKeywordInputChange } = useChat();
   
  return (
    <div 
        id="keyword-input-area" 
        className={`keyword-input-area ${
            activeAgent.name === '네이버뉴스' || activeAgent.name === '뉴스큐레이션' ? '' : 'hidden'
        }`}
    >
        <h3>키워드 입력 (최대 3개)</h3>
        <div className="keyword-card-grid">
            {[0, 1, 2].map(index => (
                <div className="keyword-card" key={index}>
                    <label htmlFor={`keyword${index + 1}`}>키워드 {index + 1}:</label>
                    <input 
                        type="text" 
                        id={`keyword${index + 1}`} 
                        className="keyword-input" 
                        placeholder={index === 0 ? "필수 키워드" : "선택 키워드"}
                        value={keywordInputs[index]} 
                        onChange={(e) => handleKeywordInputChange(index, e.target.value)} 
                    />
                </div>
            ))}
        </div>
    </div>
  );
}

export default KeywordInputArea;