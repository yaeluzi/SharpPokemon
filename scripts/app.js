
function getPokemon(i) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .then(response => response.json())
        .then(pokemon => {
            return {
                name: pokemon.name,
                types: pokemon.types.map(type => type.type.name),
                image: pokemon.sprites.front_default
            }
        })
        .catch(error => console.log(error));
}

function searchPokemon() {
    const pokemonName = document.getElementById('search').value;
    const pokemon = getPokemon(pokemonName);
    if(pokemon){
        pokemon.then(pokemon => {
            const pokemonList = document.querySelector('.row-cols-4');
            pokemonList.innerHTML = '';
            document.location.href = `./docs/detalle.html?name=${pokemon.name}`;
        });
    } else{
        alert('Pokemon no encontrado');
    }

}

document.getElementById('search').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});



function getManyPokemons() {
    const pokemonList = [];
    for (let i = 1; i <= 151; i++) {
        pokemonList.push(getPokemon(i));
    }
    return pokemonList;
}

function displayPokemons(pokemons) {
    const pokemonList = document.querySelector('.row-cols-4');
    pokemons.forEach(pokemon => {
        const pokemonItem = document.createElement('div');
        const pokeDiv = document.createElement('div');
        pokeDiv.classList.add('card', 'col', 'mt-3');

        // Agregar id único para cada Pokémon generado
        pokemonItem.id = `poke-${pokemon.name}`;

        pokeDiv.innerHTML = `
        <img src="${pokemon.image}" id="a" class="card-img-top" alt="${pokemon.name}">
        <div class="card-body">
          ${pokemon.name}
          <br>
          ${pokemon.types.join(', ')}
        </div>
      `;
        pokemonItem.appendChild(pokeDiv);
        pokemonList.appendChild(pokemonItem);

        // Agregar evento 'click' a cada elemento Pokémon
        document.getElementById(`poke-${pokemon.name}`).addEventListener('click', () => {
            console.log(`Clicked on ${pokemon.name}!`);
            document.location.href = `./docs/detalle.html?name=${pokemon.name}`;
        });
    });
}


const pokemons = getManyPokemons();
Promise.all(pokemons).then(displayPokemons);
