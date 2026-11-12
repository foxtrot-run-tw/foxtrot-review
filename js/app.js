(function () {
  "use strict";

  var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
  var PLATFORM_ORDER = ["x", "threads", "instagram", "facebook", "linkedin", "web"];
  var RESULT_LABEL = { pass: "通過", fail: "未通過", na: "不適用" };
  var TYPE_META = {
    "daily-6": { label: "每日六平台" },
    "ig-carousel": { label: "IG 輪播" },
  };
  var TYPE_ORDER = ["daily-6", "ig-carousel"];
  var TYPE_SORT = { "ig-carousel": 0, "daily-6": 1 };

  function entryType(day) {
    return day.type || "daily-6";
  }

  function typeLabel(type) {
    return (TYPE_META[type] && TYPE_META[type].label) || type;
  }

  function daysData() {
    var raw = window.FOX_TROT_DAYS;
    if (!Array.isArray(raw)) return [];
    return raw.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      var ao = TYPE_SORT[entryType(a)];
      var bo = TYPE_SORT[entryType(b)];
      if (ao == null) ao = 9;
      if (bo == null) bo = 9;
      return ao - bo;
    });
  }

  function knownTypes(days) {
    var seen = {};
    var list = [];
    TYPE_ORDER.forEach(function (id) {
      if (days.some(function (d) { return entryType(d) === id; })) {
        seen[id] = true;
        list.push(id);
      }
    });
    days.forEach(function (day) {
      var type = entryType(day);
      if (!seen[type]) {
        seen[type] = true;
        list.push(type);
      }
    });
    return list;
  }

  function formatDate(iso) {
    var parts = iso.split("-").map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return parts[0] + "年" + parts[1] + "月" + parts[2] + "日（" + WEEKDAYS[d.getDay()] + "）";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function parseState() {
    var type = "all";
    var date = "all";
    var hash = (location.hash || "").replace(/^#/, "");
    if (hash) {
      if (hash === "all") return { type: "all", date: "all" };
      if (/^\d{4}-\d{2}-\d{2}$/.test(hash)) return { type: "all", date: hash };
      if (hash.indexOf("=") !== -1) {
        var hp = new URLSearchParams(hash);
        if (hp.get("type")) type = hp.get("type");
        if (hp.get("date")) date = hp.get("date");
        return { type: type, date: date };
      }
      if (hash === "daily-6" || hash === "ig-carousel" || TYPE_META[hash]) {
        return { type: hash, date: "all" };
      }
      return { type: "all", date: "all" };
    }
    var params = new URLSearchParams(location.search);
    if (params.get("type")) type = params.get("type");
    if (params.get("date")) date = params.get("date");
    return { type: type, date: date };
  }

  function stateHash(state) {
    if (state.type === "all" && state.date === "all") return "all";
    if (state.type === "all" && state.date !== "all") return state.date;
    if (state.date === "all") return "type=" + encodeURIComponent(state.type);
    return "type=" + encodeURIComponent(state.type) + "&date=" + encodeURIComponent(state.date);
  }

  function pageUrl(state) {
    return location.pathname + "#" + stateHash(state);
  }

  function writeState(state) {
    var url = pageUrl(state);
    var current = location.pathname + location.search + (location.hash || "");
    if (current === url || current === location.pathname + "#" + stateHash(state)) {
      if (location.search) history.replaceState(null, "", url);
      render();
      return;
    }
    if (location.search) {
      history.pushState(null, "", url);
      render();
      return;
    }
    location.hash = "#" + stateHash(state);
  }

  function toast(message) {
    var box = document.getElementById("toast");
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
      area.setSelectionRange(0, area.value.length);
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) {
        toast("已複製文字");
      } else {
        showCopyModal(text);
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast("已複製文字");
        },
        fallback
      );
    } else {
      fallback();
    }
  }

  function imageOf(day, key) {
    return day.images && day.images[key] ? day.images[key] : null;
  }

  function downloadButton(image, label) {
    var a = el("a", "btn");
    a.textContent = label || "下載圖片";
    a.href = image.src;
    a.setAttribute("download", image.filename || image.src.split("/").pop());
    a.setAttribute("aria-label", (label || "下載圖片") + "：" + (image.alt || image.filename || ""));
    return a;
  }

  function copyButton(text, label) {
    var btn = el("button", "btn btn-primary", label || "複製文字");
    btn.type = "button";
    btn.addEventListener("click", function () {
      copyText(text);
    });
    return btn;
  }

  function toolbar(platformLabel, copy, image) {
    var bar = el("div", "card-toolbar");
    bar.appendChild(el("div", "platform-name", platformLabel));
    var actions = el("div", "toolbar-actions");
    if (copy) actions.appendChild(copyButton(copy));
    if (image) actions.appendChild(downloadButton(image));
    bar.appendChild(actions);
    return bar;
  }

  function avatarImg(day) {
    var info = imageOf(day, "avatar");
    var img = el("img", "avatar");
    img.src = info ? info.src : "";
    img.alt = info ? info.alt : "Fox Trot";
    return img;
  }

  function postImage(image, ratioClass) {
    var wrap = el("div", "post-image-wrap " + (ratioClass || ""));
    var img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || "";
    wrap.appendChild(img);
    return wrap;
  }

  function userRow(day, displayName, meta, extra) {
    var row = el("div", "post-user");
    row.appendChild(avatarImg(day));
    var box = el("div");
    box.appendChild(el("p", "user-name", displayName));
    if (meta) box.appendChild(el("p", "user-meta", meta));
    row.appendChild(box);
    if (extra) row.appendChild(extra);
    return row;
  }

  function renderWeb(day, post) {
    var wrap = el("div", "card-wrap span-2");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("網頁文章", post.copyText, image));
    var article = el("article", "post article");
    if (image) {
      var hero = el("div", "article-hero");
      var img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || "";
      hero.appendChild(img);
      article.appendChild(hero);
    }
    var body = el("div", "article-body");
    body.appendChild(el("p", "article-kicker", "Fox Trot 專欄"));
    body.appendChild(el("h2", "article-title", post.title));
    if (post.dek) body.appendChild(el("p", "article-dek", post.dek));
    body.appendChild(el("p", "article-byline", "Fox Trot 編輯部 · " + formatDate(day.date) + " · 審查用，未發布"));
    var sections = post.sections || [];
    var firstP = -1;
    sections.forEach(function (section, i) {
      if (firstP === -1 && section.type === "p") firstP = i;
    });
    var preview = el("div", "article-preview");
    var rest = el("div", "article-rest");
    rest.hidden = true;
    sections.forEach(function (section, i) {
      var node;
      if (section.type === "h") {
        node = el("h3", "", section.text);
      } else if (section.type === "p") {
        node = el("p", "", section.text);
      } else if (section.type === "ol") {
        node = document.createElement("ol");
        (section.items || []).forEach(function (item) {
          node.appendChild(el("li", "", item));
        });
      }
      if (!node) return;
      if (i === firstP) preview.appendChild(node);
      else rest.appendChild(node);
    });
    if (day.charCounts) {
      rest.appendChild(
        el(
          "p",
          "article-count",
          "正文約 " + day.charCounts.webCjk + " 個中文字（含標點與英文數字約 " + day.charCounts.webNoWhitespace + " 字元，不含空白）。"
        )
      );
    }
    body.appendChild(preview);
    var toggle = el("button", "btn article-toggle", "展開全文");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = rest.hidden;
      rest.hidden = !open;
      toggle.textContent = open ? "收合全文" : "展開全文";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    body.appendChild(toggle);
    body.appendChild(rest);
    article.appendChild(body);
    wrap.appendChild(article);
    return wrap;
  }

  function renderThreads(day, post) {
    var wrap = el("div", "card-wrap threads");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("Threads", post.copyText, image));
    var card = el("div", "post");
    card.appendChild(userRow(day, post.displayName, "@" + post.handle + " · 審查用"));
    card.appendChild(el("div", "post-text", post.text));
    if (image) card.appendChild(postImage(image, "ratio-1x1"));
    wrap.appendChild(card);
    return wrap;
  }

  function renderInstagram(day, post) {
    var wrap = el("div", "card-wrap ig");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("Instagram", post.copyText, image));
    var card = el("div", "post");
    card.appendChild(userRow(day, post.displayName, "審查用，未發布"));
    if (image) card.appendChild(postImage(image, "ratio-4x5"));
    var icons = el("div", "icon-row");
    icons.appendChild(el("span", "", "♡  讚"));
    icons.appendChild(el("span", "", "💬  留言"));
    icons.appendChild(el("span", "", "↗  分享"));
    card.appendChild(icons);
    var caption = el("div", "ig-caption");
    var name = el("span", "ig-name", post.displayName);
    caption.appendChild(name);
    caption.appendChild(document.createTextNode(" " + post.caption));
    if (post.hashtags && post.hashtags.length) {
      caption.appendChild(document.createTextNode("\n\n"));
      var tags = el("span", "ig-tags", post.hashtags.join(" "));
      caption.appendChild(tags);
    }
    card.appendChild(caption);
    wrap.appendChild(card);
    return wrap;
  }

  function renderFacebook(day, post) {
    var wrap = el("div", "card-wrap fb");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("Facebook", post.copyText, image));
    var card = el("div", "post");
    card.appendChild(userRow(day, post.displayName, formatDate(day.date) + " · 審查用"));
    card.appendChild(el("div", "post-text", post.text));
    if (image) card.appendChild(postImage(image, "ratio-16x9"));
    var icons = el("div", "icon-row");
    icons.appendChild(el("span", "", "讚"));
    icons.appendChild(el("span", "", "留言"));
    icons.appendChild(el("span", "", "分享"));
    card.appendChild(icons);
    wrap.appendChild(card);
    return wrap;
  }

  function renderLinkedIn(day, post) {
    var wrap = el("div", "card-wrap li");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("LinkedIn", post.copyText, image));
    var card = el("div", "post");
    var follow = el("span", "li-follow", "關注");
    card.appendChild(userRow(day, post.displayName, (post.subtitle || "虛構跑步品牌") + " · 審查用", follow));
    card.appendChild(el("div", "post-text", post.text));
    if (image) card.appendChild(postImage(image, "ratio-16x9"));
    var icons = el("div", "icon-row");
    icons.appendChild(el("span", "", "推薦"));
    icons.appendChild(el("span", "", "留言"));
    icons.appendChild(el("span", "", "轉發"));
    card.appendChild(icons);
    wrap.appendChild(card);
    return wrap;
  }

  function renderX(day, post) {
    var wrap = el("div", "card-wrap x");
    var image = imageOf(day, post.imageKey);
    wrap.appendChild(toolbar("X", post.copyText, image));
    var card = el("div", "post");
    var nameRow = el("p", "user-name");
    nameRow.appendChild(document.createTextNode(post.displayName + " "));
    nameRow.appendChild(el("span", "x-handle", "@" + post.handle));
    var row = el("div", "post-user");
    row.appendChild(avatarImg(day));
    var box = el("div");
    box.appendChild(nameRow);
    box.appendChild(el("p", "user-meta", formatDate(day.date) + " · 審查用"));
    row.appendChild(box);
    card.appendChild(row);
    card.appendChild(el("div", "post-text", post.text));
    if (image) card.appendChild(postImage(image, "ratio-1x1"));
    var icons = el("div", "icon-row");
    icons.appendChild(el("span", "", "回覆"));
    icons.appendChild(el("span", "", "轉發"));
    icons.appendChild(el("span", "", "喜歡"));
    card.appendChild(icons);
    wrap.appendChild(card);
    return wrap;
  }

  var RENDERERS = {
    web: renderWeb,
    threads: renderThreads,
    instagram: renderInstagram,
    facebook: renderFacebook,
    linkedin: renderLinkedIn,
    x: renderX,
  };

  function renderSources(day) {
    var panel = el("section", "panel");
    panel.appendChild(el("h3", "", "資料來源"));
    var list = el("ul", "source-list");
    (day.sources || []).forEach(function (source) {
      var item = document.createElement("li");
      var title;
      if (source.url) {
        title = document.createElement("a");
        title.href = source.url;
        title.target = "_blank";
        title.rel = "noopener noreferrer";
        title.textContent = source.title;
      } else {
        title = el("strong", "", source.title);
      }
      item.appendChild(title);
      var meta = [source.authors, source.outlet].filter(Boolean).join(" · ");
      if (meta) item.appendChild(el("p", "source-meta", meta));
      if (source.note) item.appendChild(el("p", "source-note", source.note));
      list.appendChild(item);
    });
    panel.appendChild(list);
    return panel;
  }

  function renderChecks(day) {
    var panel = el("section", "panel");
    panel.appendChild(el("h3", "", "品質自我檢查"));
    var list = el("ul", "check-list");
    (day.selfCheck || []).forEach(function (check) {
      var item = document.createElement("li");
      var head = el("div", "check-head");
      head.appendChild(el("span", "check-item", check.item));
      var pill = el("span", "pill pill-" + check.result, RESULT_LABEL[check.result] || check.result);
      head.appendChild(pill);
      item.appendChild(head);
      if (check.note) item.appendChild(el("p", "check-note", check.note));
      list.appendChild(item);
    });
    panel.appendChild(list);
    return panel;
  }

  function bindCarousel(root, slides) {
    var scroller = root.querySelector(".carousel-scroller");
    var counter = root.querySelector(".carousel-counter");
    var dots = root.querySelectorAll(".carousel-dot");
    var prev = root.querySelector(".carousel-prev");
    var next = root.querySelector(".carousel-next");
    var live = root.querySelector(".carousel-live");
    var current = 0;

    function slideWidth() {
      return scroller.clientWidth || 1;
    }

    function setCurrent(index, scroll) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      if (scroll) {
        scroller.scrollTo({ left: current * slideWidth(), behavior: "smooth" });
      }
      if (counter) counter.textContent = current + 1 + " / " + slides.length;
      if (live) live.textContent = "第 " + (current + 1) + " 張，共 " + slides.length + " 張";
      dots.forEach(function (dot, i) {
        dot.setAttribute("aria-selected", i === current ? "true" : "false");
        dot.classList.toggle("is-active", i === current);
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
    if (prev) {
      prev.addEventListener("click", function () {
        setCurrent(current - 1, true);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        setCurrent(current + 1, true);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        setCurrent(i, true);
      });
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
  }

  function renderIgCarousel(day) {
    var block = el("section", "day-block day-ig-carousel");
    block.id = "entry-" + (day.id || day.date);
    var head = el("header", "day-head");
    var left = el("div");
    var kicker = el("p", "day-kicker");
    kicker.appendChild(el("span", "badge badge-type", typeLabel(entryType(day))));
    if (day.cycle) kicker.appendChild(el("span", "badge", day.cycle + " 日 · " + (day.cycleLabel || "")));
    kicker.appendChild(el("span", "badge badge-date", formatDate(day.date)));
    left.appendChild(kicker);
    left.appendChild(el("h1", "day-title", day.topic || day.title));
    head.appendChild(left);
    if (day.summary) head.appendChild(el("p", "day-summary", day.summary));
    block.appendChild(head);

    var layout = el("div", "carousel-layout");
    var previewWrap = el("div", "card-wrap ig carousel-preview");
    var bar = el("div", "card-toolbar");
    bar.appendChild(el("div", "platform-name", "Instagram 輪播"));
    var actions = el("div", "toolbar-actions");
    if (day.copyText) actions.appendChild(copyButton(day.copyText, "複製文案"));
    if (day.zip) actions.appendChild(downloadButton(day.zip, "打包下載"));
    bar.appendChild(actions);
    previewWrap.appendChild(bar);

    var card = el("div", "post");
    card.appendChild(userRow(day, day.displayName || "Fox Trot", "審查用，未發布 · 輪播"));

    var slides = day.slides || [];
    var frame = el("div", "carousel-frame");
    var scroller = el("div", "carousel-scroller");
    scroller.setAttribute("tabindex", "0");
    scroller.setAttribute("role", "region");
    scroller.setAttribute("aria-roledescription", "carousel");
    scroller.setAttribute("aria-label", (day.topic || "Instagram 輪播") + "，可用左右鍵或滑動切換");
    slides.forEach(function (slide, i) {
      var fig = el("figure", "carousel-slide");
      fig.id = (day.id || day.date) + "-slide-" + (i + 1);
      var img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt || "";
      img.draggable = false;
      fig.appendChild(img);
      scroller.appendChild(fig);
    });
    frame.appendChild(scroller);

    var prev = el("button", "carousel-nav carousel-prev", "‹");
    prev.type = "button";
    prev.setAttribute("aria-label", "上一張");
    var next = el("button", "carousel-nav carousel-next", "›");
    next.type = "button";
    next.setAttribute("aria-label", "下一張");
    var counter = el("div", "carousel-counter", slides.length ? "1 / " + slides.length : "0 / 0");
    var live = el("div", "visually-hidden carousel-live");
    live.setAttribute("aria-live", "polite");
    frame.appendChild(prev);
    frame.appendChild(next);
    frame.appendChild(counter);
    frame.appendChild(live);
    card.appendChild(frame);

    var dots = el("div", "carousel-dots");
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", "選擇張數");
    slides.forEach(function (slide, i) {
      var dot = el("button", "carousel-dot");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "第 " + (i + 1) + " 張");
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      if (i === 0) dot.classList.add("is-active");
      dots.appendChild(dot);
    });
    card.appendChild(dots);

    var icons = el("div", "icon-row");
    icons.appendChild(el("span", "", "♡  讚"));
    icons.appendChild(el("span", "", "💬  留言"));
    icons.appendChild(el("span", "", "↗  分享"));
    card.appendChild(icons);

    var caption = el("div", "ig-caption");
    var name = el("span", "ig-name", day.displayName || "Fox Trot");
    caption.appendChild(name);
    caption.appendChild(document.createTextNode(" " + (day.caption || "")));
    if (day.hashtags && day.hashtags.length) {
      caption.appendChild(document.createTextNode("\n\n"));
      caption.appendChild(el("span", "ig-tags", day.hashtags.join(" ")));
    }
    card.appendChild(caption);
    previewWrap.appendChild(card);
    bindCarousel(previewWrap, slides);
    layout.appendChild(previewWrap);

    var meta = el("div", "carousel-meta");
    var dlPanel = el("section", "panel carousel-side-panel");
    dlPanel.appendChild(el("h3", "", "下載與替代文字"));
    var allRow = el("div", "toolbar-actions carousel-all-actions");
    if (day.zip) allRow.appendChild(downloadButton(day.zip, "打包下載全部（ZIP）"));
    if (day.contactSheet) allRow.appendChild(downloadButton(day.contactSheet, "下載總覽圖"));
    dlPanel.appendChild(allRow);
    if (day.contactSheet) {
      var sheet = el("a", "contact-sheet-link");
      sheet.href = day.contactSheet.src;
      sheet.setAttribute("download", day.contactSheet.filename || "contact-sheet.jpg");
      var sheetImg = document.createElement("img");
      sheetImg.src = day.contactSheet.src;
      sheetImg.alt = day.contactSheet.alt || "輪播總覽";
      sheet.appendChild(sheetImg);
      dlPanel.appendChild(sheet);
    }
    var list = el("ol", "slide-download-list");
    slides.forEach(function (slide, i) {
      var item = document.createElement("li");
      var label = el("div", "slide-download-label", "第 " + (i + 1) + " 張");
      item.appendChild(label);
      item.appendChild(el("p", "slide-alt", slide.alt || "（無替代文字）"));
      item.appendChild(downloadButton(slide, "下載第 " + (i + 1) + " 張"));
      list.appendChild(item);
    });
    dlPanel.appendChild(list);
    meta.appendChild(dlPanel);
    layout.appendChild(meta);
    block.appendChild(layout);

    if (day.sources && day.sources.length) block.appendChild(renderSources(day));
    if (day.selfCheck && day.selfCheck.length) block.appendChild(renderChecks(day));
    return block;
  }

  function renderDaily6(day) {
    var block = el("section", "day-block day-daily-6");
    block.id = "entry-" + (day.id || day.date);
    var head = el("header", "day-head");
    var left = el("div");
    var kicker = el("p", "day-kicker");
    kicker.appendChild(el("span", "badge badge-type", typeLabel(entryType(day))));
    kicker.appendChild(el("span", "badge", day.cycle + " 日 · " + day.cycleLabel));
    kicker.appendChild(el("span", "badge badge-date", formatDate(day.date)));
    left.appendChild(kicker);
    left.appendChild(el("h1", "day-title", day.topic || day.title));
    head.appendChild(left);
    if (day.summary) head.appendChild(el("p", "day-summary", day.summary));
    block.appendChild(head);

    var cards = el("div", "cards");
    PLATFORM_ORDER.forEach(function (key) {
      var post = day.posts && day.posts[key];
      var render = RENDERERS[key];
      if (post && render) cards.appendChild(render(day, post));
    });
    block.appendChild(cards);
    block.appendChild(renderSources(day));
    block.appendChild(renderChecks(day));
    return block;
  }

  var ENTRY_RENDERERS = {
    "daily-6": renderDaily6,
    "ig-carousel": renderIgCarousel,
  };

  function renderEntry(day) {
    var render = ENTRY_RENDERERS[entryType(day)] || renderDaily6;
    return render(day);
  }

  function uniqueDates(days) {
    var seen = {};
    var list = [];
    days.forEach(function (day) {
      if (!seen[day.date]) {
        seen[day.date] = true;
        list.push(day.date);
      }
    });
    return list;
  }

  function fillSelect(dates, current) {
    var select = document.getElementById("date-select");
    select.innerHTML = "";
    var all = document.createElement("option");
    all.value = "all";
    all.textContent = "全部日期（最新在上）";
    select.appendChild(all);
    dates.forEach(function (iso) {
      var opt = document.createElement("option");
      opt.value = iso;
      opt.textContent = formatDate(iso);
      select.appendChild(opt);
    });
    select.value = current === "all" || dates.indexOf(current) !== -1 ? current : "all";
  }

  function fillTypeFilter(types, current) {
    var nav = document.getElementById("type-filter");
    nav.innerHTML = "";
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", "依版型篩選");
    var ids = ["all"].concat(types);
    ids.forEach(function (id) {
      var btn = el("button", "type-tab", id === "all" ? "全部" : typeLabel(id));
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-type", id);
      btn.setAttribute("aria-selected", id === current ? "true" : "false");
      if (id === current) btn.classList.add("is-active");
      btn.addEventListener("click", function () {
        var state = parseState();
        state.type = id;
        writeState(state);
      });
      nav.appendChild(btn);
    });
  }

  function render() {
    var all = daysData();
    var types = knownTypes(all);
    var state = parseState();
    if (state.type !== "all" && types.indexOf(state.type) === -1) state.type = "all";
    var byType = state.type === "all" ? all : all.filter(function (d) { return entryType(d) === state.type; });
    var dates = uniqueDates(byType);
    var visible = state.date === "all" ? byType : byType.filter(function (d) { return d.date === state.date; });
    fillTypeFilter(types, state.type);
    fillSelect(dates, visible.length ? state.date : "all");
    if (state.date !== "all" && !visible.length) {
      visible = byType;
    }

    var app = document.getElementById("app");
    app.innerHTML = "";
    if (!visible.length) {
      app.appendChild(el("p", "empty", "這個篩選目前沒有審查內容。"));
    } else {
      visible.forEach(function (day) {
        app.appendChild(renderEntry(day));
      });
    }
    var footer = document.getElementById("footer-count");
    var parts = [];
    types.forEach(function (id) {
      var n = all.filter(function (d) { return entryType(d) === id; }).length;
      parts.push(n + " 則「" + typeLabel(id) + "」");
    });
    footer.textContent = "顯示 " + visible.length + " 則 · 共 " + all.length + " 則（" + parts.join("、") + "）";
  }

  document.getElementById("date-select").addEventListener("change", function (event) {
    var state = parseState();
    state.date = event.target.value;
    writeState(state);
  });

  document.getElementById("copy-modal-close").addEventListener("click", function () {
    document.getElementById("copy-modal").hidden = true;
  });
  document.getElementById("copy-modal-select").addEventListener("click", function () {
    var area = document.getElementById("copy-modal-text");
    area.focus();
    area.select();
  });
  document.getElementById("copy-modal").addEventListener("click", function (event) {
    if (event.target.id === "copy-modal") event.currentTarget.hidden = true;
  });

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  if (location.search) {
    history.replaceState(null, "", pageUrl(parseState()));
  }
  render();
})();
