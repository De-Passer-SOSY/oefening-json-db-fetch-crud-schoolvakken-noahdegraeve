"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log("De pagina is volledig geladen");

    document.querySelector("#addButton").addEventListener("click", addVak);

    fetchVakken();
}

async function fetchVakken() {
    try {
        let response = await fetch("http://localhost:5688/vakken");
        let vakken = await response.json();
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
        let response = await fetch("http://localhost:5688/vakken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ naam: nieuweNaam })
        });

        if (response.ok) {
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
            fetchVakken();
        }
    } catch (err) {
        console.error("Fout bij verwijderen:", err);
    }
}

function displayVakken(vakken) {
    let lijst = document.querySelector("#vakList");
    lijst.innerHTML = "";


    vakken.forEach(vak => {
        let li = document.createElement("li");
        li.textContent = vak.naam;

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => deleteVak(vak.id));

        li.appendChild(deleteBtn);
        lijst.appendChild(li);
    });
}