const sitemap = require("nextjs-sitemap-generator");
const withPWA = require("next-pwa");

sitemap({
  baseUrl: "https://localpdf.tech",
  pagesDirectory: __dirname + "/pages",
  targetDirectory: "public/",
  ignoreIndexFiles: true,
});

module.exports = withPWA({
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
  },
  pwa: {
    dest: "./public",
  },
});
