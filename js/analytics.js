// Google Analytics 4

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

// Načtení Google Analytics
const gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-BD4VKYXBTL";

gaScript.onload = () => {
    gtag("js", new Date());
    gtag("config", "G-BD4VKYXBTL", {
        anonymize_ip: true
    });
};

document.head.appendChild(gaScript);
