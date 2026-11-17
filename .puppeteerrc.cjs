const path = require("path");

// Keep Chrome inside the deployed project. Render's build and runtime can use
// different home/cache directories; Puppeteer's default user cache can then
// make a successfully downloaded browser appear missing at runtime.
module.exports = {
  cacheDirectory: path.join(__dirname, ".cache", "puppeteer"),
};
