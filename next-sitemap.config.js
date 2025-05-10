// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dr0p.live',
  generateRobotsTxt: true, // Generates robots.txt as well
  exclude: ["/api/*", "/404", "/500"], // Exclude API routes and error pages
  generateIndexSitemap: false,
}
