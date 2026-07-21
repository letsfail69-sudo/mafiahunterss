(function(){
  "use strict";
  function init(){
    var main=document.getElementById("main");
    var side=main && main.querySelector(".side");
    if(main && side && !main.querySelector(".mobile-nav-toggle")){
      var b=document.createElement("button"); b.type="button"; b.className="mobile-nav-toggle";
      b.textContent="☰ Navigace wiki"; b.setAttribute("aria-expanded","false");
      b.addEventListener("click",function(){ var open=main.classList.toggle("mobile-nav-open"); b.setAttribute("aria-expanded",String(open)); b.textContent=open?"✕ Zavřít navigaci":"☰ Navigace wiki"; });
      main.insertBefore(b, main.firstChild);
    }
    var groups=document.querySelectorAll("#main .side .group");
    groups.forEach(function(g,i){
      var key="mh-wiki-group-"+i;
      if(localStorage.getItem(key)==="1"){g.classList.add("on");g.setAttribute("aria-expanded","true");}
      function toggle(){var on=g.classList.toggle("on");g.setAttribute("aria-expanded",String(on));localStorage.setItem(key,on?"1":"0");}
      g.addEventListener("click",toggle);
      g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle();}});
    });
    var current=document.querySelector("#main .side li.current");
    if(current){var menu=current.closest("ul.menu"); if(menu && menu.previousElementSibling && menu.previousElementSibling.classList.contains("group")){menu.previousElementSibling.classList.add("on");menu.previousElementSibling.setAttribute("aria-expanded","true");}}
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
