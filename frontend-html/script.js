// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Agent 목록 정의
    const agents = [
        { name: '채팅', apiPath: '/api/chat', mode: 'Chat', messages: [] },
        { name: '회의실', apiPath: '/api/meeting', mode: 'Chat', messages: [] },
        { name: '네이버뉴스', apiPath: '/api/naver_news', mode: 'Chat', messages: [], responseHandler: renderNewsResponse  },
        { name: '뉴스큐레이션', apiPath: '/api/news', mode: 'Chat', messages: [] },
        { name: 'Langchain채팅', apiPath: '/api/langchain/chat', mode: 'Chat', messages: [] }, // ✅ API Path 수정 (langchain_chat -> langchain/chat)
        { name: 'StreamResponse', apiPath: '/api/stream', mode: 'Stream', messages: [] } // ✅ API Path 수정 (stream_sample -> stream)
    ];

    const agentList = document.getElementById('agent-list');
    const currentAgentName = document.getElementById('current-agent-name');
    // const recommendationCards = document.querySelector('.recommendation-cards'); // 추천 카드 영역
    // const greetingMessage = document.querySelector('.greeting'); // 초기 인사말

    // ✅ 원본 greeting과 recommendation-cards 요소를 참조하고 나중에 복사하여 사용
    const originalGreetingMessageElement = document.querySelector('.greeting');
    const originalRecommendationCardsElement = document.querySelector('.recommendation-cards');

    
    
    // 사용자 입력 및 전송 로직 (기본 동작만 구현)
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const userName = document.getElementById('user-name');
    const userId = userName.textContent; // 사용자 ID는 페이지 로드 시 고정

    let activeAgent = agents[0]; // 초기 활성 에이전트는 첫 번째 리스트로 설정
    

    // 2. Agent 목록 UI 생성 및 이벤트 리스너 추가
    function renderAgentList() {
        agentList.innerHTML = ''; // 기존 목록 초기화
        agents.forEach((agent, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'agent-item';
            
            // 이미지에서처럼, 목록 왼쪽에 모드 표시를 추가 (예: Chat, Stream)
            listItem.innerHTML = `
                <span style="color: #6c7081; font-weight: 500; margin-right: 5px;">${agent.mode}</span>
                ${agent.name}
            `;
            
            listItem.dataset.index = index;
            
            // 초기 활성화 상태 설정
            if (agent === activeAgent) {
                listItem.classList.add('active');
            }

            // 클릭 이벤트 핸들러
            listItem.addEventListener('click', () => {
                setActiveAgent(agent, listItem);
            });

            agentList.appendChild(listItem);
        });
    }

    // 3. Agent 변경 로직 (초기화 로직 추가)
    function setActiveAgent(agent, element) {
        // 기존 활성화 탭 비활성화
        document.querySelectorAll('.agent-item').forEach(item => {
            item.classList.remove('active');
        });

        // 새 탭 활성화
        element.classList.add('active');
        activeAgent = agent;
        
        // 메인 콘텐츠 영역 업데이트
        currentAgentName.textContent = agent.name;
        
        // ✅ 대화 내용 초기화 및 해당 Agent의 대화 기록 렌더링
        chatMessages.innerHTML = ''; // 기존 메시지 모두 삭제
        // ✅ 입력창 초기화
        userInput.value = '';

        // 뉴스 키워드 인풋 초기화 
        document.querySelectorAll('.keyword-input').forEach(item =>{
            item.value = '';
        });

        //네이버뉴스, 뉴스큐레이션은 키워드 입력 공간 활성화
        if (currentAgentName.textContent === '네이버뉴스'
            || currentAgentName.textContent === '뉴스큐레이션' ) {
            keywordsInputArea = document.getElementById('keyword-input-area');
            keywordsInputArea.classList.remove('hidden');
            userInput.value='뉴스 기사 검색';
            }
        else {
            keywordsInputArea = document.getElementById('keyword-input-area');
            keywordsInputArea.classList.add('hidden');
        }

        
        // 선택된 Agent에 메세지 기록이 없을 때만 초기 인사말과 recomand-cards를 표기한다.
        if (activeAgent.messages.length===0){
            // ✅ 초기 인사말을 복사하여 다시 추가하고 hidden 클래스 제거
            const newGreeting = originalGreetingMessageElement.cloneNode(true);
            newGreeting.querySelector('#current-agent-name').textContent = activeAgent.name;
            newGreeting.classList.remove('hidden'); // 혹시 모를 hidden 클래스 제거
            chatMessages.appendChild(newGreeting);

            // ✅ 추천 카드 영역을 복사하여 다시 추가하고 hidden 클래스 제거
            const newRecommendationCards = originalRecommendationCardsElement.cloneNode(true);
            newRecommendationCards.classList.remove('hidden'); // 혹시 모를 hidden 클래스 제거
            chatMessages.appendChild(newRecommendationCards);
        }

        

        // 해당 Agent의 저장된 메시지 렌더링
        activeAgent.messages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.className = `chat-bubble ${msg.type}-bubble`;
            if (msg.contentType === 'html') {
                msgElement.innerHTML = msg.content; // HTML 그대로 삽입
            } else {
                msgElement.textContent = msg.content; // 텍스트만 삽입
                // msgElement.textContent = msg.text;
            }
            chatMessages.appendChild(msgElement);
        });

        
        console.log(`Agent 모드 변경됨: ${agent.name}. API Path: ${agent.apiPath}`);

        // 스크롤 맨 아래로 이동
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 초기 실행
    renderAgentList();
    setActiveAgent(activeAgent, agentList.querySelector(`[data-index="0"]`)); // 첫 번째 에이전트를 명시적으로 활성화

    
 

    // ✅ sendMessage 함수를 async로 선언합니다.    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // 키워드 인풋도 초기화 
        const keywordinputs = document.querySelectorAll('.keyword-input');
        const values = Array.from(keywordinputs, el => el.value.trim());  // input.value 추출
        const keywords = values.join(', ');

        // ✅ 대화 시작 시 추천 카드 및 인사말 숨기기
        // DOM에 현재 존재하는 greeting과 recommendation-cards 요소를 찾아서 숨깁니다.
        const currentGreeting = chatMessages.querySelector('.greeting');
        const currentRecommendationCards = chatMessages.querySelector('.recommendation-cards');

        if (currentGreeting) currentGreeting.classList.add('hidden');
        if (currentRecommendationCards) currentRecommendationCards.classList.add('hidden');



        // TODO: (다음 실습 단계) 실제 백엔드 API 호출 (Fetch API) 로직 추가

        console.log(`[${activeAgent.name}] 에이전트로 전송: ${message}`);
        

        // **  사용자 메시지 버블 추가 (CSS는 styles.css에 추가 필요)**
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);
        activeAgent.messages.push({ type: 'user', text: message, contentType:'text'}); // 기록


        // 로딩 메시지 추가
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'chat-bubble agent-bubble loading-bubble';
        loadingMessage.textContent = '...생각 중...';
        chatMessages.appendChild(loadingMessage);

        // 스크롤 맨 아래로 이동
        chatMessages.scrollTop = chatMessages.scrollHeight;
        userInput.value = ''; // 입력창 초기화


        let fullApiPath = "http://127.0.0.1:8000" + activeAgent.apiPath;
        console.log(`API Path: ${fullApiPath} | Mode: ${activeAgent.mode}`);
        console.log(`User ID: ${userId} | Message: ${message}`);
        console.log(`News Keywords: ${keywords} `);

        try {
            if (activeAgent.mode === 'Chat') {
                // ✅ fetch 호출 앞에 await를 붙여 응답 객체를 기다립니다.
                const res = await fetch(fullApiPath, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "user_name": userName.textContent, "message": message, "keywords": keywords }),
                });

                if (!res.ok) {
                    const errorText = await res.text(); // 서버의 에러 메시지 본문을 읽음
                    console.error("서버 응답 오류:", res.status, res.statusText, errorText);
                    throw new Error(`서버 오류 발생: ${res.status} - ${errorText}`);
                }

                // ✅ res.json() 앞에 await를 붙여 JSON 파싱이 완료될 때까지 기다립니다.
                const data = await res.json(); 
                console.log("Parsed JSON Data:", data);

                // 로딩 메시지 제거
                chatMessages.removeChild(loadingMessage);


                // 에이전트 응답 표시
                // ✅ 에이전트별 응답 처리 핸들러 호출
                if (activeAgent.responseHandler) {
                    activeAgent.responseHandler('chat-messages', data, chatMessages, activeAgent);
                } else {
                    // 기본 응답 처리 (예외 방지)
                    renderChatResponse('chat-messages', data, chatMessages, activeAgent);
                }

                // const agentResponseDiv = document.createElement('div');
                // agentResponseDiv.className = 'chat-bubble agent-bubble';
                // agentResponseDiv.textContent = data.reply || data.response || "응답이 없습니다."; // 'reply' 또는 'response' 필드 사용
                // chatMessages.appendChild(agentResponseDiv);
                // activeAgent.messages.push({ type: 'agent', text: agentResponseDiv.textContent }); // 기록


            } else if (activeAgent.mode === 'Stream'){
                // 스트리밍 모드
                console.log('stream response do not wrok not yet');

            }



        } catch (err) {
            // 로딩 메시지 제거
            if (chatMessages.contains(loadingMessage)) {
                chatMessages.removeChild(loadingMessage);
            }
            console.error("❌ 최종 오류 발생:", err);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble agent-bubble error-bubble';
            errorMessage.textContent = `❌ 오류: ${err.message}`;
            chatMessages.appendChild(errorMessage);

        }    

        // 스크롤 맨 아래로 이동
        chatMessages.scrollTop = chatMessages.scrollHeight;


    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});


