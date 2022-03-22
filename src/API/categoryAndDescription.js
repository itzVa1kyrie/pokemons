import axios from "axios";

export default async function CategoryAndDescription(name, id) {
    let category = [];
    let description = [];
    let urlForEvolve;
    let evolveList = [];
    await axios
        .get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
        .then(result => {
                category = result.data.genera[7].genus.replace(' Pokémon', '');
                result.data.flavor_text_entries.map(item => {
                    if (item.language.name === 'en')
                        description = item.flavor_text.replace('\f', ' ');
                });
                urlForEvolve = result.data.evolution_chain.url;
            }
        )
    await axios
        .get(urlForEvolve)
        .then(evolve => {
            let evolveString = `${evolve.data.chain.species.name}_`;
            if (evolve.data.chain.evolves_to[0] !== undefined) {
                if (evolve.data.chain.evolves_to.length > 1)
                    evolve.data.chain.evolves_to.map((ev, index) => {
                        index !== evolve.data.chain.evolves_to.length - 1 ? evolveString += ev.species.name + '_' :
                            evolveString += ev.species.name;
                    });
                else
                    evolveString += evolve.data.chain.evolves_to[0].species.name;
                if (evolve.data.chain.evolves_to[0].evolves_to[0] !== undefined) {
                    evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[0].species.name;
                    if (evolve.data.chain.evolves_to[0].evolves_to[1] !== undefined)
                        evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[1].species.name;
                }
            }
            evolveList = evolveString;
        });
    return [category, description, evolveList];
}