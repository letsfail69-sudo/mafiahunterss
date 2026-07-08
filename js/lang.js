const supportedLanguages = ["cs", "en", "de", "pl", "sk"];

let currentLang =
    localStorage.getItem("lang") ||
    navigator.language.substring(0, 2);

if (!supportedLanguages.includes(currentLang)) {
    currentLang = "cs";
}

const switcher = document.getElementById("language-switcher");

if (switcher) {
    switcher.value = currentLang;

    switcher.addEventListener("change", () => {
        localStorage.setItem("lang", switcher.value);
        location.reload();
    });
}

fetch(`./lang/${currentLang}.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Soubor jazyka nenalezen: ${currentLang}`);
        }
        return response.json();
    })
    .then(translations => {
        document.querySelectorAll("[data-lang]").forEach(element => {
            const key = element.getAttribute("data-lang");

            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    })
    .catch(error => {
        console.error("Chyba překladu:", error);
    });
