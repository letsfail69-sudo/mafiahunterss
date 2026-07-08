// Seznam podporovaných jazyků
const supportedLanguages = ["cs", "en", "de", "pl", "sk"];

// Zjištění jazyka
let currentLang =
    localStorage.getItem("lang") ||
    navigator.language.substring(0, 2);

// Pokud jazyk nepodporujeme, použij angličtinu
if (!supportedLanguages.includes(currentLang)) {
    currentLang = "en";
}

// Načtení překladu
fetch(`lang/${currentLang}.json`)
    .then(response => response.json())
    .then(translations => {

        document.querySelectorAll("[data-lang]").forEach(element => {

            const key = element.dataset.lang;

            if (translations[key]) {
                element.textContent = translations[key];
            }

        });

    })
    .catch(error => {
        console.error("Language loading failed:", error);
    });
