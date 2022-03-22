import axios from "axios";
import GenerateOnePokemon from "./generateOnePokemon";

export default async function AllData() {
    let results = [];
    await axios
        .get('https://pokeapi.co/api/v2/pokemon?limit=400')
        .then(result => {
            results = result.data.results;
        });

    return Promise.all(results.map(pokemon => GenerateOnePokemon(pokemon.name)));
}