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

    imageScale.value = profile.image.scale;
    imageOffsetX.value = profile.image.offsetX;
    imageOffsetY.value = profile.image.offsetY;

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

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({

            category,
            profiles

        })
    );

}

function loadLocalData() {

    const data =
        localStorage.getItem(SAVE_KEY);

    if (!data) return;

    try {

        const save =
            JSON.parse(data);

        if (save.category !== undefined) {

            category = save.category;

        }

        if (save.profiles) {

            save.profiles.forEach((profile, index) => {

                if (!profiles[index]) return;

                profiles[index] = profile;

            });

        }

    }

    catch (e) {

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
    const canvas = await html2canvas(clone,{

        backgroundColor:"#fff",

        useCORS:true,

        scale:2,

    });

    document.body.removeChild(clone);

    const link=document.createElement("a");

    link.download="pair.png";

    link.href=canvas.toDataURL();

    link.click();

}

/* ==========================
   Mobile Bottom Sheet
========================== */

const sidebar = document.getElementById("sidebar");
const handle = document.getElementById("sidebarHandle");

let startY = 0;
let currentY = 0;
let isDragging = false;

// 접힌 위치
const CLOSED = 0;

// 열린 위치(%)
const OPEN = 75;

let sheet = CLOSED;

function setSheet(percent){

    sheet = Math.max(CLOSED, Math.min(OPEN, percent));

    sidebar.style.transform =
        `translateY(calc(100% - 52px - ${sheet}vh))`;

}

function dragStart(e){

    if(window.innerWidth > 768) return;

    isDragging = true;

    startY =
        e.touches ?
        e.touches[0].clientY :
        e.clientY;

    currentY = startY;

    sidebar.style.transition = "none";

}

function dragMove(e){

    if(!isDragging) return;

    currentY =
        e.touches ?
        e.touches[0].clientY :
        e.clientY;

    const diff =
        startY - currentY;

    const vh =
        window.innerHeight;

    const percent =
        sheet + diff / vh * 100;

    setSheet(percent);

}

function dragEnd(){

    if(!isDragging) return;

    isDragging = false;

    sidebar.style.transition =
        "transform .25s ease";

    if(sheet > 35){

        setSheet(OPEN);

    }else{

        setSheet(CLOSED);

    }

}

handle.addEventListener("mousedown",dragStart);
window.addEventListener("mousemove",dragMove);
window.addEventListener("mouseup",dragEnd);

handle.addEventListener("touchstart",dragStart,{passive:true});
window.addEventListener("touchmove",dragMove,{passive:true});
window.addEventListener("touchend",dragEnd);

if(window.innerWidth<=768){

    setSheet(CLOSED);

}

window.addEventListener("resize",()=>{

    if(window.innerWidth<=768){

        setSheet(sheet);

    }else{

        sidebar.style.transform="";

    }

});