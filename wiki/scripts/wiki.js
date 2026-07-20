
document.addEventListener('DOMContentLoaded',()=>{
 const navToggle=document.querySelector('.nav-toggle');
 const nav=document.querySelector('.site-nav');
 navToggle?.addEventListener('click',()=>nav?.classList.toggle('open'));
 const wikiToggle=document.querySelector('.mobile-wiki-button');
 const side=document.querySelector('.side');
 wikiToggle?.addEventListener('click',()=>side?.classList.toggle('open'));
 const search=document.querySelector('#wiki-search');
 search?.addEventListener('input',()=>{
   const q=search.value.toLocaleLowerCase('cs').trim();
   document.querySelectorAll('.side .menu li').forEach(li=>{
     const show=!q||li.textContent.toLocaleLowerCase('cs').includes(q);
     li.style.display=show?'':'none';
     if(show&&q){const menu=li.closest('.menu'); menu.style.display='block'; menu.previousElementSibling?.classList.add('on');}
   });
 });
 const page=(location.pathname.split('/').pop()||'index.html');
 document.querySelectorAll('.side a').forEach(a=>{if(a.getAttribute('href')===page){a.parentElement?.classList.add('current');const m=a.closest('.menu');m?.previousElementSibling?.classList.add('on');if(m)m.style.display='block';}});
});
