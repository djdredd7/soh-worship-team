(function () {
  const C = window.SITE_CONFIG || {};
  const $ = (sel) => document.querySelector(sel);
  const isSet = (v) => typeof v === "string" && v.trim() !== "" && !v.includes("YOUR");

  function setupNote(target, message, key) {
    target.innerHTML = "";
    const box = document.createElement("div");
    box.className = "setup";
    const p = document.createElement("p");
    p.textContent = message;
    const hint = document.createElement("p");
    hint.className = "setup-hint";
    hint.innerHTML = "Add it in <code>config.js</code> → <code></code>";
    hint.querySelector("code:last-child").textContent = key;
    box.append(p, hint);
    target.append(box);
  }

  function frame(src, title, extra = {}) {
    const f = document.createElement("iframe");
    f.src = src;
    f.title = title;
    f.loading = "lazy";
    Object.entries(extra).forEach(([k, v]) => f.setAttribute(k, v));
    return f;
  }

  /* ---------- Shared ---------- */
  document.querySelectorAll("[data-team-name]").forEach((n) => (n.textContent = C.teamName || "Worship Team"));
  const footerChurch = $("#footer-church");
  if (footerChurch) footerChurch.textContent = C.churchName ? "· " + C.churchName : "";
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Home ---------- */
  const dateEl = $("#last-sunday-date");
  if (dateEl) {
    const now = new Date();
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    // On Sunday morning, the service hasn't streamed yet — show the week before
    if (now.getDay() === 0 && now.getHours() < 13) d.setDate(d.getDate() - 7);
    dateEl.textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  const isFbVideo = (u) => isSet(u) && /(\/videos\/|\/watch|video\.php|fb\.watch|\/reel\/|\/live\/\d)/.test(u);
  const fbVideo = isFbVideo(C.facebookVideoUrl) ? C.facebookVideoUrl : "";
  const fbPage = isSet(C.facebookLiveUrl) ? C.facebookLiveUrl : (isSet(C.facebookVideoUrl) && !fbVideo ? C.facebookVideoUrl : "");

  const liveLink = $("#fb-live-link");
  if (liveLink) {
    if (fbVideo) liveLink.href = fbVideo;
    else if (fbPage) liveLink.href = fbPage;
    else liveLink.hidden = true;
  }

  const stream = $("#stream");
  if (stream) {
    if (fbVideo) {
      stream.classList.add("ratio-16x9");
      stream.append(
        frame(
          "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(fbVideo) + "&show_text=false&width=1280",
          "Last Sunday's livestream",
          { allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share", allowfullscreen: "" }
        )
      );
    } else if (fbPage) {
      stream.classList.add("stream-placeholder");
      const p = document.createElement("p");
      p.textContent = "Watch the latest service on our Facebook page.";
      stream.append(p);
    } else {
      setupNote(stream, "No livestream link yet.", "facebookLiveUrl");
    }
  }

  /* ---------- Calendar ---------- */
  const cal = $("#calendar");
  if (cal) {
    const buttons = document.querySelectorAll("[data-cal-mode]");
    const render = (mode) => {
      if (!isSet(C.googleCalendarId)) {
        setupNote(cal, "No calendar connected yet.", "googleCalendarId");
        document.querySelector(".toggle")?.setAttribute("hidden", "");
        return;
      }
      cal.innerHTML = "";
      const params = new URLSearchParams({
        src: C.googleCalendarId,
        ctz: C.timeZone || "America/Chicago",
        mode,
        showTitle: "0", showPrint: "0", showTabs: "0", showCalendars: "0", showTz: "0", wkst: "1"
      });
      cal.append(frame("https://calendar.google.com/calendar/embed?" + params, "Worship team calendar"));
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.calMode === mode)));
    };
    // Agenda reads better on phones
    render(window.matchMedia("(max-width: 640px)").matches ? "AGENDA" : "MONTH");
    buttons.forEach((b) => b.addEventListener("click", () => render(b.dataset.calMode)));
  }

  /* ---------- Music ---------- */
  const SOURCES = [
    {
      config: "playlists", name: "Spotify", cls: "slot-spotify",
      parse: (u) => ((u || "").match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/) || [])[1],
      embed: (id) => "https://open.spotify.com/embed/playlist/" + id + "?utm_source=generator",
      open: (id) => "https://open.spotify.com/playlist/" + id,
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    },
    {
      config: "appleMusicPlaylists", name: "Apple Music", cls: "slot-apple",
      parse: (u) => ((u || "").match(/music\.apple\.com\/([a-z]{2}\/playlist\/[^?#\s"]+)/) || [])[1],
      embed: (path) => "https://embed.music.apple.com/" + path,
      open: (path) => "https://music.apple.com/" + path,
      allow: "autoplay *; encrypted-media *; fullscreen *; clipboard-write"
    },
    {
      config: "youtubePlaylists", name: "YouTube", cls: "slot-youtube",
      parse: (u) => ((u || "").match(/[?&]list=([A-Za-z0-9_-]+)/) || [])[1],
      embed: (id) => "https://www.youtube-nocookie.com/embed/videoseries?list=" + id,
      open: (id) => "https://www.youtube.com/playlist?list=" + id,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    },
    {
      config: "youtubeMusicPlaylists", name: "YouTube Music", cls: "slot-youtube",
      parse: (u) => ((u || "").match(/[?&]list=([A-Za-z0-9_-]+)/) || [])[1],
      embed: (id) => "https://www.youtube-nocookie.com/embed/videoseries?list=" + id,
      open: (id) => "https://music.youtube.com/playlist?list=" + id,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    }
  ];

  // Remember which service each person prefers, and use it in every section
  const PREF_KEY = "music-service";
  let preferred = null;
  try { preferred = localStorage.getItem(PREF_KEY); } catch (e) {}
  const players = [];

  document.querySelectorAll("[data-section]").forEach((box) => {
    const key = box.dataset.section;
    const links = document.querySelector('[data-links="' + key + '"]');
    const found = SOURCES
      .map((src) => ({ src, id: src.parse((C[src.config] || {})[key]) }))
      .filter((x) => x.id);

    if (!found.length) {
      setupNote(box, "No playlist linked yet.", "playlists." + key + " (or another music service)");
      return;
    }

    // One "Open in ..." link that follows whichever service is showing.
    // Uses the exact link you pasted, so things like Apple Music join links keep working.
    const openLink = document.createElement("a");
    openLink.className = "text-link";
    openLink.target = "_blank";
    openLink.rel = "noopener";
    links.append(openLink);
    const setLink = (pick) => {
      const raw = ((C[pick.src.config] || {})[key] || "").trim();
      openLink.href = /^https:\/\//.test(raw) ? raw : pick.src.open(pick.id);
      openLink.textContent = (key === "suggestions" ? "Add a song in " : "Open in ") + pick.src.name;
    };

    // Service tabs (only when there's more than one)
    let tabs = null;
    if (found.length > 1) {
      tabs = document.createElement("div");
      tabs.className = "service-tabs";
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "Choose a music service");
      box.append(tabs);
    }
    const stage = document.createElement("div");
    stage.className = "player-stage";
    box.append(stage);

    const slots = {};
    const show = (name) => {
      const pick = found.find((f) => f.src.name === name) || found[0];
      if (!slots[pick.src.name]) {
        const slot = document.createElement("div");
        slot.className = "slot " + pick.src.cls;
        slot.append(frame(pick.src.embed(pick.id), pick.src.name + " playlist", { allow: pick.src.allow, allowfullscreen: "" }));
        stage.append(slot);
        slots[pick.src.name] = slot;
      }
      Object.entries(slots).forEach(([n, el]) => (el.hidden = n !== pick.src.name));
      setLink(pick);
      if (tabs) tabs.querySelectorAll("button").forEach((btn) => btn.setAttribute("aria-selected", String(btn.dataset.service === pick.src.name)));
    };

    if (tabs) {
      found.forEach(({ src }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "tab");
        btn.dataset.service = src.name;
        btn.textContent = src.name;
        btn.addEventListener("click", () => {
          try { localStorage.setItem(PREF_KEY, src.name); } catch (e) {}
          players.forEach((p) => p(src.name)); // switch every section that has this service
        });
        tabs.append(btn);
      });
    }

    players.push((name) => { if (found.some((f) => f.src.name === name)) show(name); });
    show(preferred);
  });

  /* ---------- Lead sheets ---------- */
  const sheets = $("#sheets");
  if (sheets) {
    const folder = $("#sheets-folder-link");
    if (isSet(C.leadSheetsFolderUrl)) folder.href = C.leadSheetsFolderUrl;
    else folder.hidden = true;

    const songs = (Array.isArray(C.leadSheets) ? C.leadSheets : [])
      .filter((s) => s && s.title)
      .sort((a, b) => a.title.localeCompare(b.title));

    if (!songs.length) {
      $(".search").hidden = true;
      if (!isSet(C.leadSheetsFolderUrl)) {
        const box = document.createElement("li");
        sheets.append(box);
        setupNote(box, "No lead sheets linked yet.", "leadSheetsFolderUrl");
      }
    } else {
      songs.forEach((song) => {
        const li = document.createElement("li");
        li.dataset.search = (song.title + " " + (song.artist || "")).toLowerCase();
        const a = document.createElement(isSet(song.url) ? "a" : "div");
        a.className = "sheet";
        if (isSet(song.url)) { a.href = song.url; a.target = "_blank"; a.rel = "noopener"; }
        const name = document.createElement("span");
        name.className = "sheet-title";
        name.textContent = song.title;
        const artist = document.createElement("span");
        artist.className = "sheet-artist";
        artist.textContent = song.artist || "";
        const key = document.createElement("span");
        key.className = "sheet-key";
        key.textContent = song.key ? "Key of " + song.key : "";
        a.append(name, artist, key);
        li.append(a);
        sheets.append(li);
      });

      const empty = $("#sheets-empty");
      $("#sheet-search").addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        let shown = 0;
        sheets.querySelectorAll("li").forEach((li) => {
          const match = li.dataset.search.includes(q);
          li.hidden = !match;
          if (match) shown++;
        });
        empty.hidden = shown > 0;
      });
    }
  }

  /* ---------- Prayer ---------- */
  const form = $("#prayer-form");
  if (form) {
    if (isSet(C.prayerFormUrl)) {
      let src = C.prayerFormUrl;
      if (src.includes("docs.google.com/forms") && !src.includes("embedded=true")) {
        src += (src.includes("?") ? "&" : "?") + "embedded=true";
      }
      form.append(frame(src, "Prayer request form"));
    } else {
      setupNote(form, "No prayer form linked yet.", "prayerFormUrl");
    }
  }

  const listLink = $("#prayer-list-link");
  if (listLink) {
    if (isSet(C.prayerListUrl)) listLink.href = C.prayerListUrl;
    else listLink.closest(".prayer-list")?.setAttribute("hidden", "");
  }

  const updates = $("#updates");
  if (updates) {
    const items = Array.isArray(C.updates) ? C.updates : [];
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "No updates right now.";
      updates.replaceWith(p);
    } else {
      items.forEach((u) => {
        const li = document.createElement("li");
        const when = document.createElement("span");
        when.className = "update-date";
        when.textContent = u.date || "";
        const what = document.createElement("span");
        what.textContent = u.text || "";
        li.append(when, what);
        updates.append(li);
      });
    }
  }
})();
