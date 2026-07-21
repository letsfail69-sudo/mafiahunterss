(function ($) {
  "use strict";

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // The menu still works when storage is unavailable (for example on file://).
    }
  }

  function setGroupState($group, open) {
    $group.toggleClass("on", open).attr("aria-expanded", open ? "true" : "false");
  }

  $(function () {
    var $groups = $("#main .side .group");
    var $links = $("#main .side a[href]");
    var currentUrl = new URL(window.location.href);
    var currentPath = currentUrl.pathname.endsWith("/")
      ? currentUrl.pathname + "index.html"
      : currentUrl.pathname;
    var $currentLink = $links.filter(function () {
      return new URL(this.getAttribute("href"), currentUrl).pathname === currentPath;
    }).first();

    $currentLink.parent().addClass("current");

    var currentGroupIndex = $groups.index($currentLink.closest("ul.menu").prev(".group"));
    var storageKey = "mhwiki-open:" + currentPath;
    var storedIndex = storageGet(storageKey);
    var openIndex = storedIndex === null ? currentGroupIndex : Number(storedIndex);

    if (!Number.isInteger(openIndex) || openIndex < -1 || openIndex >= $groups.length) {
      openIndex = currentGroupIndex;
    }

    $groups.each(function (index) {
      setGroupState($(this), index === openIndex);
    });

    $groups.on("click", function () {
      var $selected = $(this);
      var selectedIndex = $groups.index(this);
      var shouldOpen = !$selected.hasClass("on");

      $groups.each(function () {
        setGroupState($(this), false);
      });
      setGroupState($selected, shouldOpen);
      storageSet(storageKey, String(shouldOpen ? selectedIndex : -1));
    });

    $groups.on("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        $(this).trigger("click");
      }
    });

    var $helicopter = $("#helicopter");
    var $heli = $("#heli");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ($helicopter.length && $heli.length && $helicopter.css("display") !== "none" && !reduceMotion) {
      window.setInterval(function () {
        var current = Number($heli.attr("data-left")) - 5;
        var frame = Number($heli.attr("data-frame")) + 1;

        if (current < -100 && Math.random() < 0.03) {
          current = $helicopter.width() + 100;
        }
        if (frame > 2) {
          frame = 0;
        }

        $heli
          .attr("data-left", current)
          .attr("data-frame", frame)
          .css({ left: current, "background-position": -frame * 83 + "px 0" });
      }, 60);
    }
  });
})(jQuery);
