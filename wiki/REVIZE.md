# Revize Mafia Hunterss Wiki

Datum revize: 21. 7. 2026

## Rozsah kontroly

- 72 HTML stránek
- 173 tabulek
- 5 429 interních odkazů
- 274 platných obrazových souborů
- 98 obrázků bossových zbraní
- společné CSS a JavaScriptové soubory

## Obrázky zbraní na stránce Bossové

Původní řešení zobrazovalo zbraně jako prázdné elementy `span`, jejichž obsah existoval pouze jako CSS pozadí. Při chybějícím nebo neaktuálním pravidle se proto nezobrazilo nic. Původní sada navíc obsahovala překlep `weapon_polearnm` pro zbraň Kopí.

- Všech 98 řádků používá skutečný obrázek z `images/bosses/`.
- Každé mapování souboru bylo porovnáno s původním pořadím a názvem zbraně.
- Opraveno mapování Kopí na `weapon_polearm.png`.
- Všechny soubory existují, jsou platné PNG o velikosti 100 × 100 px a žádné dva nejsou duplicitní.
- Doplněny popisné hodnoty `alt`, skutečné rozměry `width` a `height` a zachováno líné načítání.
- Odstraněno 98 již nepoužívaných CSS pravidel bossových sprite ikon a jedno chybné poziční pravidlo.

## HTML

- Opravena společná hlavička všech 72 stránek: `lang="cs"`, správně umístěné UTF-8 kódování a viewport.
- Opraven atribut meta description z neplatného `value` na `content`.
- Neexistující sociální obrázek `game_socialbanner.jpg` nahrazen existujícím projektovým obrázkem `mafiabattle.png`.
- Opraveno 110 chybných ukončení `</div>` uvnitř tabulkových buněk.
- Opraveno 11 neplatných ukončení `</br>`.
- Opraveny dvě vnořené dvojice odkazů.
- Opraven přebytečný `</tr>`, chybějící `</tr>` a chybné ukončení nadpisu.
- Po opravách HTML parser nehlásí žádnou strukturální chybu ani duplicitní ID.

## Tabulky a mobilní zobrazení

- Zkontrolováno všech 173 tabulek včetně `colspan` a `rowspan`.
- Všechny tabulky mají konzistentní počet výsledných sloupců.
- Každá tabulka je uvnitř obalu `.table-scroll`, který zajišťuje vodorovný posun pouze v tabulce.
- Odstraněno konfliktní vnořené posouvání a zastaralé přímé `display: block` na tabulkách.
- Zachovány breakpointy 980 px, 680 px a 520 px.
- Doplněna ochrana proti přetečení obsahu, zalamování dlouhých slov, `box-sizing` a responzivní obrázky.
- V projektu nezůstala žádná velká pevná inline šířka, která by vynucovala přetečení mobilního viewportu.

## CSS

- Ověřeny všechny cesty v `url(...)`; žádný odkazovaný asset nechybí.
- Odstraněna nepoužívaná pravidla bossových ikon a neexistujících prvků záhlaví/zápatí.
- Opravena duplicitní a chybná pozice karty `heart-nine` v pokerovém sprite obrázku.
- Odstraněny konfliktní mobilní přepisy a zachována pouze potřebná kaskáda.
- CSS má vyvážené bloky, neobsahuje přesně duplicitní pravidla a všechny zbývající selektory mají odpovídající použití.
- Zachován stávající design, barvy, typografie i rozložení.

## JavaScript a navigace

- Zachováno lokální jQuery 3.0.0 a ověřena jeho syntaktická platnost.
- Společná logika přesunuta do `scripts/wiki.js`, načítaného na všech 72 stránkách.
- Opravena detekce aktuální stránky; původní porovnání celé URL s relativním `href` nemohlo najít aktivní odkaz.
- Opraveno otevírání a sbalování skupin menu bez konfliktního inline stylu.
- Stav otevřené skupiny se ukládá pro konkrétní stránku; při nedostupném `localStorage` menu dál funguje.
- Doplněno ovládání skupin menu klávesami Enter a mezerník a aktualizace `aria-expanded`.
- Proměnné animace vrtulníku již nevznikají jako nechtěné globální proměnné; animace respektuje omezení pohybu a nespouští se, pokud je prvek skrytý.
- Syntaxe obou JavaScriptových souborů byla ověřena bez chyby.

## Obrázky a odkazy

- Všech 274 PNG/JPEG souborů bylo otevřeno a ověřeno; žádný není poškozený.
- Všechny lokální cesty v `src`, `href` a CSS existují.
- Všech 98 elementů `img` má neprázdný a správný alternativní text.
- Nenalezen žádný chybějící interní cíl ani neexistující fragment odkazu.
- Jediný externí odkaz `https://www.mafiahunterss.com/` byl ověřen s odpovědí HTTP 200 a zůstal zachován.

## Odstraněné nepotřebné soubory

- `styles/main`
- `styles/mafia-hunterss-wiki-style.css`
- `scripts/jquery.min`
- testovací soubory `images/s` a `images/bosses/ss`

Šlo o nepoužívané starší kopie nebo testovací zbytky. Aktivní soubory `styles/main.css`, `scripts/jquery.min.js` a všechny používané obrázky zůstaly zachované. Původní vstupní ZIP nebyl změněn.

## Výsledek závěrečného auditu

- HTML parser: 0 chyb
- chybějící lokální soubory: 0
- chybějící fragmenty odkazů: 0
- chybějící CSS assety: 0
- tabulky bez responzivního obalu: 0
- tabulky s nekonzistentní šířkou řádků: 0
- obrázky bez alternativního textu: 0
- duplicitní ID: 0
- neplatné JavaScriptové soubory: 0
