const selectedCard =
document.getElementById("selectedCard");

const nameKR =
document.getElementById("nameKR");

const nameJP =
document.getElementById("nameJP");

const nameEN =
document.getElementById("nameEN");

const headerColor =
document.getElementById("headerColor");

const imageInput =
document.getElementById("imageInput");

let currentCard = 0;

renderCards();

loadEditor();

selectedCard.addEventListener("change", () => {

    currentCard = Number(selectedCard.value);

    loadEditor();

});

function loadEditor() {

    const profile = profiles[currentCard];

    nameKR.value = profile.nameKR;

    nameJP.value = profile.nameJP;

    nameEN.value = profile.nameEN;

    headerColor.value = profile.headerColor;

    imageInput.value="";

}

function refreshCurrentCard() {

    updateCard(

        cardElements[currentCard],

        profiles[currentCard]

    );

}

nameKR.addEventListener("input", () => {

    profiles[currentCard].nameKR = nameKR.value;

    refreshCurrentCard();

});

nameJP.addEventListener("input", () => {

    profiles[currentCard].nameJP = nameJP.value;

    refreshCurrentCard();

});

nameEN.addEventListener("input", () => {

    profiles[currentCard].nameEN = nameEN.value;

    refreshCurrentCard();

});

headerColor.addEventListener("input", () => {

    profiles[currentCard].headerColor = headerColor.value;

    refreshCurrentCard();

});

imageInput.addEventListener("change",(e)=>{

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload=function(event){

        profiles[currentCard].image.src =
        event.target.result;

        refreshCurrentCard();

    };

    reader.readAsDataURL(file);

});