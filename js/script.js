const btn = document.querySelector(".hamb");
const menu = document.querySelector(".menu");

if (btn && menu) {
    btn.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
}

document.querySelectorAll("[data-lightbox]").forEach(img => {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
        const box = document.createElement("div");
        box.className = "lightbox open";

        const preview = document.createElement("img");
        preview.src = img.src;
        preview.alt = img.alt || "";

        box.appendChild(preview);
        box.addEventListener("click", () => box.remove());
        document.body.appendChild(box);
    });
});

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function safeUrl(value = "", fallback = "#") {
    try {
        const url = new URL(value, window.location.href);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (_) {
        // Neplatná URL použije fallback.
    }

    return fallback;
}

function formatEventDate(date) {
    return new Intl.DateTimeFormat(document.documentElement.lang || "cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

async function loadPromoBanners() {
    const section = document.getElementById("promo-banner-section");
    const track = document.getElementById("promo-banner-track");
    const dots = document.getElementById("promo-dots");
    const prevButton = document.getElementById("promo-prev");
    const nextButton = document.getElementById("promo-next");
    const carousel = document.getElementById("promo-carousel");

    if (!section || !track || !dots || !prevButton || !nextButton || !carousel) {
        return;
    }

    try {
        const response = await fetch("JSON/banners.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const banners = Array.isArray(data) ? data : [];
        const now = new Date();

        const visibleBanners = banners
            .filter(banner => banner && banner.active === true)
            .map(banner => ({
                ...banner,
                showFromDate: new Date(banner.showFrom),
                eventFromDate: new Date(banner.eventFrom),
                eventToDate: new Date(banner.eventTo)
            }))
            .filter(banner => {
                const datesAreValid =
                    !Number.isNaN(banner.showFromDate.getTime()) &&
                    !Number.isNaN(banner.eventFromDate.getTime()) &&
                    !Number.isNaN(banner.eventToDate.getTime());

                return datesAreValid &&
                    now >= banner.showFromDate &&
                    now <= banner.eventToDate;
            })
            .sort((a, b) => {
                const priorityA = Number(a.priority || 0);
                const priorityB = Number(b.priority || 0);

                if (priorityA !== priorityB) {
                    return priorityB - priorityA;
                }

                return a.eventFromDate - b.eventFromDate;
            });

        if (visibleBanners.length === 0) {
            section.hidden = true;
            return;
        }

        track.innerHTML = visibleBanners.map((banner, index) => {
            const isRunning = now >= banner.eventFromDate;
            const isLastDay =
                isRunning &&
                now.toDateString() === banner.eventToDate.toDateString();

            let status = `⏳ Začíná ${formatEventDate(banner.eventFromDate)}`;

            if (isRunning) {
                status = isLastDay
                    ? "⚠️ Poslední den akce"
                    : "🟢 Akce právě probíhá";
            }

            const image = safeUrl(banner.image, "");
            const buttonUrl = safeUrl(
                banner.buttonUrl,
                "https://mafiahunterss.mafiacontrol.com/"
            );

            return `
                <article class="promo-slide${index === 0 ? " active" : ""}"
                         data-promo-index="${index}"
                         style="${image ? `--promo-image:url('${image.replaceAll("'", "%27")}')` : ""}">

                    <div class="promo-overlay"></div>

                    <div class="promo-content">
                        <span class="promo-label">${escapeHtml(status)}</span>

                        <h2>${escapeHtml(banner.title)}</h2>

                        <p class="promo-text">${escapeHtml(banner.text)}</p>

                        <div class="promo-time">
                            <span>
                                <strong>Začátek:</strong>
                                ${escapeHtml(formatEventDate(banner.eventFromDate))}
                            </span>

                            <span>
                                <strong>Konec:</strong>
                                ${escapeHtml(formatEventDate(banner.eventToDate))}
                            </span>
                        </div>

                        <div class="actions promo-actions">
                            <a class="btn btn-gold"
                               href="${escapeHtml(buttonUrl)}"
                               target="_blank"
                               rel="noopener">
                                ${escapeHtml(banner.buttonText || "🎮 Spustit hru")}
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        dots.innerHTML = visibleBanners.map((banner, index) => `
            <button class="promo-dot${index === 0 ? " active" : ""}"
                    type="button"
                    data-promo-dot="${index}"
                    aria-label="Zobrazit akci ${index + 1}: ${escapeHtml(banner.title)}">
            </button>
        `).join("");

        section.hidden = false;

        let currentIndex = 0;
        let autoplayId = null;

        const slides = [...track.querySelectorAll(".promo-slide")];
        const dotButtons = [...dots.querySelectorAll(".promo-dot")];

        function showSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("active", slideIndex === currentIndex);
            });

            dotButtons.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;

                dot.classList.toggle("active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        function stopAutoplay() {
            if (autoplayId !== null) {
                window.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();

            if (slides.length > 1) {
                autoplayId = window.setInterval(() => {
                    showSlide(currentIndex + 1);
                }, 7000);
            }
        }

        prevButton.hidden = slides.length <= 1;
        nextButton.hidden = slides.length <= 1;
        dots.hidden = slides.length <= 1;

        prevButton.addEventListener("click", () => {
            showSlide(currentIndex - 1);
            startAutoplay();
        });

        nextButton.addEventListener("click", () => {
            showSlide(currentIndex + 1);
            startAutoplay();
        });

        dotButtons.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                startAutoplay();
            });
        });

        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", startAutoplay);

        showSlide(0);
        startAutoplay();
    } catch (error) {
        console.warn("Bannery akcí se nepodařilo načíst.", error);
        section.hidden = true;
    }
}

/* KLASICKÉ NOVINKY WEBU */
fetch("JSON/news.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    })
    .then(news => {
        const latestBox = document.getElementById("latest-news");
        const allBox = document.getElementById("all-news");

        if (latestBox) {
            latestBox.innerHTML = news.slice(0, 3).map(item => `
                <div class="card">
                    <p class="muted">${escapeHtml(item.date)}</p>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                </div>
            `).join("");
        }

        if (allBox) {
            allBox.innerHTML = news.map(item => `
                <div class="card">
                    <p class="muted">${escapeHtml(item.date)}</p>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
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
fetch("JSON/game-news.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    })
    .then(news => {
        const latestGameBox = document.getElementById("latest-game-news");
        const gameNewsList = document.getElementById("game-news-list");

        if (latestGameBox) {
            latestGameBox.innerHTML = news.slice(0, 3).map(item => `
                <div class="card">
                    <p class="muted">${escapeHtml(item.date)} • ${escapeHtml(item.category)}</p>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                </div>
            `).join("");
        }

        if (gameNewsList) {
            gameNewsList.innerHTML = news.map(item => `
                <div class="card">
                    <p class="muted">${escapeHtml(item.date)} • ${escapeHtml(item.category)}</p>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
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

/* VERZE APLIKACE */
fetch("JSON/app-version.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    })
    .then(app => {
        document.querySelectorAll("[data-app-version]").forEach(el => {
            el.textContent = app.version;
        });

        document.querySelectorAll("[data-app-build]").forEach(el => {
            el.textContent = app.build;
        });

        document.querySelectorAll("[data-app-date]").forEach(el => {
            el.textContent = app.releaseDate;
        });

        document.querySelectorAll("[data-app-size]").forEach(el => {
            el.textContent = app.apkSize;
        });

        document.querySelectorAll("[data-app-min-android]").forEach(el => {
            el.textContent = app.minAndroid;
        });

        document.querySelectorAll("[data-app-download]").forEach(el => {
            el.href = safeUrl(app.downloadUrl, el.href || "#");
        });
    })
    .catch(() => {
        console.warn("Informace o verzi aplikace se nepodařilo načíst.");
    });

document.addEventListener("DOMContentLoaded", loadPromoBanners);
