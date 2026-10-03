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
  // Your church page's Live tab. Always shows the newest stream.
  facebookLiveUrl: "https://www.facebook.com/profile.php?id=100068459588571",

  // OPTIONAL: paste last Sunday's video link here each week to play it
  // right on the homepage. Leave "" to show just the "Watch" button.
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

  // For songs that aren't on Spotify. In YouTube: open the playlist → Share → Copy.
  // Set each playlist to Public or Unlisted (Private playlists won't play here).
  // Fill in any mix of services for each section, or leave them all blank.
  youtubePlaylists: {
    upcoming:    "",
    rotation:    "",
    toLearn:     "",
    suggestions: ""
  },

  // Apple Music: open the playlist → ... → Share → Copy Link.
  // Subscribers signed in hear full songs; everyone else gets 30-second previews.
  appleMusicPlaylists: {
    upcoming:    "",
    rotation:    "",
    toLearn:     "",
    suggestions: ""
  },

  // YouTube Music: open the playlist → ... → Share → Copy link.
  // Set it to Public or Unlisted. Plays on the site through YouTube's player.
  youtubeMusicPlaylists: {
    upcoming:    "",
    rotation:    "",
    toLearn:     "",
    suggestions: ""
  },

  /* ---------- LEAD SHEETS ---------- */
  // Google Drive folder with all your charts (share it only with your team)
  leadSheetsFolderUrl: "",

  // OPTIONAL: list songs individually so the team can search them.
  // For each: right-click the file in Drive → Share → Copy link.
  // Leave the list empty [] to show just the folder button.
  leadSheets: [
    // { title: "Goodness of God", artist: "Bethel", key: "A", url: "" },
  ],

  /* ---------- PRAYER ---------- */
  // Google Form → Send → link icon → copy the link
  prayerFormUrl: "",
  // The Google Sheet with the form responses (share it only with your team)
  prayerListUrl: "",

  // Team updates shown on the Prayer page. Newest first. Add or delete lines.
  updates: [
    { date: "Oct 4", text: "Example: rehearsal starts at 6:30 this Thursday." }
  ]
};