// 일반 텍스트 응답 렌더링 함수
function renderChatResponse(responseDivId, data, chatMessages, activeAgent) {
    const agentResponseDiv = document.createElement('div');
    agentResponseDiv.className = 'chat-bubble agent-bubble';
    agentResponseDiv.textContent = data.reply || data.response || "응답이 없습니다.";
    chatMessages.appendChild(agentResponseDiv);
    activeAgent.messages.push({ type: 'agent', contentType:'text', text: agentResponseDiv.textContent });
}

// 네이버뉴스/뉴스큐레이션 응답 렌더링 함수
// 백엔드 응답이 { "articles": [{ title, link, description }, ...] } 형태라고 가정
function renderNewsResponse(responseDivId, data, chatMessages, activeAgent) {

    if (!data.reply || data.reply.length === 0) {
        const noNewsDiv = document.createElement('div');
        noNewsDiv.className = 'chat-bubble agent-bubble';
        noNewsDiv.textContent = "검색된 뉴스 기사가 없습니다.";
        chatMessages.appendChild(noNewsDiv);
        activeAgent.messages.push({ type: 'agent', contentType: 'html', text: noNewsDiv.textContent });
        return;
    }

    const newsContainer = document.createElement('div');
    newsContainer.className = 'chat-bubble agent-bubble news-container'; // CSS 필요

    const newsList = document.createElement('ul');
    newsList.className = 'news-list'; // CSS 필요


    data.reply.forEach(article => {
        const listItem = document.createElement('li');
        listItem.className = 'news-item'; // CSS 필요
        
        const titleLink = document.createElement('a');
        titleLink.href = article.link;
        titleLink.target = "_blank"; // 새 탭에서 열기
        titleLink.rel = "noopener noreferrer";
        titleLink.textContent = article.title;
        titleLink.className = 'news-title-link'; // CSS 필요

        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = article.description;
        descriptionPara.className = 'news-description'; // CSS 필요

        listItem.appendChild(titleLink);
        listItem.appendChild(descriptionPara);
        newsList.appendChild(listItem);

    });

    newsContainer.appendChild(newsList);
    chatMessages.appendChild(newsContainer);
    activeAgent.messages.push({ type: 'agent', contentType: 'html', content: newsContainer.outerHTML });
}

/* * 참고: chat-bubble 스타일링은 styles.css에 추가해야 깔끔하게 보입니다.
* 예시:
.chat-bubble { padding: 10px; margin-bottom: 10px; border-radius: 15px; max-width: 80%; }
.user-bubble { background-color: #a4c639; color: white; margin-left: auto; }
.agent-bubble { background-color: #e9e9e9; color: #333; margin-right: auto; }
*/