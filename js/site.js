(function () {
  "use strict";

  function toast(message) {
    var box = document.getElementById("toast");
    if (!box) return;
    box.textContent = message;
    box.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      box.hidden = true;
    }, 2200);
  }

  function showCopyModal(text) {
    var modal = document.getElementById("copy-modal");
    var area = document.getElementById("copy-modal-text");
    if (!modal || !area) return;
    area.value = text;
    modal.hidden = false;
    area.focus();
    area.select();
  }

  function copyText(text) {
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, text.length);
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) toast("已複製文字");
      else showCopyModal(text);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { toast("已複製文字"); },
        fallback
      );
    } else {
      fallback();
    }
  }

  function bindCopy() {
    document.querySelectorAll(".js-copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-copy-for");
        var source = id ? document.getElementById(id) : null;
        var text = source ? source.value || source.textContent : "";
        if (text) copyText(text);
      });
    });
    var modal = document.getElementById("copy-modal");
    if (!modal) return;
    var close = document.getElementById("copy-modal-close");
    var select = document.getElementById("copy-modal-select");
    if (close) {
      close.addEventListener("click", function () {
        modal.hidden = true;
      });
    }
    if (select) {
      select.addEventListener("click", function () {
        var area = document.getElementById("copy-modal-text");
        area.focus();
        area.select();
      });
    }
    modal.addEventListener("click", function (event) {
      if (event.target.id === "copy-modal") modal.hidden = true;
    });
  }

  function bindCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      var scroller = root.querySelector(".carousel-scroller");
      var slides = root.querySelectorAll(".carousel-slide");
      var counter = root.querySelector(".carousel-counter");
      var dots = root.querySelectorAll(".carousel-dot");
      var prev = root.querySelector(".carousel-prev");
      var next = root.querySelector(".carousel-next");
      var live = root.querySelector(".carousel-live");
      if (!scroller || !slides.length) return;
      var current = 0;

      function slideWidth() {
        return scroller.clientWidth || 1;
      }

      function setCurrent(index, scroll) {
        current = (index + slides.length) % slides.length;
        if (scroll) {
          scroller.scrollTo({ left: current * slideWidth(), behavior: "smooth" });
        }
        if (counter) counter.textContent = current + 1 + " / " + slides.length;
        if (live) live.textContent = "第 " + (current + 1) + " 張，共 " + slides.length + " 張";
        dots.forEach(function (dot, i) {
          var on = i === current;
          dot.setAttribute("aria-selected", on ? "true" : "false");
          dot.classList.toggle("is-active", on);
        });
        if (prev) prev.disabled = current === 0;
        if (next) next.disabled = current === slides.length - 1;
      }

      function fromScroll() {
        var index = Math.round(scroller.scrollLeft / slideWidth());
        if (index < 0) index = 0;
        if (index > slides.length - 1) index = slides.length - 1;
        setCurrent(index, false);
      }

      scroller.addEventListener("scroll", function () {
        window.requestAnimationFrame(fromScroll);
      });
      if (prev) prev.addEventListener("click", function () { setCurrent(current - 1, true); });
      if (next) next.addEventListener("click", function () { setCurrent(current + 1, true); });
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { setCurrent(i, true); });
      });
      scroller.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setCurrent(current - 1, true);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          setCurrent(current + 1, true);
        }
      });
      window.addEventListener("resize", function () {
        scroller.scrollLeft = current * slideWidth();
      });
      setCurrent(0, false);
    });
  }

  function parseHash() {
    var type = "all";
    var date = "all";
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash || hash === "all") return { type: type, date: date };
    if (/^\d{4}-\d{2}-\d{2}$/.test(hash)) return { type: "all", date: hash };
    if (hash.indexOf("=") !== -1) {
      var hp = new URLSearchParams(hash);
      if (hp.get("type")) type = hp.get("type");
      if (hp.get("date")) date = hp.get("date");
      return { type: type, date: date };
    }
    if (hash === "daily-6" || hash === "ig-carousel") return { type: hash, date: "all" };
    return { type: type, date: date };
  }

  function stateHash(state) {
    if (state.type === "all" && state.date === "all") return "all";
    if (state.type === "all" && state.date !== "all") return state.date;
    if (state.date === "all") return "type=" + encodeURIComponent(state.type);
    return "type=" + encodeURIComponent(state.type) + "&date=" + encodeURIComponent(state.date);
  }

  function postIndex() {
    var node = document.getElementById("post-index");
    if (!node) return [];
    try {
      return JSON.parse(node.textContent);
    } catch (err) {
      return [];
    }
  }

  function matches(entry, state) {
    if (state.type !== "all" && entry.type !== state.type) return false;
    if (state.date !== "all" && entry.date !== state.date) return false;
    return true;
  }

  function redirectIfUnique(state) {
    if (!document.body.classList.contains("page-home")) return false;
    // Bare type filters stay on the directory. Only jump when a date is
    // in the hash and it pinpoints a single post.
    if (state.date === "all") return false;
    var found = postIndex().filter(function (entry) { return matches(entry, state); });
    if (found.length === 1) {
      location.replace(found[0].href);
      return true;
    }
    return false;
  }

  function applyDirectoryFilter(state) {
    var items = document.querySelectorAll(".dir-item");
    var groups = document.querySelectorAll(".dir-group");
    var visible = 0;
    items.forEach(function (item) {
      var ok =
        (state.type === "all" || item.getAttribute("data-type") === state.type) &&
        (state.date === "all" || item.getAttribute("data-date") === state.date);
      item.classList.toggle("is-hidden", !ok);
      if (ok) visible += 1;
    });
    groups.forEach(function (group) {
      var any = group.querySelectorAll(".dir-item:not(.is-hidden)").length > 0;
      group.hidden = !any;
    });
    var empty = document.querySelector(".dir-empty");
    if (empty) empty.classList.toggle("is-visible", visible === 0);
    document.querySelectorAll("#type-filter .type-tab").forEach(function (tab) {
      var on = tab.getAttribute("data-type") === state.type;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.classList.toggle("is-active", on);
    });
  }

  function bindDirectory() {
    if (!document.getElementById("type-filter")) return;
    var state = parseHash();
    if (redirectIfUnique(state)) return;
    applyDirectoryFilter(state);

    document.querySelectorAll("#type-filter .type-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var next = { type: tab.getAttribute("data-type") || "all", date: "all" };
        var hash = "#" + stateHash(next);
        if (location.hash === hash || (hash === "#all" && !location.hash)) {
          applyDirectoryFilter(next);
          return;
        }
        location.hash = hash;
      });
    });

    window.addEventListener("hashchange", function () {
      var current = parseHash();
      if (redirectIfUnique(current)) return;
      applyDirectoryFilter(current);
    });
  }

  bindCopy();
  bindCarousels();
  bindDirectory();
})();
