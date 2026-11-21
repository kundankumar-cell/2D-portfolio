import { drawQRCode } from './qrCode';

/**
 * Ultra-High-Definition Canvas Texture Generator for Kundan Kumar's Developer ID Card.
 * Matches 3D card aspect ratio (1.6 : 2.25) at 1024 x 1440 (retina scaled to 2048 x 2880)
 * ensuring 1:1 pixel mapping with zero stretching, zero cropping, and razor-sharp text.
 */

const WIDTH = 1024;
const HEIGHT = 1440;

// Helper: rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: draw metallic card background & borders
function drawCardBackground(ctx) {
  // Deep Navy luxury gradient
  const bgGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.35, 120, WIDTH / 2, HEIGHT / 2, 900);
  bgGrad.addColorStop(0, '#0f1f3a');
  bgGrad.addColorStop(0.55, '#0a1426');
  bgGrad.addColorStop(1, '#050a14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle security guilloche / micro-grid pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
  ctx.lineWidth = 1;
  const step = 36;
  for (let x = 0; x < WIDTH; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  // Premium outer gold border
  ctx.save();
  roundRect(ctx, 32, 32, WIDTH - 64, HEIGHT - 64, 44);
  ctx.lineWidth = 3.5;
  const goldGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  goldGrad.addColorStop(0, '#f3e5ab');
  goldGrad.addColorStop(0.3, '#d4af37');
  goldGrad.addColorStop(0.7, '#c5a059');
  goldGrad.addColorStop(1, '#e5b869');
  ctx.strokeStyle = goldGrad;
  ctx.stroke();

  // Inner subtle micro-line
  roundRect(ctx, 42, 42, WIDTH - 84, HEIGHT - 84, 36);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
  ctx.stroke();

  // Corner ornamental brackets
  const cornerLen = 34;
  const corners = [
    [54, 54, 1, 1],
    [WIDTH - 54, 54, -1, 1],
    [54, HEIGHT - 54, 1, -1],
    [WIDTH - 54, HEIGHT - 54, -1, -1]
  ];
  ctx.strokeStyle = '#e5b869';
  ctx.lineWidth = 2.5;
  corners.forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * cornerLen);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + sx * cornerLen, cy);
    ctx.stroke();
  });
  ctx.restore();

  // Physical slot guide marker (below lanyard hole)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(140, 130);
  ctx.lineTo(WIDTH - 140, 130);
  const slotLineGrad = ctx.createLinearGradient(140, 0, WIDTH - 140, 0);
  slotLineGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  slotLineGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.45)');
  slotLineGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = slotLineGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw decorative emblem (diamond tech star & rings)
 */
