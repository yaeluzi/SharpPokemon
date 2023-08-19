const typeClasses = { // Clases para los badges de los tipos
    grass: 'text-bg-success',
    fire: 'text-bg-danger',
    water: 'text-bg-primary',
    bug: 'text-bg-warning',
    normal: 'text-bg-secondary',
    poison: 'text-bg-dark',
    electric: 'text-bg-warning',
    ground: 'text-bg-dark',
    fairy: 'text-bg-danger',
    fighting: 'text-bg-danger',
    psychic: 'text-bg-danger',
    rock: 'text-bg-dark',
    ghost: 'text-bg-dark',
    ice: 'text-bg-primary',
    dragon: 'text-bg-danger',
    flying: 'text-bg-dark',
    steel: 'text-bg-dark',
};

// Debilidades de cada tipo
const typeDataList = {
    grass: {
        weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
    },
    fire: {
        weaknesses: ['water', 'ground', 'rock'],
    },
    water: {
        weaknesses: ['electric', 'grass'],
    },
    bug: {
        weaknesses: ['fire', 'flying', 'rock'],
    },
    normal: {
        weaknesses: ['fighting'],
    },
    poison: {
        weaknesses: ['ground', 'psychic'],
    },
    electric: {
        weaknesses: ['ground'],
    },
    ground: {
        weaknesses: ['water', 'grass', 'ice'],
    },
    fairy: {
        weaknesses: ['poison', 'steel'],
    },
    fighting: {
        weaknesses: ['flying', 'psychic', 'fairy'],
    },
    psychic: {
        weaknesses: ['bug', 'ghost', 'dark'],
    },
    rock: {
        weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
    },
    ghost: {
        weaknesses: ['ghost', 'dark'],
    },
    ice: {
        weaknesses: ['fire', 'fighting', 'rock', 'steel'],
    },
    dragon: {
        weaknesses: ['ice', 'dragon', 'fairy'],
    },
    flying: {
        weaknesses: ['electric', 'ice', 'rock'],
    },
    steel: {
        weaknesses: ['fire', 'fighting', 'ground'],
    },
};

// Función para calcular las debilidades de un pokemon
function calculateWeeknesses(types) { // types = ['grass', 'fire']
    const weeknesses = []; // Debilidades del pokemon
    types.forEach(type => {
        const typeData = typeDataList[type]; // Datos del tipo
        typeData.weaknesses.forEach(weakness => {
            if (!weeknesses.includes(weakness)) { // Si no está en el array de debilidades
                weeknesses.push(weakness);  // Lo añadimos al array de debilidades 
            }
        });
    });
    return weeknesses; // Devolvemos el array de debilidades
}



async function getPokemon(name) { // Función para obtener los datos de un pokemon
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); // Hacemos la petición a la API de pokemon con el nombre del pokemon
        const pokemon = await response.json(); // Convertimos la respuesta a JSON

        // Obtenemos las evoluciones del pokemon
        const evolutions = await getEvolutions(pokemon);
        console.log(pokemon);


        return { // Devolvemos un objeto con los datos del pokemon
            name: pokemon.name,
            types: pokemon.types.map(type => type.type.name),
            image: pokemon.sprites.other.dream_world.front_default,
            habilidades: pokemon.abilities.map(ability => ability.ability.name),
            statsName: pokemon.stats.map(stat => stat.stat.name),
            stats: pokemon.stats.map(stat => stat.base_stat),
            moves: pokemon.moves.map(move => move.move.name),
            evolutions: evolutions,
            description: [pokemon.weight, pokemon.height],

        };
    } catch (error) {
        console.log(error);
    }
}


// Función para obtener las evoluciones de un pokemon

