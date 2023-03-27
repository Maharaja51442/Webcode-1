// How to  i proceed  the API data... 

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const ITEMS_PER_PAGE = 20;
let currentPage = 1;

// Function to fetch data from the API
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error}`);
    throw error;
  }
}

// Function to display the list of pokemons
async function displayPokemonList(pokemons) {
  const pokemonContainer = document.getElementById("pokemon-container");
  if (!pokemonContainer) {
    console.error("Error: pokemonContainer is null");
    return;
  }
  pokemonContainer.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];

    try {
      // Make a separate API call to retrieve the Pokemon's full information
      const pokemonData = await fetchPokemonData(pokemon.url);

      const pokemonDiv = document.createElement("div");
      pokemonDiv.classList.add("pokemon");

      const nameDiv = document.createElement("div");
      nameDiv.textContent = `Name:${pokemon.name}`;
      pokemonDiv.appendChild(nameDiv);

      const abilitiesDiv = document.createElement("div");
      abilitiesDiv.textContent = `Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(", ")}`;
      pokemonDiv.appendChild(abilitiesDiv);

      const weightDiv = document.createElement("div");
      weightDiv.textContent = `Weight: ${pokemonData.weight} kg`;
      pokemonDiv.appendChild(weightDiv);

      const movesDiv = document.createElement("div");
      movesDiv.textContent = `Moves: ${pokemonData.moves.map(move => move.move.name).join(", ")}`;
      pokemonDiv.appendChild(movesDiv);

      pokemonContainer.appendChild(pokemonDiv);
    } catch (error) {
      console.error(`Error displaying pokemon ${pokemon.name}: ${error}`);
    }
  }
}

// Function to display the pagination links
function displayPaginationLinks(count) {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) {
    console.error("Error: paginationContainer is null");
    return;
  }
  paginationContainer.innerHTML = "";

  const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

  for (let i = 1; i <= pageCount; i++) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = i;
    link.onclick = function() {
      currentPage = i;
      fetchPokemons();
    };

    if (i === currentPage) {
      link.classList.add("active");
    }

    paginationContainer.appendChild(link);
  }
}

// Function to fetch and display the pokemons
async function fetchPokemons() {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const url = `${API_URL}?offset=${offset}&limit=${ITEMS_PER_PAGE}`;
    const data = await fetchPokemonData(url);

    displayPokemonList(data.results);
    displayPaginationLinks(data.count);
  } catch (error) {
    console.error(`Error fetching or displaying pokemons: ${error}`);
  }
}

// Initial fetch
fetchPokemons();
