/**
 * Lightweight EN/FR language switcher.
 * Swaps the text of every [data-i18n] element using the dictionary in
 * assets/js/translations.js, persists the choice in localStorage, and
 * keeps it in sync across page navigations.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "gc-lang";
  const DEFAULT_LANG = "en";

  function getStoredLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "fr" || stored === "en" ? stored : DEFAULT_LANG;
  }

  function setStoredLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function getTranslation(lang, key) {
    const dict = window.translations && window.translations[lang];
    if (!dict) return undefined;
    return key.split(".").reduce(function (obj, part) {
      return obj && typeof obj === "object" ? obj[part] : undefined;
    }, dict);
  }

  function applyLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const value = getTranslation(lang, key);
      if (value === undefined || value === null) return;

      const attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll(".lang-select").forEach(function (select) {
      select.value = lang;
    });

    document.documentElement.setAttribute("lang", lang);
  }

  function initLangToggle() {
    const lang = getStoredLang();
    applyLanguage(lang);

    document.querySelectorAll(".lang-select").forEach(function (select) {
      select.addEventListener("change", function () {
        const newLang = select.value;
        if (newLang === getStoredLang()) return;
        setStoredLang(newLang);
        applyLanguage(newLang);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangToggle);
  } else {
    initLangToggle();
  }
})();
