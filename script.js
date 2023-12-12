"use strict";

const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

const closeModal = () => {
  modal.classList.remove("show-modal");
};

const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    alert("Please provide a valid web address and name!");
    return false;
  }

  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address!");
    return false;
  }

  return true;
};

const buildBookmarks = () => {
  bookmarksContainer.textContent = "";

  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    const item = document.createElement("div");
    item.classList.add("item");

    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

const fetchBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "Google",
        url: "https://google.com",
      },
    ];

    console.log(bookmarks);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  buildBookmarks();
};

const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, indx) => {
    if (bookmark.url === url) {
      bookmarks.splice(indx, 1); // del one check item
    }
  });

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  fetchBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();

  const nameValue = websiteNameEl.value.trim();
  let urlValue = websiteUrlEl.value.trim();

  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  fetchBookmarks();

  bookmarkForm.reset();
  websiteNameEl.focus();
};

// addEventListener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

bookmarkForm.addEventListener("submit", storeBookmark);

fetchBookmarks();
