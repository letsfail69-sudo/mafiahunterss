const btn=document.querySelector('.hamb');const menu=document.querySelector('.menu');if(btn&&menu){btn.addEventListener('click',()=>menu.classList.toggle('open'));}
document.querySelectorAll('[data-lightbox]').forEach(img=>{img.style.cursor='zoom-in';img.addEventListener('click',()=>{const box=document.createElement('div');box.className='lightbox open';box.innerHTML=`<img src="${img.src}" alt="${img.alt}">`;box.addEventListener('click',()=>box.remove());document.body.appendChild(box);});});
fetch("news.json")
  .then(response => response.json())
  .then(news => {
    const latestBox = document.getElementById("latest-news");
    const allBox = document.getElementById("all-news");

    if (latestBox) {
      latestBox.innerHTML = news.slice(0, 2).map(item => `
        <div class="news-item">
          <div class="date">${item.date}</div>
          <div>
            <strong>${item.title}</strong><br>
            <span class="muted">${item.text}</span>
          </div>
        </div>
      `).join("");
    }

    if (allBox) {
      allBox.innerHTML = news.map(item => `
        <div class="news-item">
          <div class="date">${item.date}</div>
          <div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
        </div>
      `).join("");
    }
  });
