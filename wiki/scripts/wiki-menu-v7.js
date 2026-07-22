"use strict";

(function () {
  function initWikiMenu() {
    var sidebar = document.querySelector("#main .side");
    if (!sidebar) return;

    var groups = Array.prototype.slice.call(sidebar.querySelectorAll(":scope > .group"));
    var storageKey = "mhwiki-open-group-v7";

    function menuOf(group) {
      var menu = group.nextElementSibling;
      return menu && menu.classList.contains("menu") ? menu : null;
    }

    function setOpen(group, open) {
      var menu = menuOf(group);
      group.classList.toggle("on", open);
      group.setAttribute("aria-expanded", open ? "true" : "false");
      if (menu) {
        menu.classList.toggle("is-open", open);
        menu.hidden = !open;
      }
    }

    function closeAll() {
      groups.forEach(function (group) {
        setOpen(group, false);
      });
    }

    function save(index) {
      try {
        window.localStorage.setItem(storageKey, String(index));
      } catch (error) {}
    }

    function load() {
      try {
        var value = Number(window.localStorage.getItem(storageKey));
        return Number.isInteger(value) ? value : -1;
      } catch (error) {
        return -1;
      }
    }

    function pageName(pathname) {
      var clean = pathname.split("?")[0].split("#")[0];
      if (clean.endsWith("/")) clean += "index.html";
      return clean.split("/").pop() || "index.html";
    }

    var currentPage = pageName(window.location.pathname);
    var currentIndex = -1;

    Array.prototype.slice.call(sidebar.querySelectorAll("ul.menu a[href]")).forEach(function (link) {
      try {
        var target = new URL(link.getAttribute("href"), window.location.href);
        if (target.origin === window.location.origin && pageName(target.pathname) === currentPage) {
          var li = link.closest("li");
          if (li) li.classList.add("current");
          var menu = link.closest("ul.menu");
          var group = menu ? menu.previousElementSibling : null;
          if (group && group.classList.contains("group")) currentIndex = groups.indexOf(group);
        }
      } catch (error) {}
    });

    // Vždy nejdříve zavřít úplně všechny sekce.
    closeAll();

    // Otevřít pouze jednu: naposledy zvolenou, případně sekci aktuální stránky.
    var storedIndex = load();
    var initialIndex = storedIndex >= 0 && storedIndex < groups.length ? storedIndex : currentIndex;
    if (initialIndex >= 0 && groups[initialIndex]) setOpen(groups[initialIndex], true);

    groups.forEach(function (group, index) {
      group.setAttribute("role", "button");
      group.setAttribute("tabindex", "0");

      function toggle() {
        var open = !group.classList.contains("on");
        closeAll();
        if (open) {
          setOpen(group, true);
          save(index);
        } else {
          save(-1);
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWikiMenu);
  } else {
    initWikiMenu();
  }
})();
