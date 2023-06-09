// Toggle Dark/Light mode
const button = document.getElementById("mode-toggle");
button.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  // Store the selected mode in local storage
  if (typeof Storage !== "undefined") {
    localStorage.setItem(
      "mode",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  }
});

// Retrieve the stored mode from local storage and apply it on page load
if (typeof Storage !== "undefined") {
  const storedMode = localStorage.getItem("mode");
  if (storedMode === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// Adding URL's to list
// Adding URL's to list
function addFavorite() {
  let urlInput = document.getElementById("typeURL").value;

  // Add protocol if not provided
  if (!/^https?:\/\//i.test(urlInput)) {
    urlInput = "https://" + urlInput;
  }

  let li = document.createElement("li");
  let a = document.createElement("a");
  let deleteButton = document.createElement("button");
  let img = document.createElement("img");

  a.href = urlInput;
  a.target = "_blank";
  let faviconUrl =
    "https://www.google.com/s2/favicons?sz=64&domain=" + urlInput;
  img.src = faviconUrl;
  img.onerror = function () {
    this.onerror = null;
    this.src = "https://via.placeholder.com/64x64?text=No+Icon";
  };
  // img.style.borderRadius = "30%";
  img.style.width = "66px";
  img.style.height = "66px";
  a.appendChild(img);
  li.classList.add(
    "list-group-item",
    "list-group-item-action",
    "d-flex",
    "flex-column",
    "align-items-center"
  );
  li.style.padding = "0.75rem 1.25rem";
  li.appendChild(a);

  deleteButton.classList.add(
    "btn",
    "btn-danger",
    "btn-sm",
    "delete-button",
    "mt-2"
  );
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", function () {
    li.remove();
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter(
      favorite => favorite.url !== urlInput
    );
    saveFavorites(filteredFavorites);
  });
  li.appendChild(deleteButton);

  document.getElementById("favoriteList").appendChild(li);
  const favorites = getFavorites();
  const newFavorite = { url: urlInput };
  favorites.push(newFavorite);
  saveFavorites(favorites);

  document.getElementById("typeURL").value = "";
}

// This allows users to press enter to submit website
document
  .getElementById("typeURL")
  .addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      // 13 is the code for the "Enter" key
      event.preventDefault(); // prevent the default behavior of the "Enter" key
      addFavorite(); // call the function to save the website
    }
  });

// Allows user to change order of list
$(function () {
  $("#favoriteList").sortable({
    stop: function () {
      const favorites = [];
      const lis = document.querySelectorAll("#favoriteList li");
      lis.forEach(li => {
        const url = li.querySelector("a").href;
        favorites.push({ url });
      });
      saveFavorites(favorites);
    },
  });

  // load the order of the list items from local storage
  const order = JSON.parse(localStorage.getItem("favoriteOrder"));
  if (order) {
    for (const itemId of order) {
      const item = $(`#${itemId}`);
      if (item.length) {
        item.appendTo($("#favoriteList"));
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const favorites = getFavorites();
  const favoriteList = document.getElementById("favoriteList");

  for (const favorite of favorites) {
    const url = favorite.url;
    const li = document.createElement("li");
    const a = document.createElement("a");
    const deleteButton = document.createElement("button");
    const img = document.createElement("img");

    // Create the anchor tag with the favicon image
    a.href = url;
    a.target = "_blank";
    let faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + url;
    img.src = faviconUrl;
    img.onerror = function () {
      this.onerror = null;
      this.src = "https://via.placeholder.com/64x64?text=No+Icon";
    };
    img.style.borderRadius = "35%";
    img.style.width = "64px";
    img.style.height = "64px";
    a.appendChild(img);
    li.classList.add(
      "list-group-item",
      "list-group-item-action",
      "d-flex",
      "flex-column",
      "align-items-center"
    );
    li.style.padding = "0.75rem 1.25rem";
    li.appendChild(a);

    deleteButton.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "delete-button",
      "mt-2"
    );
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", function () {
      li.remove();
      const favorites = getFavorites();
      const filteredFavorites = favorites.filter(
        favorite => favorite.url !== url
      );
      saveFavorites(filteredFavorites);
    });
    li.appendChild(deleteButton);

    favoriteList.appendChild(li);
  }
});

// Function to save favorite websites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to retrieve favorite websites from localStorage
function getFavorites() {
  let favorites = [];
  const savedFavorites = localStorage.getItem("favorites");
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  }
  return favorites;
}

//Section for mobile phones not working
// document.addEventListener("DOMContentLoaded", () => {
//   const list = document.querySelector("#favoriteList");
//   const listItems = document.querySelectorAll("li");

//   let order = JSON.parse(localStorage.getItem("order")) || [];

//   listItems.forEach(item => {
//     item.draggable = true;

//     item.addEventListener("touchstart", e => {
//       e.preventDefault();
//       e.dataTransfer.setData("text/plain", e.target.id);
//       window.navigator.vibrate(50);
//     });

//     item.addEventListener("touchmove", e => {
//       e.preventDefault();
//       const target = document.elementFromPoint(
//         e.touches[0].clientX,
//         e.touches[0].clientY
//       );
//       if (target && target !== e.target) {
//         const rect = target.getBoundingClientRect();
//         const threshold = rect.top + rect.height / 2;
//         const parent = e.target.parentElement;
//         if (e.touches[0].clientY < threshold) {
//           parent.insertBefore(e.target, target);
//         } else {
//           parent.insertBefore(e.target, target.nextSibling);
//         }
//       }
//     });

//     item.addEventListener("touchend", e => {
//       const order = [];
//       list.querySelectorAll("li").forEach((item, index) => {
//         order.push(item.id);
//       });
//       localStorage.setItem("order", JSON.stringify(order));
//     });

//     const index = order.indexOf(item.id);
//     if (index > -1) {
//       list.insertBefore(item, list.children[index]);
//     }
//   });
// });
