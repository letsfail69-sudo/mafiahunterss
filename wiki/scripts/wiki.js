"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.querySelector("#main .side");
  if (!sidebar) return;

  var groups = Array.prototype.slice.call(sidebar.querySelectorAll(".group"));
  var storageKey = "mhwiki-open-group";

  function getMenu(group) {
    var menu = group.nextElementSibling;
    return menu && menu.classList.contains("menu") ? menu : null;
  }

  function setState(group, open) {
    var menu = getMenu(group);
    group.classList.toggle("on", open);
    group.setAttribute("aria-expanded", open ? "true" : "false");
    if (menu) {
      menu.hidden = !open;
      menu.style.display = open ? "block" : "none";
    }
  }

  function closeAll() {
    groups.forEach(function (group) { setState(group, false); });
  }

  function readStoredIndex() {
    try {
      var value = localStorage.getItem(storageKey);
      if (value === null) return null;
      var index = Number(value);
      return Number.isInteger(index) ? index : null;
    } catch (error) {
      return null;
    }
  }

  function saveStoredIndex(index) {
    try { localStorage.setItem(storageKey, String(index)); } catch (error) {}
  }

  function fileName(pathname) {
    if (pathname.endsWith("/")) pathname += "index.html";
    return pathname.split("/").pop() || "index.html";
  }

  var currentFile = fileName(window.location.pathname);
  var currentGroupIndex = -1;

  Array.prototype.slice.call(sidebar.querySelectorAll("a[href]")).forEach(function (link) {
    try {
      var target = new URL(link.getAttribute("href"), window.location.href);
      if (target.origin === window.location.origin && fileName(target.pathname) === currentFile) {
        var item = link.closest("li");
        if (item) item.classList.add("current");
        var menu = link.closest("ul.menu");
        if (menu && menu.previousElementSibling && menu.previousElementSibling.classList.contains("group")) {
          currentGroupIndex = groups.indexOf(menu.previousElementSibling);
        }
      }
    } catch (error) {}
  });

  var storedIndex = readStoredIndex();
  var openIndex = storedIndex !== null && storedIndex >= 0 && storedIndex < groups.length
    ? storedIndex
    : currentGroupIndex;
  if (openIndex < 0 && groups.length) openIndex = 0;

  closeAll();
  if (openIndex >= 0 && groups[openIndex]) setState(groups[openIndex], true);

  groups.forEach(function (group, index) {
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");

    function toggle() {
      var shouldOpen = !group.classList.contains("on");
      closeAll();
      if (shouldOpen) {
        setState(group, true);
        saveStoredIndex(index);
      } else {
        saveStoredIndex(-1);
      }
    }

    group.addEventListener("click", toggle);
    group.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });

  var helicopter = document.getElementById("helicopter");
  var heli = document.getElementById("heli");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (helicopter && heli && !reduceMotion && getComputedStyle(helicopter).display !== "none") {
    var current = Number(heli.getAttribute("data-left") || -100);
    var frame = Number(heli.getAttribute("data-frame") || -1);
    window.setInterval(function () {
      current -= 5;
      frame += 1;
      if (current < -100 && Math.random() < 0.03) current = helicopter.offsetWidth + 100;
      if (frame > 2) frame = 0;
      heli.setAttribute("data-left", String(current));
      heli.setAttribute("data-frame", String(frame));
      heli.style.left = current + "px";
      heli.style.backgroundPosition = (-frame * 83) + "px 0";
    }, 60);
  }
});
