(function () {
  var titleEl = document.getElementById("tagArchiveTitle");
  var emptyEl = document.getElementById("tagArchiveEmpty");
  var listEl = document.getElementById("tagArchiveList");
  var indexEl = document.getElementById("tagArchiveIndex");

  if (!listEl) return;

  var base = window.SITE_BASEURL || "";
  var params = new URLSearchParams(window.location.search);
  var tag = params.get("tag");

  function formatDate(iso) {
    var d = new Date(iso);
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function renderPostList(posts) {
    posts.forEach(function (post) {
      var li = document.createElement("li");
      li.className = "post-list-item";

      var dateP = document.createElement("p");
      dateP.className = "post-list-date";
      dateP.textContent = formatDate(post.date);
      li.appendChild(dateP);

      var h2 = document.createElement("h2");
      h2.className = "post-list-title";
      var titleA = document.createElement("a");
      titleA.href = post.url;
      titleA.textContent = post.title;
      h2.appendChild(titleA);
      li.appendChild(h2);

      if (post.excerpt) {
        var excerptP = document.createElement("p");
        excerptP.className = "post-list-excerpt";
        excerptP.textContent = post.excerpt;
        li.appendChild(excerptP);
      }

      var more = document.createElement("a");
      more.className = "post-list-more";
      more.href = post.url;
      more.textContent = "Read more \u2192";
      li.appendChild(more);

      listEl.appendChild(li);
    });
  }

  function renderTagIndex(posts) {
    var counts = new Map();
    posts.forEach(function (post) {
      (post.tags || []).forEach(function (t) {
        counts.set(t, (counts.get(t) || 0) + 1);
      });
    });

    var sorted = Array.from(counts.entries()).sort(function (a, b) { return b[1] - a[1]; });

    if (sorted.length === 0) {
      indexEl.innerHTML = '<p class="sidebar-empty">No tags yet.</p>';
      return;
    }

    var ul = document.createElement("ul");
    ul.className = "tag-cloud tag-cloud-full";
    sorted.forEach(function (entry) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "tag-pill";
      a.href = base + "/tags/?tag=" + encodeURIComponent(entry[0]);
      a.innerHTML = entry[0] + ' <span class="tag-pill-count">' + entry[1] + "</span>";
      li.appendChild(a);
      ul.appendChild(li);
    });
    indexEl.appendChild(ul);
  }

  var dataEl = document.getElementById("postsData");
  var posts = [];
  try {
    posts = dataEl ? JSON.parse(dataEl.textContent) : [];
  } catch (err) {
    console.error("Could not parse post data for the tag archive:", err);
  }

  if (!tag) {
    titleEl.textContent = "Browse by tag";
    renderTagIndex(posts);
  } else {
    titleEl.textContent = "Posts tagged \u201c" + tag + "\u201d";
    var q = tag.toLowerCase();
    var matches = posts.filter(function (post) {
      return (post.tags || []).some(function (t) { return t.toLowerCase() === q; });
    });

    if (matches.length === 0) {
      emptyEl.hidden = false;
    } else {
      renderPostList(matches);
    }
  }
})();
