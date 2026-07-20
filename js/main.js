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

const imageScale =
    document.getElementById("imageScale");

const imageOffsetX =
    document.getElementById("imageOffsetX");

const imageOffsetY =
    document.getElementById("imageOffsetY");

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

    imageInput.value = "";

    imageScale.value =
        profile.image.scale;

    imageOffsetX.value =
        profile.image.offsetX;

    imageOffsetY.value =
        profile.image.offsetY;

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

imageInput.addEventListener("change", (e) => {

    imageScale.addEventListener("input", () => {

        profiles[currentCard].image.scale =
            Number(imageScale.value);

        updateCurrentCard();

    });

    imageOffsetX.addEventListener("input", () => {

        profiles[currentCard].image.offsetX =
            Number(imageOffsetX.value);

        updateCurrentCard();

    });

    imageOffsetY.addEventListener("input", () => {

        profiles[currentCard].image.offsetY =
            Number(imageOffsetY.value);

        updateCurrentCard();

    });

    const file =
        e.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function (event) {

        profiles[currentCard].image.src =
            event.target.result;

        refreshCurrentCard();

    };

    reader.readAsDataURL(file);

});