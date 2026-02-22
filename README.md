<div align="center">
  <img src="https://www.photopea.com/promo/icon512.png" width="72" alt="Photopea"/>
  <h1>Photopea True Fullscreen</h1>
  <p><strong>Removes the gray ad sidebar on <a href="https://www.photopea.com">Photopea.com</a></strong><br>
  Works with & without adblockers.</p>

  <a href="https://greasyfork.org/en/scripts/567062-photopea-true-fullscreen">
    <img src="https://img.shields.io/badge/Install_from-GreasyFork-00ff9d?style=flat-square&logo=greasyfork&logoColor=white" alt="Install from Greasy Fork">
  </a>
  <a href="https://github.com/ghostlybliss/Photopea-Fullscreen-2026e/releases">
    <img src="https://img.shields.io/badge/version-1.1-00ff9d?style=flat-square&labelColor=111" alt="Version 1.1">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-00ff9d?style=flat-square&labelColor=111" alt="MIT License">
  </a>
  <a href="https://www.tampermonkey.net">
    <img src="https://img.shields.io/badge/Tampermonkey-compatible-00ff9d?style=flat-square&labelColor=111" alt="Tampermonkey compatible">
  </a>
</div>

---

<img width="2559" height="1237" alt="Photopea True Fullscreen — clean editor" 
     src="https://github.com/user-attachments/assets/486ba41b-40cd-4024-9bb6-c21be97045c8" />

**Photopea reserves a ~320px column on the right (sometimes left) for ads — even when you have an adblocker.**  
This script uses a single `innerWidth` spoof to make Photopea think your window is wider than its sidebar threshold.  
**It never allocates the space to begin with.**

No CSS fighting. No MutationObserver loops. No synthetic resize events. One property override. That's it.

---

## Install -

### Option 1 — One-Click (Recommended)
[![Install from Greasy Fork](https://img.shields.io/badge/Install_from-GreasyFork-00ff9d?style=for-the-badge&logo=greasyfork&logoColor=white)](https://greasyfork.org/en/scripts/567062-photopea-true-fullscreen)

### Option 2 — Direct from GitHub
[Click here to install](https://raw.githubusercontent.com/ghostlybliss/Photopea-Fullscreen-2026e/main/photopea-fullscreen.user.js)

### Option 3 — Manual
1. Open Tampermonkey / Violentmonkey Dashboard  
2. Click **+** (create new script)  
3. Paste the contents of [`photopea-fullscreen.user.js`](photopea-fullscreen.user.js)  
4. Save → hard refresh Photopea (`Ctrl + Shift + R`)

---

## How it works

Photopea checks your browser window size the instant the page loads.  
If it thinks the window is “too narrow”, it adds a big gray ad column on the side — even if you use an ad blocker.

This script tricks Photopea by quietly telling it:  
**“Actually, your window is 350 pixels wider than it really is.”**

Because of that little white lie, Photopea never creates the gray sidebar at all.  
No hiding, no fighting, no flickering — it’s just… never there.

We made the trick extra fast on first load (especially for Edge and Opera GX), so it works perfectly the very first time you open Photopea — no refresh needed.

One tiny lie → completely clean fullscreen. That’s the whole magic.

---

## Source Code & Support

- Full source + updates: [github.com/ghostlybliss/Photopea-Fullscreen-2026e](https://github.com/ghostlybliss/Photopea-Fullscreen-2026e)
- Report issues: [GitHub Issues](https://github.com/ghostlybliss/Photopea-Fullscreen-2026e/issues)
- Greasy Fork page: [greasyfork.org/scripts/567062](https://greasyfork.org/en/scripts/567062-photopea-true-fullscreen)

Enjoy your clean Photopea! 🚀
