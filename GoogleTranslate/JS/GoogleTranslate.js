// Una constante donde el documento agarra el texto de la primer textarea
const fromText = document.querySelector(".from-text"),
// Una constante donde el documento agarra el texto de la segunda textarea
toText = document.querySelector(".to-text"),
// Una constante donde el documento agarra el icono de cambiar viseversamente
exchageIcon = document.querySelector(".exchange"),
// Una constante donde el documento agarra todo lo que esta en select en el html
selectTag = document.querySelectorAll("select"),
// Una constante de los iconos de volumen y copiar
icons = document.querySelectorAll(".row i");
// Este es el boton de traducir
translateBtn = document.querySelector("button"),


// Con la constante de dicho nombre hacemos un forEach para recorrer la lista 
// que tenemos en el js llamado country y lo mostramos en forma de lista

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});


// Este evento nos permite cambiar los textos dentro textArea con el boton de viseversa
exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

// Este es el metodo para traducir
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Traduciendo...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Traduciendo");
    });
});

// Metodo de lista de los iconos sobre el volumen a la hora de darle click asi escuchar
// las palabras del textArea 1 y a la hora de darle al icono de copiar, para copiar en algun lado ese tetxo
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});