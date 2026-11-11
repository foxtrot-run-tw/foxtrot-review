(function () {
  "use strict";

  var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
  var PLATFORM_ORDER = ["web", "threads", "instagram", "facebook", "linkedin", "x"];
  var RESULT_LABEL = { pass: "通過", fail: "未通過", na: "不適用" };

  function daysData() {
    var raw = window.FOX_TROT_DAYS;
    if (!Array.isArray(raw)) return [];
    return raw.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
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

  function selectedDate() {
    var hash = (location.hash || "").replace(/^#/, "");
    return hash || "all";
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

  function downloadButton(image) {
    var a = el("a", "btn");
    a.textContent = "下載圖片";
    a.href = image.src;
    a.setAttribute("download", image.src.split("/").pop());
    a.setAttribute("aria-label", "下載圖片：" + (image.alt || ""));
    return a;
  }

  function copyButton(text) {
    var btn = el("button", "btn btn-primary", "複製文字");
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
    (post.sections || []).forEach(function (section) {
      if (section.type === "h") {
        body.appendChild(el("h3", "", section.text));
      } else if (section.type === "p") {
        body.appendChild(el("p", "", section.text));
      } else if (section.type === "ol") {
        var list = document.createElement("ol");
        (section.items || []).forEach(function (item) {
          list.appendChild(el("li", "", item));
        });
        body.appendChild(list);
      }
    });
    if (day.charCounts) {
      body.appendChild(
        el(
          "p",
          "article-count",
          "正文約 " + day.charCounts.webCjk + " 個中文字（含標點與英文數字約 " + day.charCounts.webNoWhitespace + " 字元，不含空白）。"
        )
      );
    }
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

  function renderDay(day) {
    var block = el("section", "day-block");
    block.id = "day-" + day.date;
    var head = el("header", "day-head");
    var left = el("div");
    var kicker = el("p", "day-kicker");
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

  function fillSelect(days, current) {
    var select = document.getElementById("date-select");
    select.innerHTML = "";
    var all = document.createElement("option");
    all.value = "all";
    all.textContent = "全部日期（最新在上）";
    select.appendChild(all);
    days.forEach(function (day) {
      var opt = document.createElement("option");
      opt.value = day.date;
      opt.textContent = formatDate(day.date) + " · " + day.cycle + " 日";
      select.appendChild(opt);
    });
    select.value = current === "all" || days.some(function (d) { return d.date === current; }) ? current : "all";
  }

  function render() {
    var all = daysData();
    var current = selectedDate();
    var visible = current === "all" ? all : all.filter(function (d) { return d.date === current; });
    fillSelect(all, visible.length ? current : "all");
    if (current !== "all" && !visible.length) {
      visible = all;
    }
    var app = document.getElementById("app");
    app.innerHTML = "";
    if (!visible.length) {
      app.appendChild(el("p", "empty", "目前還沒有審查內容。"));
    } else {
      visible.forEach(function (day) {
        app.appendChild(renderDay(day));
      });
    }
    var footer = document.getElementById("footer-count");
    footer.textContent = "共 " + all.length + " 日";
  }

  document.getElementById("date-select").addEventListener("change", function (event) {
    var value = event.target.value;
    location.hash = value === "all" ? "all" : value;
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
  render();
})();
