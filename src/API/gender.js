import axios from "axios";

export default async function Gender(name) {
    let female, male = false;
    await axios
        .get(`https://pokeapi.co/api/v2/gender/1/`)
        .then(
            (result) => {
                result.data.pokemon_species_details.map(item => {
                    if (item.pokemon_species.name === name)
                        female = true;
                })
            }
        )
    await axios.get(`https://pokeapi.co/api/v2/gender/2/`)
        .then(
            (result) => {
                result.data.pokemon_species_details.map(item => {
                    if (item.pokemon_species.name === name)
                        male = true;
                })
            }
        )
    let gender = "";
    female && male ? gender = "♂ ♀" :
        female ? gender = "♀" :
            male ? gender = "♂" : gender = "unknown";
    return gender;
}