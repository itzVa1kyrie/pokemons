import React from "react";

export default function GenerateEvolve(evolve, pokemons, clickCard, colorType) {
    if (evolve === undefined) {
        return (
            <div className="evolution-wrapper_one">
                <p className="evolution-wrapper-one_name">
                    No evolutions
                </p>
            </div>
        );
    }
    else {
        return evolve.map(ev => {
            return pokemons.map(pokemon => {
                if (pokemon.name === ev) {
                    return (
                        <div key={pokemon.id} className="evolution-wrapper_one">
                            <div className="evolution-wrapper-one_bubble" onClick={() => clickCard(pokemon.id)}>
                                <img className="evolution-wrapper-one_img" src={pokemon.image}
                                     alt={`${pokemon.name}.png`}/>
                            </div>
                            <p className="evolution-wrapper-one_name" onClick={() => clickCard(pokemon.id)}>
                                <span className="number-color">#{pokemon.id}</span> {pokemon.name}
                            </p>
                            <div className="evolution-wrapper-one_type">
                                {pokemon.types.map(type => colorType(type.type.name))}
                            </div>
                        </div>
                    );
                }
            })
        });
    }
}