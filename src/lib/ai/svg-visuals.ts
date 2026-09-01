// ════════════════════════════════════════════════════════════════════════════
// SVG EDUCATIONAL VISUAL GENERATOR
// Creates deterministic, labeled, educational diagrams — not random AI art
// Visual Router picks the right generator based on topic type
// ════════════════════════════════════════════════════════════════════════════

import { VisualPlan, VisualType, GeneratedVisual } from './types';
import { classifyVisualDomain } from './visual-domain-classifier';

const CREAM = '#F7F2E8';
const STONE_800 = '#2C2318';
const STONE_600 = '#524035';
const STONE_400 = '#8C7466';
const SAGE_600 = '#4E6B57';
const SAGE_100 = '#E4EDE7';
const TERRA = '#8B4A35';
const BLUE = '#2D6A8F';
const AMBER = '#B87333';
const HIGHLIGHT = '#D4A090';
const BG = '#F2EDE4';

// ─── Helper SVG primitives ───────────────────────────────────────────────────

function svgLabel(x: number, y: number, text: string, opts?: {
    size?: number; bold?: boolean; color?: string; bg?: boolean;
}) {
    const { size = 12, bold = false, color = STONE_800, bg = false } = opts ?? {};
    const fw = bold ? '600' : '400';
    if (bg) {
        return `<text x="${x}" y="${y}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="${size}" font-weight="${fw}" fill="${color}" paint-order="stroke" stroke="${CREAM}" stroke-width="4" stroke-linejoin="round">${text}</text>`;
    }
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="${size}" font-weight="${fw}" fill="${color}">${text}</text>`;
}

function svgArrow(x1: number, y1: number, x2: number, y2: number, color = STONE_400, label?: string) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const labelEl = label
        ? `<text x="${mx + 6}" y="${my - 4}" font-family="'DM Sans',sans-serif" font-size="10" fill="${color}">${label}</text>`
        : '';
    return `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${color}" /></marker></defs>
<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" marker-end="url(#ah)" />
${labelEl}`;
}

// Marker-free arrow (safe to use multiple times per SVG — no <defs> id collisions)
function arrowLine(x1: number, y1: number, x2: number, y2: number, color: string, label?: string) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 9;
    const hx1 = x2 - headLen * Math.cos(angle - Math.PI / 6);
    const hy1 = y2 - headLen * Math.sin(angle - Math.PI / 6);
    const hx2 = x2 - headLen * Math.cos(angle + Math.PI / 6);
    const hy2 = y2 - headLen * Math.sin(angle + Math.PI / 6);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const labelEl = label
        ? `<text x="${mx}" y="${my - 6}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" font-weight="600" fill="${color}" paint-order="stroke" stroke="${CREAM}" stroke-width="3">${label}</text>`
        : '';
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" />
<polygon points="${x2},${y2} ${hx1.toFixed(1)},${hy1.toFixed(1)} ${hx2.toFixed(1)},${hy2.toFixed(1)}" fill="${color}" />
${labelEl}`;
}

// ─── 1. BOHR ATOM / ATOMIC STRUCTURE DIAGRAM ────────────────────────────────

function generateAtomicDiagram(plan: VisualPlan): string {
    const W = 600; const H = 520;
    const cx = 300; const cy = 260;
    const shells = [0, 70, 130, 185]; // r for n=1,2,3

    // Electrons per shell for Hydrogen-like display
    const electrons: { shell: number; angle: number }[] = [
        { shell: 1, angle: 270 },
        { shell: 2, angle: 30 },
        { shell: 2, angle: 150 },
        { shell: 3, angle: 60 },
    ];

    const orbits = shells.slice(1).map((r, i) => {
        const n = i + 1;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STONE_400}" stroke-width="1" stroke-dasharray="4 3" />
    <text x="${cx + r + 6}" y="${cy - 5}" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">n=${n}</text>`;
    }).join('\n');

    const electronDots = electrons.map(e => {
        const r = shells[e.shell];
        const rad = (e.angle * Math.PI) / 180;
        const ex = cx + r * Math.cos(rad);
        const ey = cy + r * Math.sin(rad);
        return `<circle cx="${ex}" cy="${ey}" r="7" fill="${BLUE}" stroke="${CREAM}" stroke-width="1.5" />
    <text x="${ex}" y="${ey + 4}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="8" fill="${CREAM}">e⁻</text>`;
    }).join('\n');

    // Transition arrow
    const r1 = shells[1]; const r2 = shells[2];
    const ax1 = cx + r1 * Math.cos(-Math.PI / 6);
    const ay1 = cy + r1 * Math.sin(-Math.PI / 6);
    const ax2 = cx + r2 * Math.cos(-Math.PI / 6);
    const ay2 = cy + r2 * Math.sin(-Math.PI / 6);

    // Emission photon
    const px = cx + 230; const py = cy - 60;

    const elements = `
    <!-- Background -->
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    
    <!-- Title -->
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    
    <!-- Nucleus -->
    <circle cx="${cx}" cy="${cy}" r="28" fill="${TERRA}" opacity="0.9" />
    <circle cx="${cx}" cy="${cy}" r="28" fill="none" stroke="${STONE_800}" stroke-width="1" />
    ${svgLabel(cx, cy - 6, 'Nucleus', { size: 10, bold: true, color: CREAM })}
    ${svgLabel(cx, cy + 8, 'p⁺ + n⁰', { size: 9, color: CREAM })}

    <!-- Orbits -->
    ${orbits}

    <!-- Electrons -->
    ${electronDots}

    <!-- Transition arrow (absorption) -->
    <defs>
      <marker id="arr-up" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="${SAGE_600}" />
      </marker>
    </defs>
    <line x1="${ax1}" y1="${ay1}" x2="${ax2}" y2="${ay2}" stroke="${SAGE_600}" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-up)" />
    <text x="${(ax1 + ax2) / 2 + 18}" y="${(ay1 + ay2) / 2}" font-family="'DM Sans',sans-serif" font-size="10" fill="${SAGE_600}">Energy absorbed ↑</text>

    <!-- Photon emission indicator -->
    <circle cx="${px}" cy="${py}" r="18" fill="${AMBER}" opacity="0.8" />
    <text x="${px}" y="${py + 4}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" font-weight="600" fill="${CREAM}">hν</text>
    <text x="${px}" y="${py + 26}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="${STONE_600}">Photon emitted</text>
    <line x1="${cx + 60}" y1="${cy - 80}" x2="${px - 22}" y2="${py + 2}" stroke="${AMBER}" stroke-width="1.5" stroke-dasharray="4 3" />

    <!-- Legend -->
    <rect x="20" y="${H - 90}" width="180" height="76" fill="${CREAM}" stroke="${STONE_400}" stroke-width="0.5" rx="8" opacity="0.9" />
    <text x="30" y="${H - 72}" font-family="'DM Sans',sans-serif" font-size="11" font-weight="600" fill="${STONE_800}">Legend</text>
    <circle cx="35" cy="${H - 57}" r="6" fill="${TERRA}" /><text x="48" y="${H - 53}" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_600}">Nucleus (protons + neutrons)</text>
    <circle cx="35" cy="${H - 40}" r="6" fill="${BLUE}" /><text x="48" y="${H - 36}" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_600}">Electron (e⁻)</text>
    <line x1="28" y1="${H - 22}" x2="42" y2="${H - 22}" stroke="${STONE_400}" stroke-dasharray="4 3" stroke-width="1.5" /><text x="48" y="${H - 18}" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_600}">Electron shell (energy level)</text>

    <!-- Caption -->
    <text x="${W / 2}" y="${H - 10}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>
  `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${elements}</svg>`;
}

// ─── 2. PROCESS FLOW DIAGRAM ─────────────────────────────────────────────────

function generateProcessFlow(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const elements = plan.elements.slice(0, 6);
    const count = elements.length;
    const boxW = 130; const boxH = 50;
    const gap = 60;
    const totalH = count * boxH + (count - 1) * gap;
    const startY = (H - totalH) / 2;

    const boxes = elements.map((el, i) => {
        const y = startY + i * (boxH + gap);
        const cx = W / 2;
        const cy = y + boxH / 2;
        const color = i === 0 ? SAGE_600 : i === count - 1 ? TERRA : STONE_600;
        return `
      <rect x="${cx - boxW / 2}" y="${y}" width="${boxW}" height="${boxH}" rx="10" fill="${color}" opacity="${i === 0 || i === count - 1 ? '1' : '0.75'}" />
      ${svgLabel(cx, cy + 5, el, { size: 12, bold: true, color: CREAM })}
      ${i < count - 1 ? `<defs><marker id="af${i}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${STONE_400}" /></marker></defs>
      <line x1="${cx}" y1="${y + boxH}" x2="${cx}" y2="${y + boxH + gap - 2}" stroke="${STONE_400}" stroke-width="2" marker-end="url(#af${i})" />` : ''}
      ${plan.relationships?.[i] ? `<text x="${cx + 80}" y="${y + boxH + gap / 2 + 4}" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.relationships[i].label}</text>` : ''}
    `;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    ${boxes}
    <text x="${W / 2}" y="${H - 10}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>
  </svg>`;
}

