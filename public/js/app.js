document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  const filterDropdown = document.getElementById("filter-news");
  async function fetchNews(filter = "all") {
    try {
      const response = await fetch("http://localhost:3000/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news data");
      }
      const newsData = await response.json();

      // Filter news if filter is applied
      const filteredNews =
        filter === "all"
          ? newsData
          : newsData.filter((news) => news.network.toLowerCase() === filter);

      // Render news
      renderNews(filteredNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      newsContainer.innerHTML = `<li>Error loading news</li>`;
    }
  }

  // Render news items
  function renderNews(newsArray) {
    newsContainer.innerHTML = ""; // Clear existing news
    newsArray.forEach((news) => {
      const listItem = document.createElement("li");
      listItem.className = "news-item";
      listItem.innerHTML = `
        <h4><a href="${news.url}" target="_blank">${news.title}</a></h4>
        <p>${news.content_text}</p>
        <small>Published: ${new Date(
          news.date_published
        ).toLocaleString()}</small>
      `;
      newsContainer.appendChild(listItem);
    });
  }

  // Event listener for filter dropdown
  filterDropdown.addEventListener("change", (e) => {
    fetchNews(e.target.value);
  });

  // Initial load
  fetchNews();
});
