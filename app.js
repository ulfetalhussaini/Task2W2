import "babel-polyfill";

let news;

document.addEventListener("DOMContentLoaded", () => {
  news = document.getElementById("news");
  let search = document.getElementById("search");
  search.addEventListener("keyup", event => {
    if (event.key == "Enter") {
      getNews(search.value);
    }
  });
  getNews("iraq");
});

async function getNews(query) {
  let response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&apiKey=978d6c3818ff431b8c210ae86550fb1f`
  );
  let content = await response.json();
  updateUI(content.articles.map(createArticle).join("\n"));
}

function updateUI(content) {
  news.innerHTML = content;
}

function createArticle(article, i) {
  article.counter = retrieveVote(article.url);
  return `
    <article id="${i}">
      <img width="124px" height="124px" src="${article.urlToImage}" alt="">
      <div id="text">
        <h1>${article.title}</h1>
        <p>${article.description}</p>
        <time>${article.publishedAt}</time>
      </div>
      <div id="voter">
        <img height="13px" onclick="incVote('counter${i}');" src="${require("./assets/upvote.svg")}" alt="">
        <div id="counter${i}" url=${article.url}>${article.counter}</div>
        <img  height="13px" onclick="decVote('counter${i}');" src="${require("./assets/downvote.svg")}" alt="">
      </div>
    </article>
  `;
}

function storeVote(id, count) {
  let countersDB = JSON.parse(localStorage.getItem("countersDB") || "{}");
  countersDB[id] = count;
  localStorage.setItem("countersDB", JSON.stringify(countersDB));
}

function retrieveVote(id) {
  let countersDB = JSON.parse(localStorage.getItem("countersDB") || "{}");
  return countersDB[id] || 0;
}

window.incVote = function(id) {
  updateCounter(id, 1);
};

window.decVote = function(id) {
  updateCounter(id, -1);
};

function updateCounter(id, number) {
  let counter = document.getElementById(id);
  counter.innerText = Number(counter.innerText) + number;
  let storeId = counter.getAttribute("url");
  let count = counter.innerText;
  storeVote(storeId, count);
}
