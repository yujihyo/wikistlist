const selectedCards =
    document.querySelectorAll(
        'input[name="selectedCard"]'
    );
const saveImage =
    document.getElementById("saveImage");
const categoryInput =
    document.getElementById("category");

const nameKR = document.getElementById("nameKR");
const nameJP = document.getElementById("nameJP");
const nameEN = document.getElementById("nameEN");
const headerColor = document.getElementById("headerColor");

const imageInput = document.getElementById("imageInput");
const imageScale = document.getElementById("imageScale");
const imageOffsetX = document.getElementById("imageOffsetX");
const imageOffsetY = document.getElementById("imageOffsetY");

const rowTitle = document.getElementById("rowTitle");
const rowValue = document.getElementById("rowValue");
const addRow = document.getElementById("addRow");
const rowEditor = document.getElementById("rowEditor");

let currentCard = 0;
const SAVE_KEY = "wikistlist-save";

loadLocalData();
renderCards();
categoryInput.value = category;

document.getElementById("categoryPreview").innerHTML =
    '분류 : <span class="category-text">' + category + '</span>';
loadEditor();

selectedCards.forEach(radio => {

    radio.addEventListener("change", () => {

        currentCard =
            Number(radio.value);

        loadEditor();

    });

});

function refreshCurrentCard() {

    updateCard(
        cardElements[currentCard],
        profiles[currentCard]
    );

    saveLocalData();

}

function loadEditor() {

    const profile = profiles[currentCard];

    nameKR.value = profile.nameKR;
    nameJP.value = profile.nameJP;
    nameEN.value = profile.nameEN;
    headerColor.value = profile.headerColor;

    imageInput.value = "";

    imageScale.value =
        profile.image?.scale ?? 100;

    imageOffsetX.value =
        profile.image?.offsetX ?? 50;

    imageOffsetY.value =
        profile.image?.offsetY ?? 50;

    drawRows();

    categoryInput.value = category;

    document.getElementById("categoryPreview").innerHTML =
        '분류 : <span class="category-text">' + category + '</span>';
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

    profiles[currentCard].headerColor =
        headerColor.value;

    drawRows();

    refreshCurrentCard();

});

categoryInput.addEventListener("input", () => {

    category = categoryInput.value;

    document.getElementById("categoryPreview").innerHTML =
        '분류 : <span class="category-text">' + category + '</span>';

    saveLocalData();

});

imageInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = ev => {

        profiles[currentCard].image.url = ev.target.result;

        refreshCurrentCard();

    };

    reader.readAsDataURL(file);

});

imageScale.addEventListener("input", () => {

    profiles[currentCard].image.scale =
        Number(imageScale.value);

    refreshCurrentCard();

});

imageOffsetX.addEventListener("input", () => {

    profiles[currentCard].image.offsetX =
        Number(imageOffsetX.value);

    refreshCurrentCard();

});

imageOffsetY.addEventListener("input", () => {

    profiles[currentCard].image.offsetY =
        Number(imageOffsetY.value);

    refreshCurrentCard();

});

addRow.addEventListener("click", () => {

    if (profiles[currentCard].rows.length >= 10) {

        alert("프로필 항목은 최대 10개까지 추가할 수 있습니다.");

        return;

    }

    profiles[currentCard].rows.push([
        "",
        ""
    ]);

    drawRows();
    refreshCurrentCard();

});

function drawRows() {

    rowEditor.innerHTML = "";

    profiles[currentCard].rows.forEach((row, index) => {

        const div = document.createElement("div");

        div.style.border = "1px solid #ddd";
        div.style.padding = "8px";
        div.style.marginBottom = "8px";

        div.innerHTML = `

            <input
                class="editTitle"
                data-index="${index}"
                value="${row[0]}"
            >

            <textarea
                class="editValue"
                data-index="${index}"
                rows="3"
            >${row[1]}</textarea>

            <button class="delete" data-index="${index}">
                삭제
            </button>

        `;

        rowEditor.appendChild(div);

    });

    document.querySelectorAll(".editTitle").forEach(input => {

        input.oninput = () => {

            profiles[currentCard]
                .rows[input.dataset.index][0] =
                input.value;

            refreshCurrentCard();

        };

    });

    document.querySelectorAll(".editValue").forEach(input => {

        input.oninput = () => {

            profiles[currentCard]
                .rows[input.dataset.index][1] =
                input.value;

            refreshCurrentCard();

        };

    });

    document.querySelectorAll(".delete").forEach(btn => {

        btn.onclick = () => {

            profiles[currentCard]
                .rows.splice(btn.dataset.index, 1);

            drawRows();
            refreshCurrentCard();

        };

    });

}

function saveLocalData() {

    sessionStorage.setItem(
        SAVE_KEY,
        JSON.stringify({

            category,
            profiles

        })
    );

}

function loadLocalData() {

    const data =
        sessionStorage.getItem(SAVE_KEY);

    if (!data) return;

    try {

        const save =
            JSON.parse(data);


        if (save.category !== undefined) {

            category = save.category;

        }


        if (save.profiles) {

            save.profiles.forEach((savedProfile, index) => {

                if (!profiles[index]) return;


                profiles[index] = {

                    ...profiles[index],

                    ...savedProfile,


                    image: {

                        ...profiles[index].image,

                        ...(savedProfile.image || {})

                    },


                    rows:
                        savedProfile.rows ||
                        profiles[index].rows

                };


            });

        }


    }

    catch(e){

        console.error(e);

    }

}

saveImage.addEventListener("click", savePreviewAsImage);

async function savePreviewAsImage() {

    const source = document.getElementById("exportArea");

    const clone = source.cloneNode(true);

    clone.style.position = "absolute";
    clone.style.left = "-10000px";
    clone.style.top = "0";

    clone.style.width = source.offsetWidth + "px";
    clone.style.height = "auto";
    clone.style.overflow = "visible";
    clone.style.padding = "40px";
    clone.style.background = "#fff";

    clone.style.fontKerning = "none";
    clone.style.textRendering = "geometricPrecision";

    clone.querySelectorAll("*").forEach(el => {

        el.style.fontKerning = "none";
        el.style.textRendering = "geometricPrecision";

    });

    document.body.appendChild(clone);

    await document.fonts.ready;
    const canvas = await html2canvas(clone, {

        backgroundColor: "#fff",

        useCORS: true,

        scale: 2,

    });

    document.body.removeChild(clone);

    const isMobile =
        /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        );

    const imageData =
        canvas.toDataURL("image/png");

    if (!isMobile) {

        // ===== PC (기존과 동일) =====

        const link =
            document.createElement("a");

        link.download = "pair.png";

        link.href = imageData;

        link.click();

    } else {

        // ===== 모바일 =====

        const newWindow =
            window.open();

        if (newWindow) {

            newWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{
    margin:0;
    background:#222;
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
}
img{
    max-width:100%;
    height:auto;
}
</style>
</head>
<body>
<img src="${imageData}">
</body>
</html>
        `);

            newWindow.document.close();

        } else {

            alert("팝업이 차단되었습니다.");

        }

    }

}

const sidebar =
    document.getElementById("sidebar");

const sidebarToggle =
    document.getElementById("sidebarToggle");

sidebarToggle.addEventListener("click",(e)=>{

    e.stopPropagation();

    sidebar.classList.toggle("closed");

    sidebarToggle.textContent =
        sidebar.classList.contains("closed")
        ? ">"
        : "<";

});
