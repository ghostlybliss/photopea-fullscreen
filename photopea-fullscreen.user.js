// ==UserScript==
// @name         Photopea True Fullscreen
// @namespace    https://github.com/ghostlybliss
// @version      1.1.4
// @description  Removes the gray ad sidebar on Photopea.com. Tested 21st Feb. 2026
// @author       ghostlybliss
// @match        https://www.photopea.com/*
// @match        https://photopea.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/ghostlybliss/Photopea-Fullscreen-2026
// @supportURL   https://github.com/ghostlybliss/Photopea-Fullscreen-2026/issues
// @downloadURL  https://raw.githubusercontent.com/ghostlybliss/Photopea-Fullscreen-2026/main/photopea-fullscreen.user.js
// @updateURL    https://raw.githubusercontent.com/ghostlybliss/Photopea-Fullscreen-2026/main/photopea-fullscreen.user.js
// ==/UserScript==

/*
 * ─────────────────────────────────────────────
 *  Photopea True Fullscreen
 *  Version 1.1.4 — February 21, 2026
 * ─────────────────────────────────────────────
 *
 *  Author:      ghostlybliss
 *               https://github.com/ghostlybliss
 *
 *  Credits:
 *    - Debug session between Claude + Grok
 *    - Community: Greasy Fork scripts by various authors (innerWidth
 *      trick originally documented ca. 2024)
 *    - Photopea GitHub issues #7931, #8207, #8214, #8235 — community
 *      reports that informed selector & timing decisions
 *
 *  License: MIT
 * ─────────────────────────────────────────────
 */

(function () {
    'use strict';

    const SPOOF_ADD = 350;   // tweak to 320 or 380 only if needed

    function applySpoof() {
        const getSpoofed = () => (document.documentElement?.offsetWidth ?? 1920) + SPOOF_ADD;

        // Main spoof
        Object.defineProperty(window, 'innerWidth', {
            get: getSpoofed,
            configurable: true,
            enumerable: true
        });

        // Extra properties Photopea sometimes reads on cold load
        Object.defineProperty(window, 'outerWidth', {
            get: () => getSpoofed() + 80,
            configurable: true
        });

        if (window.screen) {
            Object.defineProperty(window.screen, 'width', {
                get: getSpoofed,
                configurable: true
            });
        }
    }

    // ────── Aggressive early enforcement (still super light) ──────
    applySpoof();                          // document-start
    Promise.resolve().then(applySpoof);    // microtask
    requestAnimationFrame(applySpoof);     // before first paint

    setTimeout(applySpoof, 0);
    setTimeout(applySpoof, 4);
    setTimeout(applySpoof, 16);
    setTimeout(applySpoof, 48);

    // DOMContentLoaded safety net
    document.addEventListener('DOMContentLoaded', () => {
        applySpoof();
        setTimeout(applySpoof, 10);
    });

    // Self-destroying burst — only runs for first 1.2 seconds
    const enforcer = setInterval(applySpoof, 80);
    setTimeout(() => clearInterval(enforcer), 1200);

    // Force Photopea to re-layout immediately
    setTimeout(() => window.dispatchEvent(new Event('resize')), 80);

    console.log('%c[ghostlybliss] Photopea True Fullscreen v1.1.4 — reinforced & instant on Microsoft Edge & Opera GX', 'color:#00ff9d;font-weight:bold;');

})();
