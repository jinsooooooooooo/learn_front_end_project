// frontend-react/src/components/Chat/ChatMainArea.jsx

import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import KeywordInputArea from '../Inputs/KeywordInputArea';
import ChatInputArea from '../Inputs/ChatInputArea';

function ChatMainArea(props) {
  return (
    <main className="content-area">
      <ChatHeader />
      <div className="chat-container">
        <ChatMessageList 
          messages={props.messages}
          activeAgent={props.activeAgent}
          messagesEndRef={props.messagesEndRef}
          handleRecommendationClick={props.handleRecommendationClick}
        />
        <KeywordInputArea 
          activeAgent={props.activeAgent}
          keywordInputs={props.keywordInputs}
          handleKeywordInputChange={props.handleKeywordInputChange}
        />
        <ChatInputArea 
          chatMessageInput={props.chatMessageInput}
          setChatMessageInput={props.setChatMessageInput}
          handleSendMessage={props.handleSendMessage}
          isStreaming={props.isStreaming}
        />
      </div>
    </main>
  );
}

export default ChatMainArea;