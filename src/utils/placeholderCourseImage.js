// Inline SVG placeholder for course thumbnails — avoids 404 on missing images
const PLACEHOLDER_COURSE_IMAGE = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="225" fill="url(#bg)"/>
  <g transform="translate(200,100)" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-30" y="-22" width="60" height="44" rx="4"/>
    <polygon points="-12,-8 18,0 -12,8"/>
  </g>
  <text x="200" y="155" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="12" font-weight="500">No thumbnail</text>
</svg>`)}`;

export default PLACEHOLDER_COURSE_IMAGE;
