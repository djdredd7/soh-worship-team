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
  if (footerChurch) footerChurch.textContent = C.churchName || "";
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

  const liveLink = $("#fb-live-link");
  if (liveLink) {
    if (isSet(C.facebookVideoUrl)) liveLink.href = C.facebookVideoUrl;
    else if (isSet(C.facebookLiveUrl)) liveLink.href = C.facebookLiveUrl;
    else liveLink.hidden = true;
  }

  const stream = $("#stream");
  if (stream) {
    if (isSet(C.facebookVideoUrl)) {
      stream.classList.add("ratio-16x9");
      stream.append(
        frame(
          "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(C.facebookVideoUrl) + "&show_text=false&width=1280",
          "Last Sunday's livestream",
          { allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share", allowfullscreen: "" }
        )
      );
    } else if (isSet(C.facebookLiveUrl)) {
      stream.classList.add("stream-placeholder");
      const p = document.createElement("p");
      p.textContent = "The newest service is always first on our Facebook Live page.";
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
  const spotifyId = (url) => ((url || "").match(/playlist[/:]([A-Za-z0-9]+)/) || [])[1];
  const youtubeId = (url) => ((url || "").match(/[?&]list=([A-Za-z0-9_-]+)/) || [])[1];

  document.querySelectorAll("[data-section]").forEach((box) => {
    const key = box.dataset.section;
    const sp = spotifyId((C.playlists || {})[key]);
    const yt = youtubeId((C.youtubePlaylists || {})[key]);
    const both = sp && yt;

    if (!sp && !yt) {
      setupNote(box, "No playlist linked yet.", "playlists." + key + " or youtubePlaylists." + key);
      return;
    }

    const addSource = (label, className, src, title, allow, href, linkText) => {
      const wrap = document.createElement("div");
      wrap.className = "source";
      if (both) {
        const h = document.createElement("h3");
        h.className = "source-label";
        h.textContent = label;
        wrap.append(h);
      }
      const slot = document.createElement("div");
      slot.className = "slot " + className;
      slot.append(frame(src, title, { allow, allowfullscreen: "" }));
      const a = document.createElement("a");
      a.className = "text-link";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = linkText;
      wrap.append(slot, a);
      box.append(wrap);
    };

    if (sp) {
      addSource(
        "On Spotify", "slot-spotify",
        "https://open.spotify.com/embed/playlist/" + sp + "?utm_source=generator",
        "Spotify playlist",
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
        "https://open.spotify.com/playlist/" + sp,
        key === "suggestions" ? "Add a song in Spotify" : "Open in Spotify"
      );
    }
    if (yt) {
      addSource(
        both ? "Only on YouTube" : "On YouTube", "slot-youtube",
        "https://www.youtube-nocookie.com/embed/videoseries?list=" + yt,
        "YouTube playlist",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        "https://www.youtube.com/playlist?list=" + yt,
        key === "suggestions" ? "Add a video on YouTube" : "Open in YouTube"
      );
    }
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
