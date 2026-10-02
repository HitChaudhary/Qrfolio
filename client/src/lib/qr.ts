import QRCode from "qrcode";

const DARK = "#0f172a";
const LIGHT = "#ffffff";
const QUIET = 4; // quiet zone, in modules (QR spec minimum)
const TARGET = 1024; // approximate output size in px
const LOGO_RATIO = 0.22; // logo box = 22% of width (~5% of area, safe with level H)

type QrCreate = {
  create: (text: string, opts: { errorCorrectionLevel: string }) => { modules: { size: number; data: ArrayLike<number> } };
};

export interface QrResult {
  pngDataUrl: string;
  svg: string;
  logoIncluded: boolean;
}

// crossOrigin is required so the canvas is not tainted (Cloudinary sends CORS headers).
function loadOnce(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  const first = await loadOnce(src);
  if (first) return first;
  // Retry with a cache-buster in case a non-CORS copy is cached by the browser
  return loadOnce(`${src}${src.includes("?") ? "&" : "?"}cb=${Date.now()}`);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draw the image cropped to a centered square
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number) {
  const s = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - s) / 2;
  const sy = (img.naturalHeight - s) / 2;
  ctx.drawImage(img, sx, sy, s, s, x, y, size, size);
}

// Builds both PNG and SVG from the same module matrix. Error correction is always H.
export async function generateQr(url: string, logoUrl: string): Promise<QrResult> {
  const qr = (QRCode as unknown as QrCreate).create(url, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const data = qr.modules.data;

  const cell = Math.ceil(TARGET / (n + 2 * QUIET)); // integer cell size = crisp edges
  const total = cell * (n + 2 * QUIET);
  const box = Math.round(total * LOGO_RATIO);
  const pos = Math.round((total - box) / 2);
  const pad = Math.round(box * 0.1);
  const inner = box - 2 * pad;
  const boxR = Math.round(box * 0.2);
  const innerR = Math.round(inner * 0.18);

  const logo = logoUrl ? await loadImage(logoUrl) : null;

  const canvas = document.createElement("canvas");
  canvas.width = total;
  canvas.height = total;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, 0, total, total);
  ctx.fillStyle = DARK;

  let path = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!data[r * n + c]) continue;
      const x = (c + QUIET) * cell;
      const y = (r + QUIET) * cell;
      ctx.fillRect(x, y, cell, cell);
      path += `M${x} ${y}h${cell}v${cell}h-${cell}z`;
    }
  }

  let logoSvg = "";
  if (logo) {
    // White rounded container behind the logo
    ctx.fillStyle = LIGHT;
    roundedRect(ctx, pos, pos, box, box, boxR);
    ctx.fill();
    ctx.save();
    roundedRect(ctx, pos + pad, pos + pad, inner, inner, innerR);
    ctx.clip();
    drawCover(ctx, logo, pos + pad, pos + pad, inner);
    ctx.restore();

    // Self-contained logo for the SVG (embedded as a data URL)
    const small = document.createElement("canvas");
    small.width = 256;
    small.height = 256;
    const sctx = small.getContext("2d");
    if (sctx) {
      drawCover(sctx, logo, 0, 0, 256);
      const ix = pos + pad;
      logoSvg =
        `<rect x="${pos}" y="${pos}" width="${box}" height="${box}" rx="${boxR}" fill="${LIGHT}"/>` +
        `<clipPath id="logo-clip"><rect x="${ix}" y="${ix}" width="${inner}" height="${inner}" rx="${innerR}"/></clipPath>` +
        `<image xlink:href="${small.toDataURL("image/png")}" x="${ix}" y="${ix}" width="${inner}" height="${inner}" ` +
        `preserveAspectRatio="xMidYMid slice" clip-path="url(#logo-clip)"/>`;
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="${LIGHT}"/>` +
    `<path fill="${DARK}" d="${path}"/>${logoSvg}</svg>`;

  return { pngDataUrl: canvas.toDataURL("image/png"), svg, logoIncluded: Boolean(logo && logoSvg) };
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadPng(dataUrl: string, filename: string) {
  triggerDownload(dataUrl, filename);
}

export function downloadSvg(svg: string, filename: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Returns false if the browser blocked the pop-up.
export function printQr(dataUrl: string, title: string): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  const doc = w.document;
  doc.title = title;
  const style = doc.createElement("style");
  style.textContent =
    "body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,sans-serif}img{width:70vmin;max-width:600px}p{font-size:20px;font-weight:600}";
  const img = doc.createElement("img");
  img.onload = () => w.print();
  img.src = dataUrl;
  const p = doc.createElement("p");
  p.textContent = title;
  doc.head.appendChild(style);
  doc.body.append(img, p);
  return true;
}
