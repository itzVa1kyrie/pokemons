import React from "react";

export default function GenerateParameters(props) {
    return (
        <div className="additional-fill_params">
            <div className="additional-fill-params_param">
                <p className="param_name">Height</p>
                <p className="param_fill">{props.pokemons[props.pokemons.findIndex(el => el.id === props.activeId + 1)].parameters.height / 10} m</p>
            </div>
            <div className="additional-fill-params_param">
                <p className="param_name">Weight</p>
                <p className="param_fill">{props.pokemons[props.pokemons.findIndex(el => el.id === props.activeId + 1)].parameters.weight / 10} kg</p>
            </div>
            <div className="additional-fill-params_param">
                <p className="param_name">Gender</p>
                <p className="param_fill">{props.pokemons[props.pokemons.findIndex(el => el.id === props.activeId + 1)].parameters.gender}</p>
            </div>
            <div className="additional-fill-params_param">
                <p className="param_name">Category</p>
                <p className="param_fill">{props.pokemons[props.pokemons.findIndex(el => el.id === props.activeId + 1)].parameters.category}</p>
            </div>
        </div>
    );
}