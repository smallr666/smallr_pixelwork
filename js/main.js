/* =========================================================
   SmallR Pixel Portfolio — interactions
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const WORKS = window.WORKS, CATS = window.CATEGORIES, JOURNEY = window.JOURNEY, CURSORS = window.CURSORS;
  const FEATURED = ["miraidon", "emperor-penguin", "seascape"];
  const CUR_DIR = "assets/works/xmas-cursor/";

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  /* ---------- Language ---------- */
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = urlLang || store.get("lang") || ((navigator.language || "zh").toLowerCase().startsWith("zh") ? "zh" : "en");
  if (!window.I18N[lang]) lang = "zh";
  const t = (k) => (window.I18N[lang][k] ?? window.I18N.zh[k] ?? k);
  const L = (obj) => (obj == null ? "" : typeof obj === "string" ? obj : (obj[lang] ?? obj.zh));
  const catName = (id) => L(CATS.find(c => c.id === id));
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function applyLang() {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    document.title = t("meta.title");
    $$("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-label]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nLabel)); el.title = t(el.dataset.i18nLabel); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $("#skillList").innerHTML = t("about.skillList").map(s => `<li>${esc(s)}</li>`).join("");
    updateCursorBtn();
    renderStats(); renderFeatured(); renderFilters(); renderGrid(); renderJourney();
    if (current) renderModal(current);
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang; store.set("lang", lang); applyLang();
  }));

  /* ---------- Header ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }));

  // Active nav link
  const sections = ["works", "journey", "about", "contact"].map(id => document.getElementById(id));
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) $$("#nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => navIO.observe(s));

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch {} ta.remove(); return ok;
    }
  }

  /* ---------- Penguin cursor mode ---------- */
  const curURL = (file) => { const c = CURSORS.find(x => x.file === file); return `url("${new URL(CUR_DIR + file + ".png", location.href).href}") ${c.hot[0]} ${c.hot[1]}`; };
  const root = document.documentElement;
  root.style.setProperty("--cur-default", curURL("01-normal"));
  root.style.setProperty("--cur-pointer", curURL("14-link"));
  root.style.setProperty("--cur-text", curURL("06-text"));
  root.style.setProperty("--cur-ew", curURL("09-ew-resize"));
  root.style.setProperty("--cur-precision", curURL("05-precision"));
  let cursorOn = store.get("penguinCursor") === "1";
  function setCursor(on) {
    cursorOn = on; root.classList.toggle("penguin-cursor", on); store.set("penguinCursor", on ? "1" : "0");
    updateCursorBtn();
    $$(".cur-apply").forEach(b => b.textContent = t(on ? "cursors.remove" : "cursors.apply"));
  }
  function updateCursorBtn() {
    const b = $("#cursorToggle"); b.setAttribute("aria-pressed", String(cursorOn));
    b.title = t(cursorOn ? "cursor.on" : "cursor.off"); b.setAttribute("aria-label", b.title);
  }
  $("#cursorToggle").addEventListener("click", () => { setCursor(!cursorOn); toast(t(cursorOn ? "cursor.on" : "cursor.off")); });
  setCursor(cursorOn);

  /* ---------- Hero ---------- */
  function renderStats() {
    const years = new Set(WORKS.map(w => w.year)).size;
    const anims = WORKS.reduce((n, w) => n + w.modules.filter(m => m.type === "player").length, 0);
    const items = [[years, t("stat.years")], [WORKS.length, t("stat.projects")], [anims, t("stat.anims")], [CURSORS.length, t("stat.cursors")]];
    $("#stats").innerHTML = items.map(([n, l]) => `<li><b>${n}</b><span>${esc(l)}</span></li>`).join("");
  }
  let lineIdx = 0, bubbleTimer;
  $("#mascot").addEventListener("click", () => {
    const lines = t("mascot.lines"), b = $("#bubble");
    b.textContent = lines[lineIdx++ % lines.length]; b.classList.add("show");
    clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => b.classList.remove("show"), 2200);
  });

  /* ---------- Featured ---------- */
  function renderFeatured() {
    $("#featured").innerHTML = FEATURED.map(id => {
      const w = WORKS.find(x => x.id === id);
      const img = w.id === "emperor-penguin" ? "assets/works/emperor-penguin/title.gif" : w.thumb;
      const tag = badgesOf(w)[0];
      return `<button class="feat" type="button" data-open="${w.id}">
        <span class="feat-art${w.smooth ? " smooth" : ""}" style="background:${w.bg}"><img src="${img}" alt="${esc(L(w.title))}" loading="lazy">${tag ? `<span class="feat-tag">${esc(tag)}</span>` : ""}</span>
        <span class="feat-body">
          <span class="meta">${w.year} · ${esc(w.cats.map(catName).join(" / "))}</span>
          <h3>${esc(L(w.title))}</h3>
          <p>${esc(L(w.desc))}</p>
          <span class="feat-open">${esc(t("featured.open"))} →</span>
        </span>
      </button>`;
    }).join("");
  }

  /* ---------- Filters & grid ---------- */
  let fCat = "all", fYear = "all";
  const years = [...new Set(WORKS.map(w => w.year))].sort();
  const match = (w, c = fCat, y = fYear) => (c === "all" || w.cats.includes(c)) && (y === "all" || w.year === +y);

  function renderFilters() {
    $("#catChips").innerHTML = CATS.map(c => {
      const n = WORKS.filter(w => match(w, c.id, fYear)).length;
      return `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${c.id === fCat}">${esc(L(c))}<span class="n">${n}</span></button>`;
    }).join("");
    $("#yearSeg").innerHTML = [["all", t("works.allYears")], ...years.map(y => [String(y), y])]
      .map(([v, l]) => `<button type="button" data-year="${v}" aria-pressed="${String(v) === String(fYear)}">${l}</button>`).join("");
  }
  $("#catChips").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; fCat = b.dataset.cat; renderFilters(); renderGrid(); });
  $("#yearSeg").addEventListener("click", e => { const b = e.target.closest("[data-year]"); if (!b) return; fYear = b.dataset.year; renderFilters(); renderGrid(); });

  const badgesOf = (w) => Array.isArray(w.badges) ? w.badges : (w.badges ? (w.badges[lang] || w.badges.zh) : []);

  function thumbHTML(w) {
    if (w.thumbGrid) return `<span class="thumb-grid">${w.thumbGrid.map(s => `<img src="${s}" alt="" loading="lazy" width="32" height="32">`).join("")}</span>`;
    const cls = [w.smooth ? "smooth" : "", w.thumbFit === "cover" ? "cover" : ""].join(" ").trim();
    return `<img class="${cls}" src="${w.thumb}" alt="${esc(L(w.title))}" loading="lazy">` +
      (w.hover ? `<img class="hover-img" data-src="${w.hover}" alt="" aria-hidden="true">` : "");
  }

  function renderGrid() {
    const list = WORKS.filter(w => match(w)).sort((a, b) => b.year - a.year);
    $("#grid").innerHTML = list.map((w, i) => {
      const badges = badgesOf(w).map(b => `<span class="badge">${esc(b)}</span>`).join("") + (w.fanart ? `<span class="badge alt">${esc(t("works.fanart"))}</span>` : "");
      return `<button class="card" type="button" data-open="${w.id}" style="animation-delay:${i * 40}ms">
        <span class="thumb" style="background:${w.bg}">${thumbHTML(w)}<span class="badges">${badges}</span></span>
        <span class="card-body">
          <span class="card-top"><span class="card-title">${esc(L(w.title))}</span><span class="card-year">${w.year}</span></span>
          <span class="card-desc">${esc(L(w.desc))}</span>
          <span class="card-tags">${w.cats.map(c => `<span class="tag">${esc(catName(c))}</span>`).join("")}</span>
        </span>
      </button>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
    $("#resultCount").textContent = t("works.count").replace("{n}", list.length);
    // load hover GIFs only when needed
    $$("#grid .card").forEach(card => {
      const h = $(".hover-img", card); if (!h) return;
      const load = () => { if (!h.src) h.src = h.dataset.src; };
      card.addEventListener("pointerenter", load, { once: true });
      card.addEventListener("focus", load, { once: true });
    });
  }

  /* ---------- Journey ---------- */
  function renderJourney() {
    $("#levels").innerHTML = JOURNEY.map(j => {
      const ws = WORKS.filter(w => w.year === j.year);
      return `<li class="level">
        <span class="lv-badge">Lv.${j.lv}</span>
        <span class="lv-year">${j.year}</span>
        <h3 class="lv-title">${esc(L(j).title)}</h3>
        <p class="lv-text">${esc(L(j).text)}</p>
        <div class="lv-works">${ws.map(w => {
          const src = w.thumbGrid ? w.thumbGrid[0] : w.thumb;
          return `<button class="lv-work" type="button" data-open="${w.id}" title="${esc(L(w.title))}" style="background:${w.bg}"><img class="${w.smooth ? "smooth" : ""}" src="${src}" alt="${esc(L(w.title))}" loading="lazy"></button>`;
        }).join("")}</div>
      </li>`;
    }).join("");
    observeLevels();
  }
  let levelIO;
  function observeLevels() {
    levelIO?.disconnect();
    levelIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const lvls = $$(".level");
        lvls.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 120));
        $("#xpFill").style.width = "100%";
        levelIO.disconnect();
      });
    }, { threshold: .2 });
    levelIO.observe($("#levels"));
  }

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  let current = null, players = [];
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-open]"); if (!b) return;
    openWork(b.dataset.open);
  });
  function openWork(id, push = true) {
    const w = WORKS.find(x => x.id === id); if (!w) return;
    current = w; renderModal(w);
    if (!modal.open) { modal.showModal(); document.body.style.overflow = "hidden"; $(".modal-inner").focus({ preventScroll: true }); }
    $(".modal-body").scrollTop = 0;
    if (push) history.replaceState(null, "", "#work/" + id);
  }
  function closeModal() {
    if (!modal.open) return;
    stopPlayers(); modal.close();
  }
  modal.addEventListener("close", () => {
    stopPlayers(); current = null; document.body.style.overflow = "";
    if (location.hash.startsWith("#work/")) history.replaceState(null, "", location.pathname + location.search);
  });
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  $("#modalClose").addEventListener("click", closeModal);
  const step = (d) => { const list = [...WORKS].sort((a, b) => a.year - b.year); const i = list.indexOf(current); openWork(list[(i + d + list.length) % list.length].id); };
  $("#modalPrev").addEventListener("click", () => step(-1));
  $("#modalNext").addEventListener("click", () => step(1));
  document.addEventListener("keydown", e => {
    if (!modal.open) return;
    if (e.target.matches("input")) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // swipe between works on touch
  let sx = null, sy = null;
  modal.addEventListener("touchstart", e => { if (e.target.closest("input, .player, .layers")) { sx = null; return; } sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  modal.addEventListener("touchend", e => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1); sx = null;
  });

  function stopPlayers() { players.forEach(p => p.stop()); players = []; }

  function renderModal(w) {
    stopPlayers();
    $("#modalMeta").textContent = `${w.year} · ${w.cats.map(catName).join(" / ")}`;
    $("#modalTitle").textContent = L(w.title);
    const media = $("#modalMedia"); media.innerHTML = "";
    w.modules.forEach(m => { const el = MODULES[m.type]?.(m, w); if (el) media.appendChild(el); });

    const info = [
      [t("modal.year"), w.year],
      [t("modal.type"), w.cats.map(catName).join(lang === "zh" ? "、" : ", ")],
      [t("modal.tools"), "Aseprite / Photoshop"],
      w.canvas ? [t("modal.canvas"), w.canvas] : null
    ].filter(Boolean);
    $("#modalInfo").innerHTML = `
      <p class="desc">${esc(L(w.desc))}</p>
      <dl class="info-list">${info.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      ${w.fanart ? `<p class="fan-note">${esc(t("footer.fanart"))}</p>` : ""}
      <button class="btn btn-ghost btn-sm" type="button" id="shareBtn">${esc(t("modal.share"))}</button>`;
    $("#shareBtn").addEventListener("click", async () => { if (await copy(location.href.split("#")[0] + "#work/" + w.id)) toast(t("modal.copied")); });
  }

  const h = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };

  const MODULES = {
    image(m, w) {
      const el = h(`<figure class="mod" style="margin:0">
        <div class="frame${m.zoom ? " zoomable" : ""}" style="background:${w.bg}">
          <img class="${m.pixel ? "px" : ""}" src="${m.src}" alt="${esc(L(m.caption) || L(w.title))}" loading="lazy" ${m.pixel ? 'style="image-rendering:pixelated"' : ""}>
        </div>
        ${m.caption || m.zoom ? `<figcaption class="mod-cap">${esc(L(m.caption))}${m.zoom ? ` · ${esc(t("zoom.hint"))}` : ""}</figcaption>` : ""}
      </figure>`);
      if (m.zoom) { const f = $(".frame", el); f.addEventListener("click", () => f.classList.toggle("zoomed")); }
      return el;
    },

    gallery(m) {
      return h(`<div class="mod gallery">${m.items.map(it => `<figure><img src="${it.src}" alt="${esc(L(it.label))}" loading="lazy"><figcaption>${esc(L(it.label))}</figcaption></figure>`).join("")}</div>`);
    },

    player(m, w) {
      const el = h(`<div class="mod player">
        <canvas width="${m.w}" height="${m.h}" role="img" aria-label="${esc(L(m.caption))}"></canvas>
        <div class="scrub"><input type="range" min="1" max="${m.n}" value="1" aria-label="${esc(t("player.frame"))}"><span class="counter">1 / ${m.n}</span></div>
        <div class="controls">
          <button class="ctrl" type="button" data-a="prev" aria-label="${esc(t("player.prev"))}">◀︎</button>
          <button class="ctrl play" type="button" data-a="play">${esc(t("player.pause"))}</button>
          <button class="ctrl" type="button" data-a="next" aria-label="${esc(t("player.next"))}">▶︎</button>
          <button class="ctrl speed" type="button" data-a="speed" aria-label="${esc(t("player.speed"))}">1x</button>
        </div>
        <p class="mod-cap">${esc(L(m.caption))} · ${esc(t("player.hint"))}</p>
      </div>`);
      const cv = $("canvas", el), ctx = cv.getContext("2d"), range = $("input", el), counter = $(".counter", el), playBtn = $(".play", el), speedBtn = $(".speed", el);
      cv.style.background = m.bg || w.bg;
      ctx.imageSmoothingEnabled = false;
      const img = new Image(); img.src = m.sheet;
      const speeds = [1, 2, 0.5]; let si = 0;
      let i = 0, playing = !matchMedia("(prefers-reduced-motion: reduce)").matches, timer = null, ready = false;
      const draw = () => {
        if (!ready) return;
        ctx.clearRect(0, 0, m.w, m.h);
        ctx.drawImage(img, (i % m.cols) * m.w, Math.floor(i / m.cols) * m.h, m.w, m.h, 0, 0, m.w, m.h);
        range.value = i + 1; counter.textContent = `${i + 1} / ${m.n}`;
      };
      const tick = () => { draw(); timer = setTimeout(() => { i = (i + 1) % m.n; tick(); }, (m.durations[i] || 100) / speeds[si]); };
      const play = () => { playing = true; playBtn.textContent = t("player.pause"); clearTimeout(timer); tick(); };
      const pause = () => { playing = false; playBtn.textContent = t("player.play"); clearTimeout(timer); draw(); };
      img.onload = () => { ready = true; playing ? play() : pause(); };
      el.addEventListener("click", e => {
        const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
        if (a === "play") playing ? pause() : play();
        if (a === "prev") { pause(); i = (i - 1 + m.n) % m.n; draw(); }
        if (a === "next") { pause(); i = (i + 1) % m.n; draw(); }
        if (a === "speed") { si = (si + 1) % speeds.length; speedBtn.textContent = speeds[si] + "x"; if (playing) play(); }
      });
      range.addEventListener("input", () => { pause(); i = range.value - 1; draw(); });
      // pause when scrolled out of view
      const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting && playing) { clearTimeout(timer); } else if (e.isIntersecting && playing) { clearTimeout(timer); tick(); } });
      io.observe(cv);
      players.push({ stop() { clearTimeout(timer); io.disconnect(); } });
      return el;
    },

    layers(m, w) {
      const n = m.layers.length;
      const el = h(`<div class="mod layers">
        <p class="hint">${esc(t("layers.hint"))}</p>
        <div class="layer-stage" style="background:${w.bg}20;border-radius:14px">
          <div class="layer-stack">
            ${m.layers.map((ly, k) => `<img src="${ly.src}" alt="${esc(L(ly.label))}" data-k="${k}">`).join("")}
            <img class="final" src="${m.final}" alt="${esc(L(m.finalLabel))}" data-k="${n}">
          </div>
        </div>
        <div class="layer-steps">${[...m.layers.map(l => l.label), m.finalLabel].map((lb, k) => `<button type="button" data-step="${k}">${k + 1}. ${esc(L(lb))}</button>`).join("")}</div>
        <div class="layer-ctrl">
          <input type="range" min="0" max="${n}" value="${n}" aria-label="${esc(t("layers.hint"))}">
          <button class="ctrl explode" type="button">${esc(t("layers.explode"))}</button>
        </div>
      </div>`);
      const stage = $(".layer-stage", el), imgs = $$(".layer-stack img", el), range = $("input", el), btns = $$("[data-step]", el), exBtn = $(".explode", el);
      const set = (v) => {
        v = +v; range.value = v;
        const exploded = stage.classList.contains("exploded");
        imgs.forEach((im, k) => {
          im.style.opacity = k === n ? (v === n && !exploded ? 1 : 0) : (k <= v ? 1 : 0);
          im.style.transform = exploded ? `translateZ(${(k - (n - 1) / 2) * 90}px)` : "none";
        });
        btns.forEach((b, k) => b.classList.toggle("on", k === v));
      };
      range.addEventListener("input", () => set(range.value));
      btns.forEach(b => b.addEventListener("click", () => set(b.dataset.step)));
      exBtn.addEventListener("click", () => {
        const on = stage.classList.toggle("exploded");
        exBtn.textContent = t(on ? "layers.flat" : "layers.explode");
        if (on && +range.value === n) set(n - 1); else set(range.value);
      });
      set(n);
      return el;
    },

    compare(m) {
      return h(`<div class="mod">
        <p class="hint">${esc(t("compare.hint"))}</p>
        <div class="compare">
          <figure><img src="${m.before}" alt="${esc(L(m.beforeLabel))}" loading="lazy"><figcaption>${esc(L(m.beforeLabel))}</figcaption></figure>
          <span class="arrow" aria-hidden="true">→</span>
          <figure><img src="${m.after}" alt="${esc(L(m.afterLabel))}" loading="lazy"><figcaption>${esc(L(m.afterLabel))}</figcaption></figure>
        </div>
      </div>`);
    },

    variants(m) {
      const el = h(`<div class="mod">
        <p class="hint">${esc(t("variants.hint"))}</p>
        <div class="variant-tabs" role="tablist">${m.items.map((it, k) => `<button type="button" role="tab" aria-selected="${k === 0}" data-v="${k}">${esc(L(it.label))}</button>`).join("")}</div>
        <div class="variant-view">${m.items.map((it, k) => `<img src="${it.src}" alt="${esc(L(it.label))}" style="opacity:${k === 0 ? 1 : 0}">`).join("")}</div>
      </div>`);
      const tabs = $$("[data-v]", el), ims = $$(".variant-view img", el);
      tabs.forEach(b => b.addEventListener("click", () => {
        tabs.forEach(x => x.setAttribute("aria-selected", String(x === b)));
        ims.forEach((im, k) => im.style.opacity = k === +b.dataset.v ? 1 : 0);
      }));
      return el;
    },

    cursors() {
      const el = h(`<div class="mod">
        <p class="hint">${esc(t("cursors.hint"))}</p>
        <div class="cursor-grid">${CURSORS.map(c => `<div class="cur" style="cursor:url('${CUR_DIR}${c.file}.png') ${c.hot[0]} ${c.hot[1]}, ${c.css}">
          <img src="${CUR_DIR}${c.file}@1x.png" alt="" width="64" height="64"><span>${esc(L(c))}</span></div>`).join("")}</div>
        <div class="cur-actions"><button class="btn btn-primary btn-sm cur-apply" type="button">${esc(t(cursorOn ? "cursors.remove" : "cursors.apply"))}</button></div>
        <p class="touch-note">${esc(t("cursors.touch"))}</p>
      </div>`);
      $(".cur-apply", el).addEventListener("click", () => { setCursor(!cursorOn); toast(t(cursorOn ? "cursor.on" : "cursor.off")); });
      return el;
    }
  };

  /* ---------- Contact ---------- */
  $("#copyEmail").addEventListener("click", async () => { if (await copy("redgreen1229@gmail.com")) toast(t("contact.copied")); });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  applyLang();
  const openFromHash = () => { const m = location.hash.match(/^#work\/(.+)$/); if (m) openWork(decodeURIComponent(m[1]), false); };
  addEventListener("hashchange", openFromHash);
  openFromHash();
})();
