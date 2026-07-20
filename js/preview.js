const cardElements = [];

function createRows(profile) {

    return profile.rows.map(row => `
        <tr>
            <th>${row[0]}</th>
            <td>${row[1]}</td>
        </tr>
    `).join("");

}

function createCardElement(profile) {

    const card = document.createElement("div");
    card.className = "profile-card";

    card.innerHTML = `

        <div class="card-header">

            <div class="kr-name"></div>

            <div class="sub-name"></div>

        </div>

        <div class="card-image">

            <img class="profile-image">

        </div>

        <table class="profile-table"></table>

    `;

    updateCard(card, profile);

    return card;

}

function updateCard(card, profile) {

    const header = card.querySelector(".card-header");

    const krName = card.querySelector(".kr-name");

    const subName = card.querySelector(".sub-name");

    const table = card.querySelector(".profile-table");

    header.style.background = profile.headerColor;

    krName.textContent = profile.nameKR;

    subName.textContent =
        `${profile.nameJP} | ${profile.nameEN}`;

    table.innerHTML = createRows(profile);

    const image =
        card.querySelector(".profile-image");

    if (profile.image.src) {

        image.src =
            profile.image.src;

        image.style.display = "block";

    } else {

        image.style.display = "none";

    }

}

function renderCards() {

    const container =
        document.getElementById("cardContainer");

    container.innerHTML = "";

    cardElements.length = 0;

    profiles.forEach(profile => {

        const card = createCardElement(profile);

        cardElements.push(card);

        container.appendChild(card);

    });

}