// ─── 3. INFOGRAPHIC / KEY FACTS ──────────────────────────────────────────────

function generateInfoGraphic(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const items = plan.elements.slice(0, 6);
    const cols = 2; const rows = Math.ceil(items.length / cols);
    const cardW = 240; const cardH = 90; const padX = 40; const padY = 90; const gap = 16;

    const cards = items.map((el, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padX + col * (cardW + gap);
        const y = padY + row * (cardH + gap);
        const colors = [SAGE_600, TERRA, BLUE, AMBER, STONE_600, SAGE_600];
        const c = colors[i % colors.length];
        return `
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="12" fill="${CREAM}" stroke="${c}" stroke-width="1.5" />
      <rect x="${x}" y="${y}" width="6" height="${cardH}" rx="3" fill="${c}" />
      <text x="${x + 20}" y="${y + 28}" font-family="'DM Sans',sans-serif" font-size="11" font-weight="600" fill="${c}">${String.fromCharCode(0x2460 + i)} ${el}</text>
      <text x="${x + 20}" y="${y + 56}" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_600}">Key term in ${plan.title.slice(0, 30)}</text>
    `;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    ${cards}
    <text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>
  </svg>`;
}

// ─── 4. TIMELINE ─────────────────────────────────────────────────────────────

function generateTimeline(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const events = plan.elements.slice(0, 6);
    const lineY = H / 2;
    const padX = 60;
    const step = (W - padX * 2) / Math.max(events.length - 1, 1);

    const nodes = events.map((ev, i) => {
        const x = padX + i * step;
        const above = i % 2 === 0;
        const textY = above ? lineY - 50 : lineY + 70;
        return `
      <circle cx="${x}" cy="${lineY}" r="10" fill="${TERRA}" stroke="${CREAM}" stroke-width="2" />
      <line x1="${x}" y1="${above ? lineY - 12 : lineY + 12}" x2="${x}" y2="${above ? lineY - 38 : lineY + 58}" stroke="${STONE_400}" stroke-width="1.5" />
      <text x="${x}" y="${textY}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" font-weight="500" fill="${STONE_800}">${ev}</text>
    `;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    <!-- Timeline line -->
    <line x1="${padX}" y1="${lineY}" x2="${W - padX}" y2="${lineY}" stroke="${STONE_400}" stroke-width="2.5" />
    <!-- Start/End markers -->
    <circle cx="${padX}" cy="${lineY}" r="5" fill="${SAGE_600}" />
    <circle cx="${W - padX}" cy="${lineY}" r="5" fill="${SAGE_600}" />
    ${nodes}
    <text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>
  </svg>`;
}

// ─── 5. MATHEMATICAL VISUAL ──────────────────────────────────────────────────

function generateMathVisual(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cx = W / 2; const cy = H / 2 + 20;
    const range = 180;

    // Draw a coordinate plane with a sample parabola
    const points: string[] = [];
    for (let px = -range; px <= range; px += 6) {
        const x = cx + px;
        const y = cy - (px * px) / 200; // parabola y = -x²/200
        points.push(`${x},${y}`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    <!-- Axes -->
    <line x1="${cx - range - 20}" y1="${cy}" x2="${cx + range + 30}" y2="${cy}" stroke="${STONE_600}" stroke-width="2" />
    <line x1="${cx}" y1="${cy + 40}" x2="${cx}" y2="${cy - range - 20}" stroke="${STONE_600}" stroke-width="2" />
    <!-- Axis labels -->
    <text x="${cx + range + 36}" y="${cy + 4}" font-family="'DM Sans',sans-serif" font-size="13" fill="${STONE_600}">x</text>
    <text x="${cx - 14}" y="${cy - range - 14}" font-family="'DM Sans',sans-serif" font-size="13" fill="${STONE_600}">y</text>
    <!-- Origin -->
    <text x="${cx + 6}" y="${cy + 14}" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">O</text>
    <!-- Grid lines -->
    ${[-120, -60, 60, 120].map(d => `
      <line x1="${cx + d}" y1="${cy - 5}" x2="${cx + d}" y2="${cy + 5}" stroke="${STONE_600}" stroke-width="1" />
      <line x1="${cx - 5}" y1="${cy + d}" x2="${cx + 5}" y2="${cy + d}" stroke="${STONE_600}" stroke-width="1" />
    `).join('')}
    <!-- Curve -->
    <polyline points="${points.join(' ')}" fill="none" stroke="${SAGE_600}" stroke-width="2.5" stroke-linejoin="round" />
    <!-- Vertex label -->
    <circle cx="${cx}" cy="${cy}" r="5" fill="${TERRA}" />
    <text x="${cx + 10}" y="${cy - 8}" font-family="'DM Sans',sans-serif" font-size="11" font-weight="600" fill="${TERRA}">Vertex</text>
    <!-- Element labels -->
    ${plan.elements.slice(0, 3).map((el, i) =>
        `<text x="30" y="${100 + i * 22}" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_600}">• ${el}</text>`
    ).join('')}
    <text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>
  </svg>`;
}

// ─── 6. EXPERIMENT SETUP ─────────────────────────────────────────────────────

function generateExperimentSetup(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const items = plan.elements.slice(0, 6);
    // Show a horizontal experiment bench with labeled components
    const benchY = 280; const benchH = 20;
    const compW = 70; const compH = 80;
    const totalW = items.length * (compW + 20) - 20;
    const startX = (W - totalW) / 2;

    const components = items.map((el, i) => {
        const x = startX + i * (compW + 20);
        const colors = [TERRA, BLUE, SAGE_600, AMBER, STONE_600, TERRA];
        const c = colors[i % colors.length];
        return `
      <rect x="${x}" y="${benchY - compH}" width="${compW}" height="${compH}" rx="8" fill="${c}" opacity="0.85" />
      <text x="${x + compW / 2}" y="${benchY - compH / 2 + 5}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="${CREAM}" font-weight="600">${el.slice(0, 12)}</text>
      <line x1="${x + compW / 2}" y1="${benchY}" x2="${x + compW / 2}" y2="${benchY + 30}" stroke="${STONE_400}" stroke-width="1" stroke-dasharray="3 2" />
    `;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>
    <!-- Lab bench -->
    <rect x="30" y="${benchY}" width="${W - 60}" height="${benchH}" rx="6" fill="${STONE_600}" opacity="0.35" />
    <!-- Components -->
    ${components}
    <!-- Observation box -->
    <rect x="30" y="${benchY + 60}" width="${W - 60}" height="70" rx="10" fill="${CREAM}" stroke="${STONE_400}" stroke-width="1" />
    <text x="${W / 2}" y="${benchY + 80}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" font-weight="600" fill="${STONE_800}">Observation</text>
    <text x="${W / 2}" y="${benchY + 100}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_600}">${plan.caption}</text>
    <text x="${W / 2}" y="${H - 10}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">Educational experiment setup diagram</text>
  </svg>`;
}

// ─── 7. FORCE / VECTOR DIAGRAM (mechanics: Newton's Laws, Circular Motion) ──

function generateForceDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cx = W / 2; const cy = H / 2 + 10;
    const search = `${plan.title} ${plan.elements.join(' ')} ${plan.caption}`.toLowerCase();
    const isCircular = /circular|centripetal/.test(search);
    const objLabel = plan.elements[0] ?? 'Object';

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    if (isCircular) {
        const r = 140;
        const objAngle = -40;
        const rad = (objAngle * Math.PI) / 180;
        const ox = cx + r * Math.cos(rad);
        const oy = cy + r * Math.sin(rad);
        const inX = ox + (cx - ox) * 0.55;
        const inY = oy + (cy - oy) * 0.55;
        const tanRad = ((objAngle - 90) * Math.PI) / 180;
        const tx = ox + 75 * Math.cos(tanRad);
        const ty = oy + 75 * Math.sin(tanRad);

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${STONE_400}" stroke-width="1.5" stroke-dasharray="5 4" />
    <circle cx="${cx}" cy="${cy}" r="4" fill="${STONE_600}" />
    ${svgLabel(cx, cy - r - 14, 'Center', { size: 10, color: STONE_400 })}
    <circle cx="${ox}" cy="${oy}" r="14" fill="${TERRA}" stroke="${STONE_800}" stroke-width="1" />
    ${arrowLine(ox, oy, inX, inY, SAGE_600, 'Centripetal Force')}
    ${arrowLine(ox, oy, tx, ty, BLUE, 'Velocity')}
    ${svgLabel(ox, oy + 34, objLabel, { size: 11, bold: true, color: STONE_800, bg: true })}
    ${footer}
  </svg>`;
    }

    const boxW = 100; const boxH = 64;
    const items = plan.elements.slice(1, 5);

    function forceColor(name: string): string {
        const n = name.toLowerCase();
        if (/gravity|weight/.test(n)) return TERRA;
        if (/normal|support/.test(n)) return BLUE;
        if (/friction/.test(n)) return AMBER;
        return SAGE_600;
    }
    function forceDir(name: string, index: number): { dx: number; dy: number } {
        const n = name.toLowerCase();
        if (/gravity|weight/.test(n)) return { dx: 0, dy: 1 };
        if (/normal|support/.test(n)) return { dx: 0, dy: -1 };
        if (/friction/.test(n)) return { dx: -1, dy: 0 };
        return index % 2 === 0 ? { dx: 1, dy: 0 } : { dx: 0, dy: -1 };
    }

    const arrows = items.map((el, i) => {
        const { dx, dy } = forceDir(el, i);
        const len = 110;
        const sx = cx + dx * boxW / 2;
        const sy = cy + dy * boxH / 2;
        const ex = sx + dx * len;
        const ey = sy + dy * len;
        return arrowLine(sx, sy, ex, ey, forceColor(el), el);
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    <rect x="${cx - boxW / 2}" y="${cy - boxH / 2}" width="${boxW}" height="${boxH}" rx="10" fill="${STONE_600}" />
    ${svgLabel(cx, cy + 5, objLabel.slice(0, 14), { size: 12, bold: true, color: CREAM })}
    ${arrows}
    ${footer}
  </svg>`;
}

// ─── 8. CIRCUIT DIAGRAM (Galvanometer, Ohm's Law, current electricity) ──────

function generateCircuitDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const left = 100; const right = W - 100;
    const top = 170; const bottom = 320;
    const items = plan.elements.slice(0, 4);

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    const battY = (top + bottom) / 2;
    const battery = `
    <line x1="${left}" y1="${top}" x2="${left}" y2="${battY - 18}" stroke="${STONE_600}" stroke-width="2" />
    <line x1="${left}" y1="${battY + 18}" x2="${left}" y2="${bottom}" stroke="${STONE_600}" stroke-width="2" />
    <line x1="${left - 14}" y1="${battY - 18}" x2="${left + 14}" y2="${battY - 18}" stroke="${STONE_800}" stroke-width="4" />
    <line x1="${left - 8}" y1="${battY + 18}" x2="${left + 8}" y2="${battY + 18}" stroke="${STONE_800}" stroke-width="1.5" />
    ${svgLabel(left - 34, battY + 4, 'Battery', { size: 10, color: STONE_600 })}
    ${svgLabel(left - 34, battY - 18, '+', { size: 13, bold: true, color: TERRA })}`;

    const count = Math.max(items.length, 1);
    const step = (right - left) / (count + 1);
    const components = items.map((el, i) => {
        const ccx = left + step * (i + 1);
        const n = el.toLowerCase();
        if (/resist/.test(n)) {
            const zz = [0, -10, 10, -10, 10, 0].map((dy, j) => `${ccx - 20 + j * 8},${top + dy}`).join(' ');
            return `<polyline points="${zz}" fill="none" stroke="${AMBER}" stroke-width="2.5" />
      ${svgLabel(ccx, top - 18, el, { size: 10, bold: true, color: AMBER, bg: true })}`;
        }
        if (/galvanometer|ammeter|meter/.test(n)) {
            return `<circle cx="${ccx}" cy="${top}" r="20" fill="${CREAM}" stroke="${BLUE}" stroke-width="2" />
      ${svgLabel(ccx, top + 5, /ammeter/.test(n) ? 'A' : 'G', { size: 14, bold: true, color: BLUE })}
      ${svgLabel(ccx, top - 32, el, { size: 10, bold: true, color: BLUE, bg: true })}`;
        }
        if (/switch/.test(n)) {
            return `<circle cx="${ccx - 16}" cy="${top}" r="3" fill="${STONE_800}" />
      <circle cx="${ccx + 16}" cy="${top}" r="3" fill="${STONE_800}" />
      <line x1="${ccx - 16}" y1="${top}" x2="${ccx + 12}" y2="${top - 16}" stroke="${STONE_800}" stroke-width="2" />
      ${svgLabel(ccx, top - 26, el, { size: 10, bold: true, color: STONE_800, bg: true })}`;
        }
        return `<rect x="${ccx - 22}" y="${top - 14}" width="44" height="28" rx="6" fill="${SAGE_600}" opacity="0.85" />
    ${svgLabel(ccx, top + 4, el.slice(0, 10), { size: 9, bold: true, color: CREAM })}`;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    <line x1="${left}" y1="${top}" x2="${right}" y2="${top}" stroke="${STONE_600}" stroke-width="2" />
    <line x1="${right}" y1="${top}" x2="${right}" y2="${bottom}" stroke="${STONE_600}" stroke-width="2" />
    <line x1="${right}" y1="${bottom}" x2="${left}" y2="${bottom}" stroke="${STONE_600}" stroke-width="2" />
    ${battery}
    ${components}
    ${arrowLine(left + 55, top - 30, left + 100, top - 30, SAGE_600, 'I →')}
    ${plan.relationships?.[0] ? svgLabel(W / 2, bottom + 40, plan.relationships[0].label, { size: 13, bold: true, color: STONE_800 }) : ''}
    ${footer}
  </svg>`;
}

// ─── 9. FIELD DIAGRAM (Coulomb's Law, Electric Field, Magnetic Force) ───────

function generateFieldDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cy = H / 2 + 10;
    const search = `${plan.title} ${plan.elements.join(' ')} ${plan.caption}`.toLowerCase();
    const isMagnetic = /magnetic|pole/.test(search);
    const el1 = plan.elements[0] ?? (isMagnetic ? 'North Pole' : 'Charge 1');
    const el2 = plan.elements[1] ?? (isMagnetic ? 'South Pole' : 'Charge 2');
    const label1 = isMagnetic ? 'N' : '+';
    const label2 = isMagnetic ? 'S' : (/like|repel/.test(search) ? '+' : '−');

    const x1 = W / 2 - 140; const x2 = W / 2 + 140;

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    const lines = [-60, -30, 0, 30, 60].map(offset => {
        const ctrlY = cy + offset * 2.2;
        return `<path d="M ${x1 + 24} ${cy} Q ${W / 2} ${ctrlY} ${x2 - 24} ${cy}" fill="none" stroke="${BLUE}" stroke-width="1.2" opacity="0.5" />`;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    ${lines}
    <circle cx="${x1}" cy="${cy}" r="26" fill="${TERRA}" stroke="${STONE_800}" stroke-width="1" />
    ${svgLabel(x1, cy + 6, label1, { size: 16, bold: true, color: CREAM })}
    ${svgLabel(x1, cy + 48, el1, { size: 11, bold: true, color: STONE_800, bg: true })}
    <circle cx="${x2}" cy="${cy}" r="26" fill="${BLUE}" stroke="${STONE_800}" stroke-width="1" />
    ${svgLabel(x2, cy + 6, label2, { size: 16, bold: true, color: CREAM })}
    ${svgLabel(x2, cy + 48, el2, { size: 11, bold: true, color: STONE_800, bg: true })}
    ${arrowLine(x1 + 44, cy - 60, x2 - 44, cy - 60, SAGE_600, 'Force')}
    ${footer}
  </svg>`;
}

// ─── 10. ENERGY FLOW DIAGRAM (Thermodynamics, Heat Transfer) ────────────────

function generateEnergyFlowDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cx = W / 2; const cy = H / 2 - 10;
    const boxW = 160; const boxH = 110;
    const items = plan.elements.slice(0, 3);

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    const satellites = items.map((el, i) => {
        const x = 90 + i * ((W - 180) / Math.max(items.length - 1, 1));
        return svgLabel(x, H - 70, el, { size: 11, color: STONE_600, bg: true });
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    <rect x="${cx - boxW / 2}" y="${cy - boxH / 2}" width="${boxW}" height="${boxH}" rx="14" fill="${STONE_600}" opacity="0.9" />
    ${svgLabel(cx, cy - 6, 'System', { size: 13, bold: true, color: CREAM })}
    ${svgLabel(cx, cy + 16, 'ΔU', { size: 18, bold: true, color: CREAM })}
    ${arrowLine(cx - boxW / 2 - 90, cy - 60, cx - boxW / 2 - 4, cy - 20, AMBER, 'Q (heat in)')}
    ${arrowLine(cx + boxW / 2 + 4, cy + 20, cx + boxW / 2 + 90, cy + 60, BLUE, 'W (work out)')}
    ${satellites}
    ${svgLabel(cx, cy + boxH / 2 + 40, 'ΔU = Q − W', { size: 14, bold: true, color: STONE_800 })}
    ${footer}
  </svg>`;
}

// ─── 11. MOLECULE / BONDING DIAGRAM (Ionic & Covalent Bonds, VSEPR) ─────────

function generateMoleculeDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cx = W / 2; const cy = H / 2 + 10;
    const search = `${plan.title} ${plan.elements.join(' ')} ${plan.caption}`.toLowerCase();
    const isIonic = /ionic/.test(search) && !/covalent/.test(search);
    const names = plan.elements.length > 0 ? plan.elements.slice(0, 4) : ['Atom A', 'Atom B'];
    const colors = [BLUE, TERRA, SAGE_600, AMBER];

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    let body: string;
    if (names.length <= 2) {
        const a = names[0]; const b = names[1] ?? 'Atom B';
        const ax = cx - 90; const bx = cx + 90;
        if (isIonic) {
            body = `
      <circle cx="${ax}" cy="${cy}" r="34" fill="${colors[0]}" />
      ${svgLabel(ax, cy + 6, '+', { size: 18, bold: true, color: CREAM })}
      ${svgLabel(ax, cy + 58, a, { size: 12, bold: true, color: STONE_800, bg: true })}
      <circle cx="${bx}" cy="${cy}" r="34" fill="${colors[1]}" />
      ${svgLabel(bx, cy + 6, '−', { size: 18, bold: true, color: CREAM })}
      ${svgLabel(bx, cy + 58, b, { size: 12, bold: true, color: STONE_800, bg: true })}
      ${arrowLine(ax + 40, cy - 24, bx - 40, cy - 24, STONE_600, 'electron transferred')}`;
        } else {
            body = `
      <line x1="${ax + 34}" y1="${cy}" x2="${bx - 34}" y2="${cy}" stroke="${STONE_600}" stroke-width="3" />
      <circle cx="${cx - 8}" cy="${cy - 6}" r="4" fill="${STONE_800}" />
      <circle cx="${cx + 8}" cy="${cy + 6}" r="4" fill="${STONE_800}" />
      <circle cx="${ax}" cy="${cy}" r="34" fill="${colors[0]}" />
      ${svgLabel(ax, cy + 5, a.slice(0, 2), { size: 13, bold: true, color: CREAM })}
      ${svgLabel(ax, cy + 58, a, { size: 12, bold: true, color: STONE_800, bg: true })}
      <circle cx="${bx}" cy="${cy}" r="34" fill="${colors[1]}" />
      ${svgLabel(bx, cy + 5, b.slice(0, 2), { size: 13, bold: true, color: CREAM })}
      ${svgLabel(bx, cy + 58, b, { size: 12, bold: true, color: STONE_800, bg: true })}`;
        }
    } else {
        const central = names[0];
        const satellites = names.slice(1);
        const r = 120;
        const bonds = satellites.map((el, i) => {
            const angle = (i / satellites.length) * 2 * Math.PI - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const color = colors[(i + 1) % colors.length];
            return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${STONE_600}" stroke-width="2.5" />
      <circle cx="${x}" cy="${y}" r="26" fill="${color}" />
      ${svgLabel(x, y + 4, el.slice(0, 2), { size: 11, bold: true, color: CREAM })}
      ${svgLabel(x, y + (y > cy ? 46 : -34), el, { size: 10, color: STONE_800, bg: true })}`;
        }).join('\n');
        body = `${bonds}
      <circle cx="${cx}" cy="${cy}" r="34" fill="${colors[0]}" />
      ${svgLabel(cx, cy + 5, central.slice(0, 2), { size: 13, bold: true, color: CREAM })}
      ${svgLabel(cx, cy - 48, central, { size: 12, bold: true, color: STONE_800, bg: true })}`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    ${body}
    ${footer}
  </svg>`;
}

// ─── 12. EARTH LAYER / TECTONIC / CLIMATE DIAGRAM (Geography) ───────────────

function generateEarthLayerDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const search = `${plan.title} ${plan.elements.join(' ')} ${plan.caption}`.toLowerCase();
    const isTectonic = /tectonic|plate|subduct|convergent|divergent|transform|earthquake|volcano/.test(search);

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    if (isTectonic) {
        const groundY = 260;
        const mode = /divergent/.test(search) ? 'divergent' : /transform/.test(search) ? 'transform' : 'convergent';

        let plates: string;
        if (mode === 'divergent') {
            plates = `
      <rect x="60" y="${groundY - 30}" width="220" height="40" fill="${TERRA}" opacity="0.85" rx="4" />
      <rect x="320" y="${groundY - 30}" width="220" height="40" fill="${BLUE}" opacity="0.85" rx="4" />
      ${arrowLine(280, groundY - 10, 220, groundY - 10, STONE_800)}
      ${arrowLine(320, groundY - 10, 380, groundY - 10, STONE_800)}
      ${arrowLine(300, groundY + 60, 300, groundY - 20, SAGE_600, 'Magma rises')}
      ${svgLabel(W / 2, groundY - 60, 'Divergent Boundary', { size: 12, bold: true, color: STONE_800, bg: true })}`;
        } else if (mode === 'transform') {
            plates = `
      <rect x="60" y="${groundY - 30}" width="240" height="40" fill="${TERRA}" opacity="0.85" rx="4" />
      <rect x="300" y="${groundY - 25}" width="240" height="40" fill="${BLUE}" opacity="0.85" rx="4" />
      ${arrowLine(180, groundY - 45, 260, groundY - 45, STONE_800)}
      ${arrowLine(420, groundY - 15, 340, groundY - 15, STONE_800)}
      ${svgLabel(W / 2, groundY - 65, 'Transform Boundary', { size: 12, bold: true, color: STONE_800, bg: true })}`;
        } else {
            plates = `
      <rect x="60" y="${groundY - 30}" width="240" height="40" fill="${TERRA}" opacity="0.85" rx="4" transform="rotate(-4 180 ${groundY})" />
      <rect x="300" y="${groundY - 40}" width="240" height="50" fill="${BLUE}" opacity="0.85" rx="4" />
      ${arrowLine(200, groundY - 60, 280, groundY - 40, STONE_800)}
      ${arrowLine(440, groundY - 70, 340, groundY - 45, STONE_800)}
      ${svgLabel(W / 2, groundY - 90, 'Convergent Boundary', { size: 12, bold: true, color: STONE_800, bg: true })}`;
        }

        const labels = plan.elements.slice(0, 4).map((el, i) =>
            svgLabel(90 + i * ((W - 180) / Math.max(plan.elements.length - 1, 1)), H - 60, el, { size: 10, color: STONE_600 })
        ).join('\n');

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
      <line x1="40" y1="${groundY + 20}" x2="${W - 40}" y2="${groundY + 20}" stroke="${STONE_400}" stroke-width="1" stroke-dasharray="3 3" />
      ${plates}
      ${labels}
      ${footer}
    </svg>`;
    }

    const bandNames = ['Polar', 'Temperate', 'Tropical', 'Temperate', 'Polar'];
    const bandColors = [BLUE, SAGE_600, TERRA, SAGE_600, BLUE];
    const bandH = 60; const startY = 110;
    const rows = bandNames.map((name, i) => {
        const label = plan.elements[i] ?? name;
        return `<rect x="60" y="${startY + i * bandH}" width="${W - 120}" height="${bandH - 4}" fill="${bandColors[i]}" opacity="0.75" rx="6" />
    ${svgLabel(W / 2, startY + i * bandH + bandH / 2 + 4, label, { size: 12, bold: true, color: CREAM })}`;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    ${rows}
    ${footer}
  </svg>`;
}

// ─── 13. LABELED STRUCTURE DIAGRAM (generic safe fallback — never the atom) ─

function generateLabeledStructureDiagram(plan: VisualPlan): string {
    const W = 600; const H = 480;
    const cx = W / 2; const cy = H / 2 + 10;
    const items = plan.elements.slice(0, 6);

    const header = `
    <rect width="${W}" height="${H}" fill="${BG}" rx="16" />
    <text x="${W / 2}" y="36" text-anchor="middle" font-family="'Playfair Display',serif" font-size="17" font-weight="600" fill="${STONE_800}">${plan.title}</text>
    <text x="${W / 2}" y="56" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="${STONE_400}">${plan.learningObjective}</text>`;
    const footer = `<text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="${STONE_400}">${plan.caption}</text>`;

    const blobPath = `M ${cx - 110} ${cy}
    C ${cx - 110} ${cy - 90}, ${cx - 40} ${cy - 120}, ${cx} ${cy - 110}
    C ${cx + 60} ${cy - 100}, ${cx + 110} ${cy - 50}, ${cx + 105} ${cy}
    C ${cx + 100} ${cy + 70}, ${cx + 40} ${cy + 110}, ${cx - 10} ${cy + 105}
    C ${cx - 70} ${cy + 100}, ${cx - 110} ${cy + 60}, ${cx - 110} ${cy} Z`;

    const count = Math.max(items.length, 1);
    const callouts = items.map((el, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const innerR = 95; const outerR = 190;
        const ix = cx + innerR * 0.85 * Math.cos(angle);
        const iy = cy + innerR * 0.85 * Math.sin(angle);
        const ox = cx + outerR * Math.cos(angle);
        const oy = cy + outerR * Math.sin(angle);
        return `<line x1="${ix}" y1="${iy}" x2="${ox}" y2="${oy}" stroke="${STONE_400}" stroke-width="1" />
    <circle cx="${ox}" cy="${oy}" r="10" fill="${STONE_800}" />
    ${svgLabel(ox, oy + 4, String(i + 1), { size: 10, bold: true, color: CREAM })}
    ${svgLabel(ox, oy + (oy > cy ? 24 : -18), el, { size: 11, bold: true, color: STONE_800, bg: true })}`;
    }).join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${header}
    <path d="${blobPath}" fill="${SAGE_100}" stroke="${SAGE_600}" stroke-width="2" />
    ${callouts}
    ${footer}
  </svg>`;
}

// ─── Visual Router ────────────────────────────────────────────────────────────

interface VisualRouteContext {
    topic?: string;
    chapter?: string;
    subject?: string;
}

function routeToGenerator(plan: VisualPlan, ctx?: VisualRouteContext): string {
    // Routing decisions are based on topic/chapter/subject/title only — the same fields
    // classifySimulation() (src/lib/simulations/classifier.ts) uses — never on AI-generated
    // plan.elements/caption, which routinely contain cross-domain words (e.g. a covalent-bonding
    // lesson mentioning "shared electron pairs" would otherwise wrongly re-trigger the atom diagram).
    const searchText = `${ctx?.topic ?? ''} ${ctx?.chapter ?? ''} ${ctx?.subject ?? ''} ${plan.title}`.toLowerCase();

    // Atomic topics always get the atom diagram, regardless of chosen VisualType
    if (/atom|bohr|electron|nucleus|shell|orbital|rutherford|thomson|quantum number/.test(searchText)) {
        return generateAtomicDiagram(plan);
    }

    switch (plan.type) {
        case 'SCIENTIFIC_DIAGRAM':
        case 'ANATOMICAL_DIAGRAM':
        case 'STRUCTURE_DIAGRAM': {
            // This bucket used to collapse into the atom diagram for every topic —
            // route by topic/element keywords instead so distinct topics get distinct visuals.
            const domain = classifyVisualDomain(searchText);
            switch (domain.id) {
                case 'force': return generateForceDiagram(plan);
                case 'circuit': return generateCircuitDiagram(plan);
                case 'field': return generateFieldDiagram(plan);
                case 'thermo': return generateEnergyFlowDiagram(plan);
                case 'molecule': return generateMoleculeDiagram(plan);
                case 'earth': return generateEarthLayerDiagram(plan);
                case 'atomic': return generateAtomicDiagram(plan);
                default: return generateLabeledStructureDiagram(plan); // never the atom picture
            }
        }
        case 'EXPERIMENT_SETUP':
            return generateExperimentSetup(plan);
        case 'PROCESS_FLOW':
            return generateProcessFlow(plan);
        case 'TIMELINE':
            return generateTimeline(plan);
        case 'MATHEMATICAL_VISUAL':
            return generateMathVisual(plan);
        case 'MAP':
            // TODO: real GeoJSON/SVG map renderer — deferred, no map-based topic in curriculum yet
            return generateInfoGraphic(plan);
        case 'INFOGRAPHIC':
        case 'COMPARISON':
        default:
            return generateInfoGraphic(plan);
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateVisuals(plans: VisualPlan[], topic: string, chapter?: string, subject?: string): GeneratedVisual[] {
    return plans.map(plan => {
        const svg = routeToGenerator(plan, { topic, chapter, subject });
        return {
            page: plan.page,
            title: plan.title,
            type: plan.type,
            svgContent: svg,
            caption: plan.caption,
            learningObjective: plan.learningObjective,
            labels: plan.elements.map((el, i) => ({ x: 20, y: 100 + i * 20, text: el })),
        };
    });
}