function drawEmblem(ctx, cx, cy) {
  ctx.save();
  // Outer gold ring
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Dashed accent ring
  ctx.save();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = 'rgba(243, 229, 171, 0.6)';
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Central 4-point diamond star
  ctx.fillStyle = '#e5b869';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx + 4, cy - 4);
  ctx.lineTo(cx + 12, cy);
  ctx.lineTo(cx + 4, cy + 4);
  ctx.lineTo(cx, cy + 12);
  ctx.lineTo(cx - 4, cy + 4);
  ctx.lineTo(cx - 12, cy);
  ctx.lineTo(cx - 4, cy - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Generate FRONT SIDE texture
 */
export function generateFrontCanvas(profileImage, cardData = {}) {
  const name = cardData.name || 'KUNDAN KUMAR A';
  const title = cardData.title || 'AI/ML & FULL STACK DEVELOPER';
  const departmentLine1 = cardData.departmentLine1 || 'COMPUTER SCIENCE AND';
  const departmentLine2 = cardData.departmentLine2 || 'INFORMATION TECHNOLOGY';
  const signatureName = cardData.signatureName || 'Kundan Kumar';

  const canvas = document.createElement('canvas');
  // 2x Retina resolution: 2048 x 2880 for razor-sharp text and graphics
  canvas.width = WIDTH * 2;
  canvas.height = HEIGHT * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Background & borders
  drawCardBackground(ctx);

  // 2. Top Header (y = 155 to 235)
  drawEmblem(ctx, WIDTH / 2, 166);

  ctx.textAlign = 'center';
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#e5b869';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText('DEVELOPER IDENTITY', WIDTH / 2, 202);

  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText('OFFICIAL CREDENTIAL • SECURE ID', WIDTH / 2, 222);

  // Divider with center diamond
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(180, 236);
  ctx.lineTo(WIDTH - 180, 236);
  const divGrad = ctx.createLinearGradient(180, 0, WIDTH - 180, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.55)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Diamond node at center of divider
  ctx.fillStyle = '#e5b869';
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 232);
  ctx.lineTo(WIDTH / 2 + 5, 236);
  ctx.lineTo(WIDTH / 2, 240);
  ctx.lineTo(WIDTH / 2 - 5, 236);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Profile Photograph Frame (y = 254 to 670)
  const frameW = 340;
  const frameH = 416;
  const frameX = (WIDTH - frameW) / 2;
  const frameY = 254;
  const frameR = 20;

  // Frame outer drop shadow / glow
  ctx.save();
  ctx.shadowColor = 'rgba(212, 175, 55, 0.28)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, frameX, frameY, frameW, frameH, frameR);
  ctx.fillStyle = '#0a1426';
  ctx.fill();
  ctx.restore();

  // Frame background
  roundRect(ctx, frameX, frameY, frameW, frameH, frameR);
  ctx.fillStyle = '#0a1426';
  ctx.fill();

  // Draw image clipped inside frame (object-fit: cover, maintaining natural proportions)
  if (profileImage && profileImage.complete && profileImage.naturalWidth > 0) {
    ctx.save();
    roundRect(ctx, frameX + 4, frameY + 4, frameW - 8, frameH - 8, frameR - 4);
    ctx.clip();

    const nw = profileImage.naturalWidth;
    const nh = profileImage.naturalHeight;
    const targetW = frameW - 8;
    const targetH = frameH - 8;
    const targetAspect = targetW / targetH;
    const naturalAspect = nw / nh;

    let sx = 0, sy = 0, sw = nw, sh = nh;
    if (naturalAspect > targetAspect) {
      sw = nh * targetAspect;
      sx = (nw - sw) / 2;
    } else {
      sh = nw / targetAspect;
      sy = (nh - sh) / 2;
    }

    ctx.drawImage(profileImage, sx, sy, sw, sh, frameX + 4, frameY + 4, targetW, targetH);
    ctx.restore();
  } else {
    // Silhouette placeholder if image not loaded
    ctx.save();
    roundRect(ctx, frameX + 4, frameY + 4, frameW - 8, frameH - 8, frameR - 4);
    ctx.clip();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(frameX, frameY, frameW, frameH);
    ctx.fillStyle = '#e5b869';
    ctx.font = '700 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KK', WIDTH / 2, frameY + frameH / 2 + 20);
    ctx.restore();
  }

  // Double metallic gold border around photo
  ctx.save();
  roundRect(ctx, frameX, frameY, frameW, frameH, frameR);
  const photoBorderGrad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
  photoBorderGrad.addColorStop(0, '#f3e5ab');
  photoBorderGrad.addColorStop(0.5, '#d4af37');
  photoBorderGrad.addColorStop(1, '#c5a059');
  ctx.strokeStyle = photoBorderGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Inner inset border line
  roundRect(ctx, frameX + 6, frameY + 6, frameW - 12, frameH - 12, frameR - 4);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Hologram Verification Seal on photo bottom-right corner
  const sealX = frameX + frameW - 28;
  const sealY = frameY + frameH - 28;
  const sealR = 34;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  const sealGrad = ctx.createRadialGradient(sealX - 8, sealY - 8, 4, sealX, sealY, sealR);
  sealGrad.addColorStop(0, '#fef08a');
  sealGrad.addColorStop(0.5, '#eab308');
  sealGrad.addColorStop(1, '#a16207');
  ctx.fillStyle = sealGrad;
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Seal Checkmark icon
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(sealX - 10, sealY);
  ctx.lineTo(sealX - 4, sealY + 7);
  ctx.lineTo(sealX + 11, sealY - 7);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#0f172a';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.font = '800 8.5px sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText('VERIFIED', sealX, sealY + 19);
  ctx.restore();

  // 4. Name and Professional Title (y = 700 to 770)
  ctx.textAlign = 'center';

  // Primary Name - Razor-sharp, bold, centered
  ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText(name, WIDTH / 2, 715);

  // Professional Title - AI/ML & FULL STACK DEVELOPER
  ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fde047';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
  ctx.fillText(title, WIDTH / 2, 750);

  // Decorative Title Underline
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 160, 768);
  ctx.lineTo(WIDTH / 2 + 160, 768);
  const titleLineGrad = ctx.createLinearGradient(WIDTH / 2 - 160, 0, WIDTH / 2 + 160, 0);
  titleLineGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  titleLineGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.7)');
  titleLineGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = titleLineGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#e5b869';
  ctx.beginPath();
  ctx.arc(WIDTH / 2, 768, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Department Information Cardlet (y = 788 to 956)
  // Institution name IPS Academy, Indore completely removed
  const eduX = 96;
  const eduY = 788;
  const eduW = WIDTH - 192;
  const eduH = 168;
  const eduR = 18;

  ctx.save();
  roundRect(ctx, eduX, eduY, eduW, eduH, eduR);
  ctx.fillStyle = 'rgba(15, 27, 49, 0.82)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Accent edge bar on left
  ctx.beginPath();
  ctx.moveTo(eduX + 4, eduY + 20);
  ctx.lineTo(eduX + 4, eduY + eduH - 20);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Department Header Label
  ctx.textAlign = 'left';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c5a059';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('DEPARTMENT', eduX + 32, eduY + 36);

  // Department Full Name displayed prominently across two clean, well-spaced lines
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
  ctx.fillText(departmentLine1, eduX + 32, eduY + 68);
  ctx.fillText(departmentLine2, eduX + 32, eduY + 102);

  // Subtle separator line
  ctx.beginPath();
  ctx.moveTo(eduX + 32, eduY + 120);
  ctx.lineTo(eduX + eduW - 32, eduY + 120);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Specialization tagline
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.4px';
  ctx.fillText('ENGINEERING DIVISION • SPECIALIZATION IN AI/ML & SYSTEMS', eduX + 32, eduY + 144);

  // 6. Realistic Handwritten Digital Signature Area (y = 976 to 1144)
  const sigX = 96;
  const sigY = 976;
  const sigW = WIDTH - 192;
  const sigH = 168;
  const sigR = 18;

  ctx.save();
  roundRect(ctx, sigX, sigY, sigW, sigH, sigR);
  ctx.fillStyle = 'rgba(10, 19, 36, 0.76)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.32)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Signature ink metallic gradient
  const inkGrad = ctx.createLinearGradient(WIDTH / 2 - 160, sigY + 20, WIDTH / 2 + 160, sigY + 90);
  inkGrad.addColorStop(0, '#fef9c3');
  inkGrad.addColorStop(0.35, '#fde047');
  inkGrad.addColorStop(0.7, '#eab308');
  inkGrad.addColorStop(1, '#ca8a04');

  // Realistic natural handwriting with cursive flowing strokes and slight natural slant
  ctx.save();
  ctx.translate(WIDTH / 2, sigY + 58);
  ctx.rotate(-0.035);

  ctx.textAlign = 'center';
  ctx.font = 'italic 700 52px "Segoe Script", "Brush Script MT", "Caveat", "Dancing Script", cursive';
  ctx.fillStyle = inkGrad;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  ctx.fillText(signatureName, 0, 0);

  // Fluid calligraphic underline flourish loop
  ctx.beginPath();
  ctx.moveTo(-160, 12);
  ctx.bezierCurveTo(-110, 26, -50, 28, 10, 24);
  ctx.bezierCurveTo(75, 20, 140, 12, 178, 6);
  ctx.bezierCurveTo(188, 3, 194, 9, 184, 15);
  ctx.bezierCurveTo(152, 26, 75, 30, -20, 28);
  ctx.strokeStyle = inkGrad;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Digital Signature label
  ctx.textAlign = 'center';
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText('DIGITAL SIGNATURE', WIDTH / 2, sigY + 118);

  // Security Auth hash
  ctx.font = '700 12px monospace';
  ctx.fillStyle = '#e5b869';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('KEY-ID: 2505-KK26-CSE • AUTHENTICATED SIGNATURE', WIDTH / 2, sigY + 144);
  ctx.restore();

  // 7. Security Micro-Bar Footer (y = 1350 to 1400)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText('• SECURE DEVELOPER CREDENTIAL • SYSTEM ID: #8841-KUNDAN •', WIDTH / 2, 1364);

  // Micro barcode simulation
  ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
  const barStart = WIDTH / 2 - 140;
  for (let bx = 0; bx < 280; bx += 7) {
    const barW = (bx % 3 === 0) ? 3 : ((bx % 2 === 0) ? 1.5 : 2.5);
    ctx.fillRect(barStart + bx, 1378, barW, 14);
  }
  ctx.restore();

  return canvas;
}

