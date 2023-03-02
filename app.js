// Class to create dino object
class Dino {
    constructor(species, weight, height, diet, where, when, fact, img) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;
        this.img = img;
        this.facts = [fact];
    }

    // Compare dino's height to the user's input height
    compareDinoHeight(human) {
        if (this.species === "Pigeon") return;

        this.facts.push(
            `${this.species} is ${
                this.height > human.height ? "taller" : "shorter"
            } than ${human.name} ${
                this.height > human.height
                    ? this.height - human.height
                    : human.height - this.height
            } inches.`
        );
    }

    // Compare dino's weight to the user's input weight
    compareDinoWeight(human) {
        if (this.species === "Pigeon") return;

        this.facts.push(
            `${this.species} has ${
                this.weight > human.weight ? "more" : "less"
            } ${
                this.weight > human.weight
                    ? this.weight - human.weight
                    : human.weight - this.weight
            } lbs of mass than ${human.name}.`
        );
    }

    // Compare dino's diet to the user's input diet
    compareDinoDiet(human) {
        if (this.species === "Pigeon") return;

        this.facts.push(
            `${this.species} is ${this.diet} while ${human.name} is${
                this.diet === human.diet ? " also" : ""
            } ${human.diet}.`
        );
    }
}

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// Generate Tiles for each Dino in Array and human
function generateTiles(dinos, human) {
    function generateTile(i) {
        const tile = document.createElement("div");
        tile.classList.add("grid-item");
        const h3 = document.createElement("h3");
        h3.textContent = i.hasOwnProperty("name") ? i.name : i.species;
        tile.appendChild(h3);
        const img = document.createElement("img");
        img.src = i.img;
        tile.appendChild(img);

        if (i.hasOwnProperty("name")) return tile;

        const p = document.createElement("p");
        p.textContent = i.facts[0];
        tile.appendChild(p);

        return tile;
    }
    const tiles = dinos.map(generateTile);

    // Keep human tile in the middle of the array
    tiles.splice(4, 0, generateTile(human));

    return tiles;
}

// On button click, prepare and display infographic
const form = document.getElementById("dino-compare");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values from form
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // Create human object from input data by IIFE
    const human = (function (name, weight, height, diet, img) {
        return { name, weight, height, diet, img };
    })(
        formProps.name,
        +formProps.weight,
        +formProps.feet * 12 + +formProps.inches,
        formProps.diet.toLowerCase(),
        "./images/human.png"
    );

    const dinos = [];

    // Call api to get dinos date from json file
    const { Dinos } = await (await fetch("./dino.json")).json();

    // Create Dino objects from date from api
    Dinos.forEach(({ species, weight, height, diet, where, when, fact }) => {
        const dino = new Dino(
            species,
            weight,
            height,
            diet,
            where,
            when,
            fact,
            `./images/${species.toLowerCase()}.png`
        );

        dino.compareDinoHeight(human);
        dino.compareDinoWeight(human);
        dino.compareDinoDiet(human);

        shuffleArray(dino.facts);

        dinos.push(dino);
    });

    // Generate Tiles for each Dino in Array and human
    const tiles = generateTiles(shuffleArray(dinos), human);

    // Add tiles to DOM
    const grid = document.getElementById("grid");
    grid.append(...tiles);

    // Remove form from screen
    form.parentNode.removeChild(form);
});
