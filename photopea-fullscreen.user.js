// ==UserScript==
// @name         Photopea True Fullscreen - Gray Sidebar Killer
// @namespace    https://github.com/visij
// @version      2.3
// @description  Permanently removes gray ad sidebar (left OR right) + forces true fullscreen editor. Works with or without adblockers. Feb 21 2026.
// @author       visij (deeply revised with Grok)
// @match        https://www.photopea.com/*
// @match        https://photopea.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://github.com/visij/photopea-fullscreen
// @supportURL   https://github.com/visij/photopea-fullscreen/issues
// ==/UserScript==

(function () {
    'use strict';

    // 1. CORE TRICK — Fool Photopea’s layout engine (still #1 method in 2026)
    Object.defineProperty(window, 'innerWidth', {
        get() { return document.documentElement.offsetWidth + 350; },
        configurable: true
    });

    // 2. SURGICAL CSS — covers right (nth-child 2) + left A/B test (nth-child n+2)
    GM_addStyle(`
        /* Ad sidebar slot — ANY non-main panel in the flexrow (safe even if layout changes) */
        body > div.flexrow.app > div:nth-child(n+2) {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            flex: 0 0 0 !important;
        }

        /* Known ad iframes — URL-based only (zero false positives) */
        iframe[src*="doubleclick"],
        iframe[src*="googlesyndication"],
        iframe[src*="adnxs"],
        iframe[src*="adsystem"] {
            display: none !important;
            width: 0 !important;
        }

        /* Force main editor full width */
        body > div.flexrow.app > div:first-child,
        body > div.flexrow.app > div:first-child > div.flexrow > div.panelblock.mainblock,
        .mainblock {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 1 auto !important;
        }

        html, body, .app, .flexrow {
            width: 100% !important;
            overflow-x: hidden !important;
        }
    `);

    // 3. SMART OBSERVER — only hides actual sidebar panels (width + content check)
    const observer = new MutationObserver(() => {
        const app = document.querySelector('body > div.flexrow.app');
        if (!app) return;

        app.querySelectorAll(':scope > div:nth-child(n+2)').forEach(panel => {
            const w = panel.offsetWidth;
            const isMain = panel.querySelector('.mainblock, .panelblock.mainblock');
            if (w < 400 && !isMain) {
                panel.style.cssText = 'display:none!important;width:0!important;min-width:0!important;max-width:0!important;flex:0 0 0!important;';
            }
        });

        // Force main panel full width
        const main = app.querySelector(':scope > div:first-child');
        if (main) main.style.setProperty('width', '100%', 'important');
    });

    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
    });

    // 4. SAFETY TRIGGERS — covers every possible load/resize scenario
    function applyFix() {
        const app = document.querySelector('body > div.flexrow.app');
        if (!app) return;

        const main = app.querySelector(':scope > div:first-child');
        if (main) main.style.setProperty('width', '100%', 'important');
    }

    window.addEventListener('load', applyFix);
    window.addEventListener('resize', applyFix);
    [200, 600, 1200, 2500].forEach(t => setTimeout(applyFix, t));

    console.log('%c[visij] Photopea True Fullscreen v2.3 — Gray sidebar permanently gone! 🎨', 'color:#00ff9d;font-weight:bold;');
})();