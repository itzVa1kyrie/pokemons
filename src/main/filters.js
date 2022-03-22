export default function Filters(types, weaknesses, weight, height, pokemonsList) {
    const contains = (array, otherArray) => {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    let pokemons = pokemonsList;
    let filterPokemons = [];
    let heightPokemon = pokemons.map(item => item.parameters.height / 10);
    let weightPokemon = pokemons.map(item => item.parameters.weight / 10);
    let weightArr = [Math.max(...weightPokemon), Math.min(...weightPokemon), weightPokemon.reduce((sum, elem) => sum + elem) / weightPokemon.length];
    let heightArr = [Math.max(...heightPokemon), Math.min(...heightPokemon), heightPokemon.reduce((sum, elem) => sum + elem) / heightPokemon.length];
    let objectParam = {
        height: height !== '',
        weight: weight !== '',
        types: types.length !== 0,
        weaknesses: weaknesses.length !== 0
    };

    let countTrueKey = 0;
    Object.keys(objectParam).map(key => {
        if (objectParam[key])
            countTrueKey++;
    });
    pokemons.map(pokemon => {
        let flag = 0;
        if (objectParam.weight) {
            if (weight === "s" && pokemon.parameters.weight / 10 <= (weightArr[2] + weightArr[1]) / 2)
                flag++;
            else if (weight === "m" && pokemon.parameters.weight / 10 > (weightArr[2] + weightArr[1]) / 2 &&
                pokemon.parameters.weight / 10 < (weightArr[0] + weightArr[1]) / 2)
                flag++;
            else if (weight === "l" && pokemon.parameters.weight / 10 >= (weightArr[0] + weightArr[1]) / 2)
                flag++;
        }
        if (objectParam.height) {
            if (height === "s" && pokemon.parameters.height / 10 <= (heightArr[2] + heightArr[1]) / 2)
                flag++;
            else if (height === "m" && pokemon.parameters.height / 10 > (heightArr[2] + heightArr[1]) / 2 &&
                pokemon.parameters.height / 10 < (heightArr[0] + heightArr[1]) / 2)
                flag++;
            else if (height === "l" && pokemon.parameters.height / 10 >= (heightArr[0] + heightArr[1]) / 2)
                flag++;
        }
        if (objectParam.types) {
            let typesPokemon = pokemon.types.map(type => type.type.name);
            if (contains(types, typesPokemon))
                flag++;
        }
        if (objectParam.weaknesses) {
            let weaknessesPokemon = pokemon.weaknesses.map(weakness => weakness);
            if (contains(weaknesses, weaknessesPokemon))
                flag++;
        }
        if (flag === countTrueKey)
            filterPokemons.push(pokemon);
    });
    return filterPokemons;
}