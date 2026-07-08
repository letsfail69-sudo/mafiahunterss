/* GOOGLE ANALYTICS */
const gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-BD4VKYXBTL";
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "G-BD4VKYXBTL");


const btn = document.querySelector('.hamb');
const menu = document.querySelector('.menu');

if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}

document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
        const box = document.createElement('div');
        box.className = 'lightbox open';

        box.innerHTML = `
            <img src="${img.src}" alt="${img.alt}">
        `;

        box.addEventListener('click', () => {
            box.remove();
        });

        document.body.appendChild(box);
    });
});

/* KLASICKÉ NOVINKY WEBU */
fetch("news.json")
    .then(response => response.json())
    .then(news => {
        const latestBox = document.getElementById("latest-news");
        const allBox = document.getElementById("all-news");

        if (latestBox) {
            latestBox.innerHTML = news.slice(0, 3).map(item => `
                <div class="card">
                    <p class="muted">${item.date}</p>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `).join("");
        }

        if (allBox) {
            allBox.innerHTML = news.map(item => `
                <div class="card">
                    <p class="muted">${item.date}</p>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `).join("");
        }
    })
    .catch(() => {
        const latestBox = document.getElementById("latest-news");
        const allBox = document.getElementById("all-news");

        if (latestBox) {
            latestBox.innerHTML = `<p class="muted">Novinky se nepodařilo načíst.</p>`;
        }

        if (allBox) {
            allBox.innerHTML = `<p class="muted">Novinky se nepodařilo načíst.</p>`;
        }
    });

/* NOVINKY VE HŘE */
fetch("game-news.json")
    .then(response => response.json())
    .then(news => {
        const latestGameBox = document.getElementById("latest-game-news");
        const gameNewsList = document.getElementById("game-news-list");

        if (latestGameBox) {
            latestGameBox.innerHTML = news.slice(0, 3).map(item => `
                <div class="card">
                    <p class="muted">${item.date} • ${item.category}</p>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `).join("");
        }

        if (gameNewsList) {
            gameNewsList.innerHTML = news.map(item => `
                <div class="card">
                    <p class="muted">${item.date} • ${item.category}</p>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `).join("");
        }
    })
    .catch(() => {
        const latestGameBox = document.getElementById("latest-game-news");
        const gameNewsList = document.getElementById("game-news-list");

        if (latestGameBox) {
            latestGameBox.innerHTML = `<p class="muted">Herní novinky se nepodařilo načíst.</p>`;
        }

        if (gameNewsList) {
            gameNewsList.innerHTML = `<p class="muted">Herní novinky se nepodařilo načíst.</p>`;
        }
    });