/**
 * Generate BACK SIDE texture
 */
export function generateBackCanvas(cardData = {}) {
  const email = cardData.email || 'kundanpatel25052003@gmail.com';
  const portfolioUrl = cardData.portfolioUrl || 'https://kundan-portfolio-khaki.vercel.app/';

  const canvas = document.createElement('canvas');
  // 2x Retina resolution matching front side (2048 x 2880)
  canvas.width = WIDTH * 2;
  canvas.height = HEIGHT * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Background & borders
  drawCardBackground(ctx);

  // 2. Header: TECHNICAL PROFILE (y = 155 to 220)
  ctx.textAlign = 'center';
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fef08a';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText('TECHNICAL PROFILE', WIDTH / 2, 176);

  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
  ctx.fillText('CORE COMPETENCIES & CONNECTIVITY', WIDTH / 2, 200);

  // Divider with center diamond
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(160, 214);
  ctx.lineTo(WIDTH - 160, 214);
  const divGrad = ctx.createLinearGradient(160, 0, WIDTH - 160, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.65)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#e5b869';
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 210);
  ctx.lineTo(WIDTH / 2 + 5, 214);
  ctx.lineTo(WIDTH / 2, 218);
  ctx.lineTo(WIDTH / 2 - 5, 214);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Technical Skills (8 skills in a clean 2-column x 4-row grid)
  // Required: Java, Python, React.js, Node.js, MongoDB, SQL, Machine Learning, NLP
  const skills = [
    { name: 'Java', tag: 'BACKEND', iconColor: '#f97316' },
    { name: 'Python', tag: 'AI & ML', iconColor: '#38bdf8' },
    { name: 'React.js', tag: 'FRONTEND', iconColor: '#67e8f9' },
    { name: 'Node.js', tag: 'RUNTIME', iconColor: '#4ade80' },
    { name: 'MongoDB', tag: 'DATABASE', iconColor: '#34d399' },
    { name: 'SQL', tag: 'RELATIONAL', iconColor: '#f59e0b' },
    { name: 'Machine Learning', tag: 'INTELLIGENCE', iconColor: '#c084fc' },
    { name: 'NLP', tag: 'LANGUAGE', iconColor: '#f472b6' }
  ];

  const gridStartX = 90;
  const gridStartY = 230;
  const colW = 407;
  const colH = 56;
  const gapX = 30;
  const gapY = 10;

  skills.forEach((skill, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = gridStartX + col * (colW + gapX);
    const sy = gridStartY + row * (colH + gapY);

    ctx.save();
    // High-contrast chip background
    roundRect(ctx, sx, sy, colW, colH, 14);
    ctx.fillStyle = 'rgba(18, 32, 58, 0.94)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Accent indicator dot on left
    ctx.beginPath();
    ctx.arc(sx + 24, sy + colH / 2, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = skill.iconColor || '#e5b869';
    ctx.fill();

    // Glowing halo around dot
    ctx.beginPath();
    ctx.arc(sx + 24, sy + colH / 2, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Skill Name - bold, high-contrast white
    ctx.textAlign = 'left';
    ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
    ctx.fillText(skill.name, sx + 42, sy + colH / 2 + 7);

    // Tag Pill on right - vibrant gold
    ctx.textAlign = 'right';
    ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#fde047';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
    ctx.fillText(skill.tag, sx + colW - 18, sy + colH / 2 + 4);
    ctx.restore();
  });

  // 4. Contact Information Cardlet (y = 506 to 712)
  const contactX = 90;
  const contactY = 506;
  const contactW = WIDTH - 180;
  const contactH = 206;
  const contactR = 18;

  ctx.save();
  roundRect(ctx, contactX, contactY, contactW, contactH, contactR);
  ctx.fillStyle = 'rgba(18, 32, 58, 0.94)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left golden accent bar
  ctx.beginPath();
  ctx.moveTo(contactX + 4, contactY + 20);
  ctx.lineTo(contactX + 4, contactY + contactH - 20);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Contact Header
  ctx.textAlign = 'left';
  ctx.font = '900 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fde047';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText('CONTACT INFORMATION', contactX + 28, contactY + 34);

  // Email row - clear and large
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c5a059';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('PRIMARY EMAIL', contactX + 28, contactY + 62);

  ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
  ctx.fillText(email, contactX + 28, contactY + 92);

  // Inner Divider
  ctx.beginPath();
  ctx.moveTo(contactX + 28, contactY + 110);
  ctx.lineTo(contactX + contactW - 28, contactY + 110);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Portfolio URL row
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c5a059';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('LIVE PORTFOLIO', contactX + 28, contactY + 136);

  ctx.font = '800 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#93c5fd';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
  ctx.fillText(portfolioUrl, contactX + 28, contactY + 164);

  // Availability badge
  ctx.save();
  ctx.beginPath();
  ctx.arc(contactX + 34, contactY + 190, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#4ade80';
  ctx.fill();

  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#86efac';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('STATUS: OPEN TO AI & FULL STACK OPPORTUNITIES', contactX + 48, contactY + 194);
  ctx.restore();

  // 5. QR Code Section (y = 735 to 1100)
  // QR placed in the lower-right area with clean white card background
  const qrBoxSize = 280;
  const qrX = WIDTH - 90 - qrBoxSize;
  const qrY = 735;

  // Draw real scannable QR code directly to canvas context
  drawQRCode(ctx, 'https://kundan-portfolio-khaki.vercel.app/', qrX, qrY, qrBoxSize, 20);

  // Left side of QR Code: Prompts and Info
  const qrInfoX = 90;
  const qrInfoW = qrX - qrInfoX - 35;
  const qrInfoY = 745;

  ctx.textAlign = 'left';

  // Heading - Large, bold, sharp
  ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('SCAN TO VISIT', qrInfoX, qrInfoY + 28);

  ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fde047';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
  ctx.fillText('MY PORTFOLIO', qrInfoX, qrInfoY + 70);

  // Explanatory Paragraph - Crisp, readable
  ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#f8fafc';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0.3px';
  ctx.fillText('Point your smartphone camera to launch', qrInfoX, qrInfoY + 114);
  ctx.fillText('my live portfolio, explore interactive', qrInfoX, qrInfoY + 140);
  ctx.fillText('projects, story timeline, and connect.', qrInfoX, qrInfoY + 166);

  // Highlighted callout label as explicitly requested: "SCAN TO VISIT MY PORTFOLIO"
  ctx.save();
  const promptBadgeY = qrInfoY + 218;
  roundRect(ctx, qrInfoX, promptBadgeY - 24, qrInfoW, 46, 12);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.16)';
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.font = '900 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fef08a';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('✦ SCAN TO VISIT MY PORTFOLIO ✦', qrInfoX + 16, promptBadgeY + 4);
  ctx.restore();

  // QR Label beneath the QR code card - Clear and bold
  ctx.textAlign = 'center';
  ctx.font = '900 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fde047';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('CAMERA SCANNABLE QR', qrX + qrBoxSize / 2, qrY + qrBoxSize + 26);

  // 6. Security Footer
  ctx.textAlign = 'center';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
  ctx.fillText('• VERIFIED DEVELOPER PROFILE • ISO/IEC 18004 STANDARD QR • 2026 •', WIDTH / 2, 1380);

  return canvas;
}

/**
 * Loads the user profile image from path and returns both Front & Back card data URLs.
 */
export function generateCardTextures(imagePath = '/images/Screenshot 2026-08-12 004208.png', cardData = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const onComplete = (loadedImg) => {
      try {
        const frontCanvas = generateFrontCanvas(loadedImg, cardData);
        const backCanvas = generateBackCanvas(cardData);
        resolve({
          front: frontCanvas.toDataURL('image/png'),
          back: backCanvas.toDataURL('image/png')
        });
      } catch (err) {
        console.error('Error generating card textures:', err);
        const frontCanvas = generateFrontCanvas(null, cardData);
        const backCanvas = generateBackCanvas(cardData);
        resolve({
          front: frontCanvas.toDataURL('image/png'),
          back: backCanvas.toDataURL('image/png')
        });
      }
    };

    img.onload = () => onComplete(img);
    img.onerror = () => {
      const encoded = encodeURI(imagePath);
      if (imagePath !== encoded) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = () => onComplete(fallbackImg);
        fallbackImg.onerror = () => {
          console.warn('Could not load profile photograph from:', imagePath);
          onComplete(null);
        };
        fallbackImg.src = encoded;
      } else {
        console.warn('Could not load profile photograph from:', imagePath);
        onComplete(null);
      }
    };

    img.src = imagePath;
  });
}
