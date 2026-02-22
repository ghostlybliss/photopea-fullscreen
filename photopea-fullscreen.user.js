// ==UserScript==
// @name        Photopea True Fullscreen
// @namespace   https://github.com/ghostlybliss
// @version     1.1.8
// @description Photopea fullscreen + theme engine. 'P1NK' theme replaces previous Nier. Aggressive fix for pre-import source labels (Home / This Device / PeaDrive / Dropbox / OneDrive / Google Drive / PeaGames / Photopea / Vectorpea / Jampea).
// @author      ghostlybliss
// @match       https://www.photopea.com/*
// @match       https://photopea.com/*
// @run-at      document-start
// @grant       none
// @license     MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ========================= CONFIG + THEMES ========================== */
  const SPOOF_ADD = 280;
  const THEME_KEY = 'photopea_fullscreen_theme_v1';

  const THEMES = [
    { id: 'ghostly', name: 'Ghostly', vars: { '--pp-bg': '#0b0f10', '--pp-panel': '#0f1415', '--pp-accent': '#00ff9d', '--pp-text': '#e6f6f0', '--pp-muted': '#9ab6ac', '--pp-border': 'rgba(0,0,0,0.4)', '--pp-shadow': '0 6px 24px rgba(0,0,0,0.6)' } },
    { id: 'midnight', name: 'Midnight', vars: { '--pp-bg': '#0a0c11', '--pp-panel': '#0f1720', '--pp-accent': '#6ea8fe', '--pp-text': '#dbe9ff', '--pp-muted': '#94a3b8', '--pp-border': 'rgba(255,255,255,0.04)', '--pp-shadow': '0 6px 24px rgba(2,6,23,0.75)' } },
    // ===== P1NK THEME (pastel, poppy) =====
    { id: 'p1nk', name: 'P1NK', vars: {
        /* Pastel poppy pink:
           - warm/pale pink background (paper-light)
           - slightly deeper pink panels
           - bright pastel accent
           - dark-but-soft text for legibility
           - muted complementary brown/purple for secondary
        */
        '--pp-bg': '#fff0f6',       // pale pink background
        '--pp-panel': '#ffdfe9',    // slightly deeper panel
        '--pp-accent': '#ff8abf',   // poppy pastel accent
        '--pp-text': '#3a2230',     // dark warm text for good contrast
        '--pp-muted': '#a07f8f',    // muted secondary
        '--pp-border': 'rgba(58,34,48,0.06)',
        '--pp-shadow': '0 6px 24px rgba(58,34,48,0.06)'
      }
    },
    { id: 'matrix', name: 'Matrix', vars: { '--pp-bg': '#020200', '--pp-panel': '#03110a', '--pp-accent': '#19ff08', '--pp-text': '#a8ffb7', '--pp-muted': '#4b8a4b', '--pp-border': 'rgba(0,255,0,0.06)', '--pp-shadow': '0 6px 30px rgba(0,0,0,0.7)' } }
  ];

  /* ------------------------- THEME UTILITIES ------------------------- */
  function getSavedThemeId() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function saveThemeId(id) { try { localStorage.setItem(THEME_KEY, id) } catch (e) {} }
  function findThemeById(id) { return THEMES.find(t => t.id === id) || THEMES[0]; }
  function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute('data-pp-theme', theme.id);
  }

  /* ========================= WIDTH SPOOFING ========================== */
  let baseWidth = 1920;
  function calculateBaseWidth() {
    const d = document.documentElement;
    return (d && (d.clientWidth || d.offsetWidth)) || baseWidth;
  }
  function updateBaseWidth() { baseWidth = calculateBaseWidth(); try { window.dispatchEvent(new Event('resize')); } catch (e) {} }
  try {
    Object.defineProperty(window, 'innerWidth', { get: () => baseWidth + SPOOF_ADD, configurable: true });
    Object.defineProperty(window, 'outerWidth', { get: () => baseWidth + SPOOF_ADD + 60, configurable: true });
    if (window.screen) Object.defineProperty(window.screen, 'width', { get: () => baseWidth + SPOOF_ADD, configurable: true });
  } catch (e) { console.warn('[ghostlybliss] Width spoof definition failed:', e); }

  updateBaseWidth();
  requestAnimationFrame(updateBaseWidth);
  const appObserver = new MutationObserver((_, observer) => {
    if (document.querySelector('div.flexrow.app')) { updateBaseWidth(); setTimeout(updateBaseWidth, 25); observer.disconnect(); }
  });
  appObserver.observe(document.documentElement, { childList: true, subtree: true });

  /* ========================= STRONG CSS OVERRIDES FOR HOME/SOURCES ========================== */
  const css = document.createElement('style');
  css.textContent = `
:root{
  --pp-toggle-size: clamp(36px, 2.2vw, 56px);
  --pp-toggle-height: calc(var(--pp-toggle-size) * 1.14);
  --pp-toggle-gap: clamp(10px, 1.8vh, 18px);
  --pp-toggle-hide-offset: calc(var(--pp-toggle-size) * 0.78);
  --pp-activation-radius: clamp(90px, 8vw, 160px);
  --pp-collapsed-x: calc(-1 * var(--pp-toggle-hide-offset));
}

/* theme variables set by JS */
body, html, .flexrow.app { background: var(--pp-bg) !important; color: var(--pp-text) !important; }
.panelblock, .left-panel, .right-panel, .tools-panel, .topbar, .toolbar {
  background: var(--pp-panel) !important; color: var(--pp-text) !important; border-color: var(--pp-border) !important;
  box-shadow: var(--pp-shadow) !important;
}

/* ---------------- EXTREMELY AGGRESSIVE RULES FOR PRE-IMPORT / HOME / LAUNCHER ITEMS --------------
   These rules use many selector variants and !important flags to override Photopea's low-opacity
   / faint label styling. They target lists, launcher panels, left-panel shortcuts, home lists, etc.
   ---------------------------------------------------------------------------------------------*/

/* target many class name variants that appear in Photopea markup */
[class*="home"], [class*="Home"], .pp-home, .panelblock.home, .home-panel, .home-list,
.files-sources, .file-source-panel, .file-source-item, .open-panel, .pp-launcher, .pp-launcher * ,
.left-panel .launcher, .panelblock .launcher, .list-item, .list-item * , .launcher-item, .launcher-item * {
  color: var(--pp-text) !important;
  opacity: 1 !important;
  -webkit-text-fill-color: var(--pp-text) !important; /* for WebKit text fill */
  mix-blend-mode: normal !important;
  filter: none !important;
  text-shadow: none !important;
}

/* Target very specific label spans that Photopea often uses */
.pp-launcher .label, .pp-launcher .text, .pp-launcher .title, .home-list .item .label,
.home-list .item .text, .panelblock.home .list-item .label, .panelblock.home .list-item span,
.panelblock.home .hint, .panelblock.home .muted {
  color: var(--pp-text) !important;
  opacity: 1 !important;
  -webkit-text-fill-color: var(--pp-text) !important;
  mix-blend-mode: normal !important;
  filter: none !important;
  text-shadow: none !important;
}

/* Make sure anchor/button based items are also visible */
.panelblock.home a, .panelblock.home button, .panelblock.home [role="button"], .home-list a, .home-list button,
.file-source-item a, .file-source-item button, .pp-launcher a, .pp-launcher button {
  color: var(--pp-text) !important;
  opacity: 1 !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--pp-text) !important;
  mix-blend-mode: normal !important;
  filter: none !important;
}

/* Force icons / svgs / paths / imgs to use readable fill/stroke */
.panelblock.home img, .panelblock.home svg, .home-list img, .home-list svg, .file-source-item img, .file-source-item svg,
.pp-launcher img, .pp-launcher svg, .launcher-item svg, .launcher-item img, .left-panel img, .left-panel svg {
  opacity: 1 !important;
  filter: none !important;
  mix-blend-mode: normal !important;
}
.panelblock.home svg path, .panelblock.home svg g, .pp-launcher svg path, .pp-launcher svg g,
.left-panel svg path, .left-panel svg g {
  fill: var(--pp-text) !important;
  stroke: var(--pp-text) !important;
  opacity: 1 !important;
}

/* subtle hover highlight so items remain readable when focused */
.panelblock.home .list-item:hover, .home-list .item:hover, .file-source-item:hover, .pp-launcher .item:hover {
  background: rgba(0,0,0,0.05) !important;
}

/* Ensure the theme toggle arrow retains its stroke and animation (defensive) */
#pp-theme-toggle svg, #pp-theme-toggle svg path {
  stroke: currentColor !important;
  fill: none !important;
  opacity: 1 !important;
  mix-blend-mode: normal !important;
}

/* toggle UI */
#pp-theme-toggle { position: fixed; left: var(--pp-toggle-gap); bottom: var(--pp-toggle-gap); z-index:2147483646 !important; height:var(--pp-toggle-height); min-width:var(--pp-toggle-size); max-width:clamp(160px,32vw,520px); padding:6px 12px; display:inline-flex; align-items:center; justify-content:center; gap:8px; background:var(--pp-panel); color:var(--pp-text); border-radius:calc(var(--pp-toggle-height)/2); border:1px solid rgba(255,255,255,0.04); box-shadow:0 8px 26px rgba(0,0,0,0.48); cursor:pointer; user-select:none; transform:translateX(var(--pp-collapsed-x)); transition:opacity 140ms ease; overflow:visible; white-space:nowrap; }
#pp-theme-toggle.collapsed { transform:translateX(var(--pp-collapsed-x)); width:var(--pp-toggle-size); padding-left:8px; padding-right:8px; }
#pp-theme-toggle.expanded { transform:translateX(0); width:auto; padding-left:12px; padding-right:16px; }

/* bounce animations (applied by JS during show/hide) */
@keyframes ppBounceOut { 0%{ transform: translateX(var(--pp-collapsed-x)); } 55%{ transform: translateX(6%); } 80%{ transform: translateX(-3%); } 100%{ transform: translateX(0); } }
@keyframes ppBounceIn  { 0%{ transform: translateX(0); } 50%{ transform: translateX(3%); } 100%{ transform: translateX(var(--pp-collapsed-x)); } }

#pp-theme-toggle.anim-out { animation: ppBounceOut 520ms cubic-bezier(.2, .8, .25, 1); }
#pp-theme-toggle.anim-in  { animation: ppBounceIn 420ms cubic-bezier(.4, 0, 2, 1); }

#pp-theme-toggle svg { width: calc(var(--pp-toggle-size) * 0.56); height: calc(var(--pp-toggle-size) * 0.56); display:block; flex-shrink:0; }
#pp-theme-toggle .label { display:none; font-weight:600; font-size:13px; color:var(--pp-muted); white-space:nowrap; }
@media (min-width:680px) { #pp-theme-toggle.expanded .label { display:inline-block; } }

/* subtle pulse */
#pp-theme-toggle.collapsed .pulse { animation: ppPulse 2.6s infinite; opacity:0.85; }
@keyframes ppPulse { 0%{ transform: translateX(0) scale(1); } 50%{ transform: translateX(1px) scale(1.02); } 100%{ transform: translateX(0) scale(1); } }

/* Theme menu */
#pp-theme-menu { position: fixed; min-width:160px; border-radius:8px; padding:6px; background:var(--pp-panel); color:var(--pp-text); box-shadow:0 8px 30px rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.12); z-index:2147483647; font:13px/1 system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
#pp-theme-menu > div { padding:8px 10px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:8px; }
#pp-theme-menu > div:hover { background: rgba(255,255,255,0.02); }
`;
  (document.head || document.documentElement).appendChild(css);

  /* ========================= UI: toggle + menu ========================== */
  function createToggle() {
    if (document.getElementById('pp-theme-toggle')) return document.getElementById('pp-theme-toggle');
    const btn = document.createElement('button');
    btn.id = 'pp-theme-toggle'; btn.type = 'button'; btn.setAttribute('aria-label', 'Photopea theme toggle'); btn.classList.add('collapsed');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"></path></svg><span class="label"></span>`;
    btn.addEventListener('click', () => { const curId = getSavedThemeId() || THEMES[0].id; const idx = Math.max(0, THEMES.findIndex(t => t.id === curId)); const next = THEMES[(idx + 1) % THEMES.length]; applyTheme(next); saveThemeId(next.id); refreshToggleLabel(next.name); }, { passive: true });
    btn.addEventListener('contextmenu', (ev) => { ev.preventDefault(); showQuickMenu(ev.clientX, ev.clientY); });
    btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); btn.click(); } });
    document.documentElement.appendChild(btn);
    refreshToggleLabel(findThemeById(getSavedThemeId()).name);
    return btn;
  }
  function refreshToggleLabel(name) { const label = document.querySelector('#pp-theme-toggle .label'); if (label) label.textContent = name; }
  function showQuickMenu(x, y) {
    const old = document.getElementById('pp-theme-menu'); if (old) old.remove();
    const menu = document.createElement('div'); menu.id = 'pp-theme-menu';
    const safeX = Math.max(6, Math.min(x, window.innerWidth - 180)); const safeY = Math.max(6, Math.min(y, window.innerHeight - 300));
    menu.style.left = `${safeX}px`; menu.style.top = `${safeY}px`;
    THEMES.forEach(t => {
      const item = document.createElement('div'); item.textContent = t.name;
      const dot = document.createElement('span'); dot.style.width = '12px'; dot.style.height = '12px'; dot.style.borderRadius = '50%'; dot.style.background = t.vars['--pp-accent']; item.appendChild(dot);
      item.addEventListener('click', () => { applyTheme(t); saveThemeId(t.id); refreshToggleLabel(t.name); menu.remove(); }, { passive: true });
      menu.appendChild(item);
    });
    function removeMenu() { menu.remove(); document.removeEventListener('mousedown', removeMenu); document.removeEventListener('scroll', removeMenu, true); }
    document.addEventListener('mousedown', removeMenu); document.addEventListener('scroll', removeMenu, true);
    document.documentElement.appendChild(menu);
  }

  /* ========================= ROBUST JS FIXER (backup) ========================== */
  const TARGET_LABELS = [
    'home','this device','peadrive','dropbox','onedrive','google drive',
    'peagames','photopea','vectorpea','jampea'
  ];

  function enforceReadableStyles(el) {
    try {
      el.style.setProperty('color', 'var(--pp-text)', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('mixBlendMode', 'normal', 'important');
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('textShadow', 'none', 'important');
      el.style.setProperty('-webkit-text-fill-color', 'var(--pp-text)', 'important');

      const container = el.closest('button, a, [role="button"], .file-source-item, .home-list .item, .list-item, .pp-launcher .item, .file-source-panel');
      if (container) {
        container.style.setProperty('color', 'var(--pp-text)', 'important');
        container.style.setProperty('opacity', '1', 'important');
        container.style.setProperty('filter', 'none', 'important');
        container.style.setProperty('mixBlendMode', 'normal', 'important');
      }

      // target likely label spans inside
      const labelCandidates = Array.from((container || el).querySelectorAll('span, div, p, b, i')) || [];
      labelCandidates.forEach(n => {
        const txt = (n.textContent || '').trim();
        if (txt.length > 0 && txt.length < 80) {
          n.style.setProperty('color', 'var(--pp-text)', 'important');
          n.style.setProperty('opacity', '1', 'important');
          n.style.setProperty('-webkit-text-fill-color', 'var(--pp-text)', 'important');
          n.style.setProperty('mixBlendMode', 'normal', 'important');
          n.style.setProperty('filter', 'none', 'important');
        }
      });

      // SVG paths / imgs
      const icons = Array.from((container || el).querySelectorAll('svg, path, img')) || [];
      icons.forEach(icon => {
        try {
          icon.style.setProperty('opacity', '1', 'important');
          icon.style.setProperty('filter', 'none', 'important');
          icon.style.setProperty('mixBlendMode', 'normal', 'important');
          if (icon instanceof SVGElement || /svg|path/i.test(icon.tagName)) {
            icon.style.setProperty('fill', 'var(--pp-text)', 'important');
            icon.style.setProperty('stroke', 'var(--pp-text)', 'important');
          }
        } catch (e) {}
      });
    } catch (e) { /* non-fatal */ }
  }

  function fixHomeButtons() {
    try {
      const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
          const txt = (node.textContent || '').trim();
          if (!txt || txt.length < 2 || txt.length > 80) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);

      let node;
      const seen = new WeakSet();
      while ((node = walker.nextNode())) {
        const raw = (node.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase();
        for (const label of TARGET_LABELS) {
          if (raw === label || raw.startsWith(label + ' ') || raw.indexOf(' ' + label + ' ') >= 0 || raw.endsWith(' ' + label)) {
            if (!seen.has(node)) {
              enforceReadableStyles(node);
              if (node.parentElement) enforceReadableStyles(node.parentElement);
              const anc = node.closest('.panelblock, .pp-launcher, .home-list, .left-panel, .panel-home, .file-source-panel');
              if (anc) enforceReadableStyles(anc);
              seen.add(node);
            }
            break;
          }
        }
      }
    } catch (e) {
      console.warn('[ghostlybliss] fixHomeButtons error', e);
    }
  }

  // debounce + observer + fallback interval
  let fixTimer = null;
  function scheduleFix(delay = 80) { clearTimeout(fixTimer); fixTimer = setTimeout(() => { fixHomeButtons(); }, delay); }
  scheduleFix(40);

  const homeObserver = new MutationObserver(() => scheduleFix(120));
  homeObserver.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: false });

  let fallbackRuns = 0;
  const fallbackInterval = setInterval(() => { try { fixHomeButtons(); } catch(e){} fallbackRuns++; if (fallbackRuns > 50) clearInterval(fallbackInterval); }, 250);

  /* ========================= PROXIMITY / TOGGLE LOGIC ========================== */
  let toggleEl = null;
  let hideTimeout = null;
  let proxActive = false;
  const HIDE_DELAY = 1100;

  function ensureToggle() { if (!toggleEl) toggleEl = createToggle(); return toggleEl; }

  function showToggleTemporary() {
    const t = ensureToggle(); if (!t) return;
    const wasCollapsed = t.classList.contains('collapsed');
    t.classList.remove('collapsed'); t.classList.add('expanded');
    t.querySelector('svg')?.classList.remove('pulse');
    if (wasCollapsed) { t.classList.add('anim-out'); setTimeout(() => t.classList.remove('anim-out'), 700); }
    clearTimeout(hideTimeout);
  }

  function hideToggleIfAllowed() {
    const t = ensureToggle(); if (!t) return;
    if (t.matches(':hover') || proxActive) return;
    t.classList.add('anim-in');
    setTimeout(() => { t.classList.remove('anim-in'); t.classList.remove('expanded'); t.classList.add('collapsed'); t.querySelector('svg')?.classList.add('pulse'); }, 420);
  }

  function scheduleHide() { clearTimeout(hideTimeout); hideTimeout = setTimeout(() => { hideToggleIfAllowed(); }, HIDE_DELAY); }

  function handleMouseMove(e) {
    ensureToggle();
    const vw = window.innerWidth, vh = window.innerHeight;
    const bottomGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pp-toggle-gap')) || 12;
    const anchorX = 0; const anchorY = vh - bottomGap;
    const dx = e.clientX - anchorX; const dy = e.clientY - anchorY;
    const dist = Math.hypot(dx, dy);
    const activation = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pp-activation-radius')) || Math.min(140, Math.max(90, vw * 0.08));
    const nearLeftEdge = (e.clientX <= Math.max(36, Math.min(80, vw * 0.03)));
    if (dist <= activation || nearLeftEdge) { proxActive = true; showToggleTemporary(); } else { proxActive = false; scheduleHide(); }
  }
  function handleMouseEnter() { proxActive = true; showToggleTemporary(); }
  function handleMouseLeave() { proxActive = false; scheduleHide(); }

  function attachProximityListeners() {
    ensureToggle();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const t = document.getElementById('pp-theme-toggle');
    if (t) { t.addEventListener('mouseenter', handleMouseEnter, { passive: true }); t.addEventListener('mouseleave', handleMouseLeave, { passive: true }); }
  }

  /* ========================= INIT ========================== */
  (function init() {
    const savedId = getSavedThemeId();
    const theme = findThemeById(savedId || THEMES[0].id);
    applyTheme(theme);
    requestAnimationFrame(() => {
      createToggle();
      attachProximityListeners();
      const t = document.getElementById('pp-theme-toggle');
      if (t) { t.classList.add('collapsed'); t.querySelector('svg')?.classList.add('pulse'); }
      // run fixer after UI mounts
      setTimeout(() => fixHomeButtons(), 120);
    });
    console.log('%c[ghostlybliss] Photopea True Fullscreen v1.1.8 — P1NK theme active + ultra-aggressive pre-import label fixes.', 'color:#ff8abf;font-weight:bold;');
  })();

})();
