/*****************************************************
 * 1) 첫 번째 DOMContentLoaded: Chat & 탭 전환 로직
 *****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // --------------------
  // Socket.IO 설정
  // --------------------
  const socket = io("http://localhost:3001"); // Socket 서버(3001)

  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatLog = document.getElementById("chat-log");

  // 서버 연결 성공 시
  socket.on("connect", () => {
    console.log("서버와 연결되었습니다! 소켓 ID:", socket.id);
  });

  // 메시지 보내기
  sendBtn.addEventListener("click", () => {
    const message = inputEl.value.trim();
    if (!message) return;
    socket.emit("chat_message", message); // 서버에 메시지 전송
    inputEl.value = "";
  });

  // 서버로부터 응답 받기
  socket.on("chat_response", (data) => {
    const div = document.createElement("div");
    div.textContent = data;
    chatLog.appendChild(div);
  });

  // --------------------
  // 미리 정의된 질문 버튼 클릭 시, 질문 전송
  // --------------------
  const presetBtns = document.querySelectorAll(".preset-question");
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const question = btn.textContent.trim();
      // 소켓 전송
      socket.emit("chat_message", question);
    });
  });

  // --------------------
  // 햄버거 버튼 클릭 => 사이드바 열고 닫기
  // --------------------

  const hamburgerBtn = document.getElementById("hamburger-btn");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open"); // 사이드바 열기/닫기 토글
    mainContent.classList.toggle("sidebar-open"); // 콘텐츠 반응형 클래스 추가/제거
  });
  // --------------------
  // 탭 버튼 클릭 => 섹션 전환
  // --------------------
  const tabBtns = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tab-section");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 모든 섹션 숨기기
      sections.forEach((sec) => (sec.style.display = "none"));
      // 해당 탭 섹션만 보이기
      const targetId = btn.getAttribute("data-tab") + "-section";
      document.getElementById(targetId).style.display = "block";
    });
  });

  // 초기 진입 시 첫 탭(Block Ai) 활성
  document.getElementById("block-ai-section").style.display = "block";
});

/**********************************************************
 * 2) 두 번째 DOMContentLoaded: Info 탭 API Fetch 로직
 **********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // === 밋업, 해커톤, 뉴스 UI 컨테이너
  const meetupContainer = document.getElementById("meetup-container");
  const hackathonContainer = document.getElementById("hackathon-container");
  const newsContainer = document.getElementById("news-container");

  // --------------------
  // (1) 밋업 Fetch
  // --------------------
  async function fetchMeetups() {
    try {
      const res = await fetch("http://localhost:3000/api/v1/info/meetup");
      if (!res.ok) throw new Error("Fail to fetch meetups");
      const data = await res.json();

      // 최근 5개만
      const sliced = data.slice(0, 5);
      renderList(meetupContainer, sliced);
    } catch (error) {
      console.error(error);
      meetupContainer.innerHTML = `<li>Error loading meetups</li>`;
    }
  }

  // --------------------
  // (2) 해커톤 Fetch
  // --------------------
  async function fetchHackathons() {
    try {
      const res = await fetch("http://localhost:3000/api/v1/info/hackathon");
      if (!res.ok) throw new Error("Fail to fetch hackathons");
      const data = await res.json();

      // 최근 5개만
      const sliced = data.slice(0, 5);
      renderList(hackathonContainer, sliced);
    } catch (error) {
      console.error(error);
      hackathonContainer.innerHTML = `<li>Error loading hackathons</li>`;
    }
  }

  // --------------------
  // (3) 뉴스 Fetch
  // --------------------
  async function fetchNews() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/info/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news data");
      }
      const newsData = await response.json();

      // 최근 5개만
      const sliced = newsData.slice(0, 5);
      renderList(newsContainer, sliced);
    } catch (error) {
      console.error("Error fetching news:", error);
      newsContainer.innerHTML = `<li>Error loading news</li>`;
    }
  }

  // --------------------
  // 공통 목록 렌더링 함수
  // --------------------
  function renderList(containerEl, dataArray) {
    containerEl.innerHTML = "";
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      containerEl.innerHTML = "<li>No Data</li>";
      return;
    }

    dataArray.forEach((item) => {
      // item 안에 title, content_text, date_published 등 있음
      const li = document.createElement("li");
      li.className = "info-item";
      li.innerHTML = `
        <h4>${item.title ?? "No Title"}</h4>
        <p>${item.content_text ?? ""}</p>
        <small>${item.date_published ?? ""}</small>
      `;
      containerEl.appendChild(li);
    });
  }

  // --------------------
  // 페이지 로드시 한번씩 불러오기
  // --------------------
  fetchMeetups();
  fetchHackathons();
  fetchNews();
});
