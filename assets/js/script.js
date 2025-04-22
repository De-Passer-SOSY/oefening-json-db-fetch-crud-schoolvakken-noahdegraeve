"use strict";

document.addEventListener("DOMContentLoaded", init);

// 1. Init-functie wordt opgeroepen zodra de pagina geladen is
function init() {
    console.log("De pagina is volledig geladen");

    // Koppelt de knop aan de functie addVak
    document.querySelector("#addButton").addEventListener("click", addVak);

    // Haalt bestaande vakken op uit de databank
    fetchVakken();
}

async function fetchVakken() {
    try {
        // Ophalen van de vakken uit de JSON-server
        let response = await fetch("http://localhost:5688/vakken");

        // Omzetten naar JSON zodat we ermee kunnen werken
        let vakken = await response.json();

        // Doorsturen naar een functie die de lijst weergeeft
        displayVakken(vakken);
    } catch (err) {
        console.error("Fout bij het ophalen van vakken:", err);
    }
}

async function addVak() {
    let input = document.querySelector("#vakInput");
    let nieuweNaam = input.value.trim();

    if (nieuweNaam === "") {
        alert("Vul een vaknaam in!");
        return;
    }

    try {
        // Verstuur nieuw vak via POST naar de server
        let response = await fetch("http://localhost:5688/vakken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ naam: nieuweNaam })
        });

        if (response.ok) {
            // Leeg het inputveld en vernieuw de lijst
            input.value = "";
            fetchVakken();
        }
    } catch (err) {
        console.error("Fout bij toevoegen:", err);
    }
}

async function deleteVak(id) {
    try {
        let response = await fetch(`http://localhost:5688/vakken/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchVakken(); // vernieuw de lijst na verwijderen
        }
    } catch (err) {
        console.error("Fout bij verwijderen:", err);
    }
}

function displayVakken(vakken) {
    let lijst = document.querySelector("#vakList");
    lijst.innerHTML = ""; // Maak eerst alles leeg

    // Loop over alle vakken
    vakken.forEach(vak => {
        let li = document.createElement("li");
        li.textContent = vak.naam;

        // ❌ knopje maken
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => deleteVak(vak.id));

        li.appendChild(deleteBtn);
        lijst.appendChild(li);
    });
}