async function getEvolutions(pokemon) { // pokemon = {name: 'bulbasaur', ...}
    const speciesResponse = await fetch(pokemon.species.url); // Hacemos la petición a la API de pokemon con la url de la especie del pokemon
    const speciesData = await speciesResponse.json(); // Convertimos la respuesta a JSON
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url); // Hacemos la petición a la API de pokemon con la url de la cadena de evolución de la especie del pokemon
    const evolutionChainData = await evolutionChainResponse.json(); // Convertimos la respuesta a JSON
    const evolutionChainId = evolutionChainData.id; // Obtenemos el id de la cadena de evolución

    // Hacemos la petición a la API de pokemon con el id de la cadena de evolución
    const evolutionChainResponse2 = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`);
    const evolutionChainData2 = await evolutionChainResponse2.json();
    const evolutions = [];
    let currentEvo = evolutionChainData2.chain; // Obtenemos la cadena de evolución
    while (currentEvo) { // Mientras haya evoluciones 

        const evoData = { // Creamos un objeto con los datos de la evolución
            name: currentEvo.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentEvo.species.url.split('/')[6]}.png`,
        };
        if (currentEvo.evolves_to.length > 0) { // Si hay evolución siguiente
            evoData.evolveTo = currentEvo.evolves_to[0].species.name; // Obtenemos el nombre de la evolución siguiente
        }
        evolutions.push(evoData);
        currentEvo = currentEvo.evolves_to[0]; // Pasamos a la siguiente evolución
    }
    return evolutions; // Devolvemos el array de evoluciones
}

function createTypeBadge(type) {
    const cssClass = typeClasses[type] || 'text-bg-dark';
    return `<span class="badge ms-1 ${cssClass}">${type}</span>`;
}

function displayPokemon(pokemon) {
    const pokeTitle = document.querySelector('#nombre');
    pokeTitle.textContent = pokemon.name;

    const pokeBreadcrumb = document.querySelector('#poke');
    pokeBreadcrumb.textContent = pokemon.name;


    const pokeImage = document.querySelector('#img');
    pokeImage.src = pokemon.image;

    const pokeTypes = document.querySelector('#tipos');
    const typeBadges = pokemon.types.map(createTypeBadge).join('');
    pokeTypes.innerHTML = `Tipos: ${typeBadges}`;

    const pokeDescription = document.querySelector('#descripcion');
    pokeDescription.textContent = `
        Peso: ${pokemon.description[0]} kg
        Altura: ${pokemon.description[1]} cm
    `;

    const pokeWeaknesses = document.querySelector('#debilidades');
    const weeknesses = calculateWeeknesses(pokemon.types);
    const weeknessesBadges = weeknesses.map(createTypeBadge).join('');
    pokeWeaknesses.innerHTML = `Debilidades: ${weeknessesBadges}`

    const pokeHabilidades = document.querySelector('#habilidad');
    pokeHabilidades.textContent = `Habilidades: ${pokemon.habilidades}`

    const pokeStats = document.querySelector('#stats');
    const statsHtml = pokemon.stats.map((stat, i) => `<span class="badge text-bg-danger">${pokemon.statsName[i]}</span>: ${stat}<br>`).join('');
    pokeStats.innerHTML = statsHtml;

    const pokeMoves = document.querySelector('#moves');
    const movesHtml = pokemon.moves.map(move => `<span class="badge rounded-pill text-bg-secondary">${move}</span>`).join(' ');
    pokeMoves.innerHTML = movesHtml;

    const pokeEvolutions = document.querySelector('#evoluciones');
    const evolutionsHtml = pokemon.evolutions.map(evo => {
        if (evo.evolveTo) {
            return `
                <div class="d-flex flex-column align-items-center col">
                    <img src="${evo.image}" alt="${evo.name}" class="img-fluid" width="100px" height="100px">
                    <a class="badge text-bg-success" href="detalle.html?name=${evo.name}">${evo.name}</a>
                </div>

            `;
        } else {
            return `
                <div class="d-flex flex-column align-items-center col">
                    <img src="${evo.image}" alt="${evo.name}" class="img-fluid" width="100px" height="100px">
                    <a class="badge text-bg-success" href="detalle.html?name=${evo.name}">${evo.name}</a>
                </div>
            `;
        }
    }).join('');
    pokeEvolutions.innerHTML = evolutionsHtml;



}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const pokemonName = params.get('name');
    const pokemon = await getPokemon(pokemonName);
    displayPokemon(pokemon);
}

init();
