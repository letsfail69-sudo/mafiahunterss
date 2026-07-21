"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector("#main .side");

  if (!sidebar) {
    return;
  }

  const groups = Array.from(sidebar.querySelectorAll(".group"));
  const storageKey = "mhwiki-open-group";

  function readStoredIndex() {
    try {
      const value = window.localStorage.getItem(storageKey);

      if (value === null) {
        return null;
      }

      const index = Number(value);
      return Number.isInteger(index) ? index : null;
    } catch (error) {
      return null;
    }
  }

  function saveStoredIndex(index) {
    try {
      window.localStorage.setItem(storageKey, String(index));
    } catch (error) {
      // Menu zůstane funkční i bez localStorage.
    }
  }

  function getMenuForGroup(group) {
    const menu = group.nextElementSibling;

    if (menu && menu.classList.contains("menu")) {
      return menu;
    }

    return null;
  }

  function setGroupState(group, open) {
    const menu = getMenuForGroup(group);

    group.classList.toggle("on", open);
    group.setAttribute("aria-expanded", open ? "true" : "false");

    if (menu) {
      menu.hidden = !open;
      menu.style.display = open ? "block" : "none";
    }
  }

  function closeAllGroups() {
    groups.forEach(function (group) {
      setGroupState(group, false);
    });
  }

  function normalizePath(pathname) {
    let path = pathname;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    return path.split("/").pop() || "index.html";
  }

  const currentFile = normalizePath(window.location.pathname);
  const links = Array.from(sidebar.querySelectorAll("a[href]"));

  let currentGroupIndex = -1;

  links.forEach(function (link) {
    try {
      const targetUrl = new URL(link.getAttribute("href"), window.location.href);
      const targetFile = normalizePath(targetUrl.pathname);

      if (
        targetUrl.origin === window.location.origin &&
        targetFile === currentFile
      ) {
        const listItem = link.closest("li");

        if (listItem) {
          listItem.classList.add("current");
        }

        const menu = link.closest("ul.menu");

        if (menu) {
          const group = menu.previousElementSibling;

          if (group && group.classList.contains("group")) {
            currentGroupIndex = groups.indexOf(group);
          }
        }
      }
    } catch (error) {
      // Neplatný nebo externí odkaz přeskočíme.
    }
  });

  const storedIndex = readStoredIndex();

  let openIndex =
    storedIndex !== null &&
    storedIndex >= 0 &&
    storedIndex < groups.length
      ? storedIndex
      : currentGroupIndex;

  if (openIndex < 0 && groups.length > 0) {
    openIndex = 0;
  }

  closeAllGroups();

  if (openIndex >= 0 && groups[openIndex]) {
    setGroupState(groups[openIndex], true);
  }

  groups.forEach(function (group, index) {
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");

    function toggleGroup() {
      const shouldOpen = !group.classList.contains("on");

      closeAllGroups();

      if (shouldOpen) {
        setGroupState(group, true);
        saveStoredIndex(index);
      } else {
        saveStoredIndex(-1);
      }
    }

    group.addEventListener("click", toggleGroup);

    group.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleGroup();
      }
    });
  });

  initializeHelicopter();
});

function initializeHelicopter() {
  const helicopter = document.getElementById("helicopter");
  const heli = document.getElementById("heli");

  if (!helicopter || !heli) {
    return;
  }

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    reduceMotion ||
    window.getComputedStyle(helicopter).display === "none"
  ) {
    return;
  }

  let current = Number(heli.dataset.left || -100);
  let frame = Number(heli.dataset.frame || -1);

  window.setInterval(function () {
    current -= 5;
    frame += 1;

    if (current < -100 && Math.random() < 0.03) {
      current = helicopter.offsetWidth + 100;
    }

    if (frame > 2) {
      frame = 0;
    }

    heli.dataset.left = String(current);
    heli.dataset.frame = String(frame);
    heli.style.left = current + "px";
    heli.style.backgroundPosition = -frame * 83 + "px 0";
  }, 60);
}
