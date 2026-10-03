/* =========================================================
   SITE SETTINGS — this is the only file you need to edit.
   Paste your links between the quotes. Anything left blank
   shows a setup note on the site instead of breaking it.
   ========================================================= */

window.SITE_CONFIG = {
  teamName: "SoH Worship Team",
  churchName: "",                 // e.g. "Grace Community Church" (shows in the footer)
  timeZone: "America/Chicago",

  /* ---------- HOME ---------- */
  // Your church page's Live tab. Always shows the newest stream.
  facebookLiveUrl: "https://www.facebook.com/YOURCHURCHPAGE/live",

  // OPTIONAL: paste last Sunday's video link here each week to play it
  // right on the homepage. Leave "" to show just the "Watch" button.
  facebookVideoUrl: "",

  /* ---------- CALENDAR ---------- */
  // Google Calendar → Settings → (your calendar) → Integrate calendar → Calendar ID
  // Looks like: abc123xyz@group.calendar.google.com
  googleCalendarId: "",

  /* ---------- MUSIC ---------- */
  // In Spotify: ... on the playlist → Share → Copy link to playlist
  playlists: {
    upcoming:    "",
    rotation:    "",
    toLearn:     "",
    suggestions: ""   // make this one Collaborative so the team can add songs
  },

  // For songs that aren't on Spotify. In YouTube: open the playlist → Share → Copy.
  // Set each playlist to Public or Unlisted (Private playlists won't play here).
  // Fill in either one, both, or neither for each section.
  youtubePlaylists: {
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
