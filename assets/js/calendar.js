(function () {
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var grid = document.getElementById("calendarGrid");
  var monthLabel = document.getElementById("calMonthLabel");
  var prevBtn = document.getElementById("calPrevBtn");
  var nextBtn = document.getElementById("calNextBtn");
  var dayLabel = document.getElementById("calendarDayLabel");
  var dayPostsList = document.getElementById("calendarDayPosts");

  if (!grid || !monthLabel || !prevBtn || !nextBtn) return;

  var postsByDay = new Map();
  var viewYear, viewMonth; // viewMonth is 0-indexed
  var selectedDayKey = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function dayKeyFromIso(iso) {
    return iso.slice(0, 10); // "YYYY-MM-DD" — avoids browser-timezone drift
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function renderMonthLabel() {
    monthLabel.textContent = MONTH_NAMES[viewMonth] + " " + viewYear;
  }

  function updateNavButtons() {
    var now = new Date();
    var isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    nextBtn.disabled = isCurrentMonth;
    nextBtn.setAttribute("aria-disabled", String(isCurrentMonth));
  }

  function renderGrid() {
    renderMonthLabel();
    updateNavButtons();
    grid.innerHTML = "";

    var firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var i = 0; i < firstWeekday; i++) {
      var blank = document.createElement("span");
      blank.className = "calendar-cell calendar-cell-blank";
      grid.appendChild(blank);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var dayKey = viewYear + "-" + pad(viewMonth + 1) + "-" + pad(day);
      var hasPosts = postsByDay.has(dayKey);
      var isFuture = dayKey > todayKey(); // "YYYY-MM-DD" strings compare chronologically

      var cell = document.createElement("button");
      cell.type = "button";
      cell.className = "calendar-cell calendar-cell-day"
        + (hasPosts ? " has-posts" : "")
        + (dayKey === selectedDayKey ? " is-selected" : "")
        + (isFuture ? " is-future" : "");
      cell.textContent = String(day);
      cell.setAttribute("data-day-key", dayKey);
      cell.setAttribute("aria-label", MONTH_NAMES[viewMonth] + " " + day + ", " + viewYear + (hasPosts ? " — has posts" : ""));

      if (isFuture) {
        cell.disabled = true;
        cell.setAttribute("aria-disabled", "true");
      } else {
        cell.addEventListener("click", function () {
          selectDay(this.getAttribute("data-day-key"));
        });
      }

      grid.appendChild(cell);
    }
  }

  function selectDay(dayKey) {
    selectedDayKey = dayKey;

    var cells = grid.querySelectorAll(".calendar-cell-day");
    cells.forEach(function (cell) {
      cell.classList.toggle("is-selected", cell.getAttribute("data-day-key") === dayKey);
    });

    renderDayPosts(dayKey);
  }

  function formatDayLabel(dayKey) {
    var parts = dayKey.split("-").map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return MONTH_NAMES[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function renderDayPosts(dayKey) {
    if (dayLabel) dayLabel.textContent = formatDayLabel(dayKey);

    var posts = postsByDay.get(dayKey) || [];
    dayPostsList.innerHTML = "";

    if (posts.length === 0) {
      var empty = document.createElement("li");
      empty.className = "sidebar-empty";
      empty.textContent = "No posts on this day.";
      dayPostsList.appendChild(empty);
      return;
    }

    posts.slice(0, 3).forEach(function (post) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = post.url;
      a.textContent = post.title;
      li.appendChild(a);
      dayPostsList.appendChild(li);
    });
  }

  prevBtn.addEventListener("click", function () {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderGrid();
  });

  nextBtn.addEventListener("click", function () {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderGrid();
  });

  function init(posts) {
    posts.forEach(function (post) {
      var key = dayKeyFromIso(post.date);
      if (!postsByDay.has(key)) postsByDay.set(key, []);
      postsByDay.get(key).push(post); // already newest-first from Jekyll
    });

    var initialKey = todayKey();
    var initialParts = initialKey.split("-").map(Number);
    viewYear = initialParts[0];
    viewMonth = initialParts[1] - 1;
    selectedDayKey = initialKey;

    renderGrid();
    renderDayPosts(initialKey);
  }

  var dataEl = document.getElementById("postsData");
  var posts = [];
  try {
    posts = dataEl ? JSON.parse(dataEl.textContent) : [];
  } catch (err) {
    console.error("Could not parse post data for the calendar widget:", err);
  }
  init(posts);
})();
