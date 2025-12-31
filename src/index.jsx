// ============================================
// COOKINSAINTS™ - REACT ENTRY POINT
// Where Hustlers Build Wealth
// ============================================

import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import CookinSaintsApp from "./main"

// Mount the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookinSaintsApp />
  </React.StrictMode>,
)

// Register service worker for PWA (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failed
    })
  })
}

// Remove initial loader
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("initial-loader")
    if (loader) {
      loader.classList.add("hidden")
    }
  }, 100)
})
