import axios from "axios";
import Weaknesses from "./weaknesses";
import DescriptionAbilities from "./descriptionAbilities";
import Gender from "./gender";
import CategoryAndDescription from "./categoryAndDescription";

export default async function GenerateOnePokemon(name) {
    let pokemon = {};
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(async result => {
                let allWeaknesses = [];
                let descAbilities = {};
                result.data.types.map(async type => {
                    const partWeaknesses = await Weaknesses(type.type.url, result.data.types);
                    partWeaknesses.map(part => {
                        if (!allWeaknesses.includes(part))
                            allWeaknesses.push(part);
                    });
                });
                result.data.abilities.map(async item => {
                    const ability = await DescriptionAbilities(item.ability.url);
                    if (descAbilities[item.ability.name] === undefined)
                        descAbilities[item.ability.name] = ability[item.ability.name];
                });
                let catAndDescAndEvolve = await CategoryAndDescription(name, result.data.id);
                pokemon = {
                    id: result.data.id,
                    name: result.data.name,
                    types: result.data.types,
                    weaknesses: allWeaknesses,
                    image: result.data.sprites.other['official-artwork'].front_default,
                    description: catAndDescAndEvolve[1],
                    parameters: {
                        height: result.data.height,
                        weight: result.data.weight,
                        gender: await Gender(name),
                        category: catAndDescAndEvolve[0],
                        abilities: result.data.abilities,
                        descriptionAbilities: descAbilities
                    },
                    stats: {
                        hp: result.data.stats[0].base_stat,
                        attack: result.data.stats[1].base_stat,
                        defense: result.data.stats[2].base_stat,
                        special_Attack: result.data.stats[3].base_stat,
                        special_Defense: result.data.stats[4].base_stat,
                        speed: result.data.stats[5].base_stat
                    },
                    evolve: catAndDescAndEvolve[2]
                };
            }
        );
    return Promise.resolve(pokemon);
}
