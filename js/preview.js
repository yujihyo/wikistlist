const cardElements = [];

function createRows(profile) {

    return profile.rows.map(row => `

        <tr>

            <th style="background:${profile.headerColor};color:#fff;">
                ${row[0]}
            </th>

            <td>${String(row[1]).replace(/\n/g, "<br>")}</td>

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

        <div class="card-image"></div>

        <table class="profile-table"></table>

    `;

    updateCard(card, profile);

    return card;

}

function updateCard(card, profile) {

    const header =
        card.querySelector(".card-header");

    header.style.background =
        profile.headerColor;

    card.querySelector(".kr-name").textContent =
        profile.nameKR;

    card.querySelector(".sub-name").textContent =
        `${profile.nameJP} | ${profile.nameEN}`;

    card.querySelector(".profile-table").innerHTML =
        createRows(profile);

    const imageBox =
        card.querySelector(".card-image");

    if (profile.image.url) {

        imageBox.style.backgroundImage =
            `url(${profile.image.url})`;

        imageBox.style.backgroundRepeat =
            "no-repeat";

        imageBox.style.backgroundPosition =
            `${profile.image.offsetX}% ${profile.image.offsetY}%`;

        imageBox.style.backgroundSize =
            `${profile.image.scale}%`;

    } else {

        imageBox.style.backgroundImage =
            "none";

    }

}

function renderCards() {

    const container =
        document.getElementById("cardContainer");

    container.innerHTML = "";

    cardElements.length = 0;

    profiles.forEach(profile => {

        const card =
            createCardElement(profile);

        cardElements.push(card);

        container.appendChild(card);

    });

}
