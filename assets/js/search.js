(function () {
  var input = document.getElementById("siteSearchInput");
  var resultsBox = document.getElementById("siteSearchResults");

  if (!input || !resultsBox) return;

  var base = window.SITE_BASEURL || "";
  var posts = null;
  var debounceTimer = null;

  function loadPosts() {
    if (posts) return Promise.resolve(posts);
    return fetch(base + "/assets/posts.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        posts = data;
        return posts;
      })
      .catch(function () {
        posts = [];
        return posts;
      });
  }

  function renderResults(matches, query) {
    resultsBox.innerHTML = "";

    if (matches.length === 0) {
      var empty = document.createElement("p");
      empty.className = "site-search-empty";
      empty.textContent = "No posts match \u201c" + query + "\u201d.";
      resultsBox.appendChild(empty);
      resultsBox.hidden = false;
      return;
    }

    var list = document.createElement("ul");
    matches.slice(0, 8).forEach(function (post) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = post.url;
      a.textContent = post.title;
      li.appendChild(a);
      list.appendChild(li);
    });
    resultsBox.appendChild(list);
    resultsBox.hidden = false;
  }

  function runSearch(query) {
    var q = query.trim().toLowerCase();

    if (q.length < 2) {
      resultsBox.hidden = true;
      resultsBox.innerHTML = "";
      return;
    }

    loadPosts().then(function (allPosts) {
      var matches = allPosts.filter(function (post) {
        var haystack = (
          post.title + " " +
          (post.tags || []).join(" ") + " " +
          (post.excerpt || "")
        ).toLowerCase();
        return haystack.indexOf(q) !== -1;
      });
      renderResults(matches, query.trim());
    });
  }

  input.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    var value = input.value;
    debounceTimer = setTimeout(function () { runSearch(value); }, 150);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim().length >= 2 && resultsBox.innerHTML !== "") {
      resultsBox.hidden = false;
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".site-search")) {
      resultsBox.hidden = true;
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      resultsBox.hidden = true;
      input.blur();
    }
  });
})();
