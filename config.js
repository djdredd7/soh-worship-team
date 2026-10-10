/* =========================================================
   SITE SETTINGS — this is the only file you need to edit.
   Paste your links between the quotes. Anything left blank
   shows a setup note on the site instead of breaking it.
   ========================================================= */

window.SITE_CONFIG = {
  teamName: "SoH Worship Team",
  churchName: "Star of Hope Full Gospel Church",                 // e.g. "Grace Community Church" (shows in the footer)
  timeZone: "America/Chicago",

  /* ---------- HOME ---------- */
  // YouTube channel ID (starts with "UC"). The homepage automatically plays
  // the channel's most recent live stream — nothing to update each week.
  youtubeChannelId: "",

  // OPTIONAL: paste one specific YouTube video link here to show it instead
  // of the automatic latest stream. Leave "" to stay automatic.
  youtubeVideoUrl: "",

  // Set to true if the services are uploaded as regular videos instead of
  // streamed live, so the homepage shows the newest upload.
  youtubeIncludeAllUploads: false,

  // The church's Facebook page. Shows as a scrolling feed of the page's
  // latest posts on the homepage. Also used as the "Watch" button if the
  // YouTube settings above are ever blank.
  showFacebookFeed: true,
  facebookLiveUrl: "https://www.facebook.com/profile.php?id=100068459588571",
  facebookVideoUrl: "",

  /* ---------- CALENDAR ---------- */
  // Google Calendar → Settings → (your calendar) → Integrate calendar → Calendar ID
  // Looks like: abc123xyz@group.calendar.google.com
  googleCalendarId: "0746fbfd571fd1ddadb1be226e021d1511abb9b4c19f6e792b2c8bb560794bd1@group.calendar.google.com",

  /* ---------- MUSIC ---------- */
  // In Spotify: ... on the playlist → Share → Copy link to playlist
  playlists: {
    upcoming:    "https://open.spotify.com/playlist/3vZgHuYGXv5XNKq4UWv1Hq?si=4a90d9737dca46f6&pt=4e1ba7a4dc342a0b178f0eb952bf4ecb",
    rotation:    "https://open.spotify.com/playlist/3FVaZ03hpROecWMZgwtIur?si=0ed3d453f6f64e24&pt=9be2e322a8e8ac384b22d4144481ab98",
    toLearn:     "https://open.spotify.com/playlist/1o5mnX4EyNxuSnTzF7xj4g?si=3f6ac44562fb44a3&pt=049f1fd49dd1c586389c8c8a6647e54c",
    suggestions: "https://open.spotify.com/playlist/0i35cEV7T8EABAdUo6YRZh?si=n2RJLErwSO2q_1vRlkCzGQ"   // make this one Collaborative so the team can add songs
  },

  // Apple Music: open the playlist → ... → Share → Copy Link.
  // Subscribers signed in hear full songs; everyone else gets 30-second previews.
  appleMusicPlaylists: {
    upcoming:    "https://music.apple.com/us/playlist/upcoming-songs/pl.u-XkD03jJf409orr",
    rotation:    "https://music.apple.com/us/playlist/songs-in-rotation/pl.u-yZyVDJ3Iz4GDll",
    toLearn:     "https://music.apple.com/us/playlist/songs-to-learn/pl.u-06ox7raCXx02MM",
    suggestions: "https://music.apple.com/us/playlist/pl.u-zPyLAB5CMo7EWW?a=join&it=ZN48bxacgY3ozzHX7Drg"
  },

  // YouTube Music: open the playlist → ... → Share → Copy link.
  // Set it to Public or Unlisted. Plays on the site through YouTube's player.
  youtubeMusicPlaylists: {
    upcoming:    "https://music.youtube.com/playlist?list=PLfxctBwfS8GI&si=pXSZb3iFMeFvoDnw",
    rotation:    "https://music.youtube.com/playlist?list=PLAxIwGxxPVsA&si=DheE2C-Ei98yxqau",
    toLearn:     "https://music.youtube.com/playlist?list=PLRXm8yHO2fjk&si=StamrJQfXHAYUy_Y",
    suggestions: "https://music.youtube.com/playlist?list=PLUuMneJz_hVA&si=WSoSENBaWomrQc3G"
  },

  /* ---------- LEAD SHEETS ---------- */
  // Google Drive folder with all your charts (share it only with your team)
  leadSheetsFolderUrl: "https://drive.google.com/drive/folders/1bZXg_aPkruEPoA69eE2Q6_K2-Bas8pKS?usp=share_link",

  // OPTIONAL: list songs individually so the team can search them.
  // For each: right-click the file in Drive → Share → Copy link.
  // Leave the list empty [] to show just the folder button.
  leadSheets: [
    // { title: "Goodness of God", artist: "Bethel", key: "A", url: "" },
  ],

  /* ---------- PRAYER ---------- */
  // Google Form → Send → link icon → copy the link
  prayerFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdTz_K7PmH9IwbcNJ5BW90xs26GFrj_SZ44SClmvV-bkZrF9w/viewform?usp=sharing&ouid=110526409547886659824",
  // The Google Sheet with the form responses (share it only with your team)
  prayerListUrl: "",

  // Team updates shown on the Prayer page. Newest first. Add or delete lines.
  updates: [
    { date: "Nov 7", text: "Min. Dee has to work in the morning. Might be late or absent from rehearsal." },
    { date: "Nov 14-15", text: "Min. Dee has to work both days and will not be in attendance for rehearsal or service."}
  ]
};
