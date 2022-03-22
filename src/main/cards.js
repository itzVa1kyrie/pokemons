export default function Cards(props) {
    const allPokemons = props.search.length !== 0 ? props.search :
        props.filter.length !== 0 ? props.filter :
            props.pokemons;
    let pokemons = [];
    let result;
    let wrapperCards = props.cards;
    if (allPokemons.length === 0) {
        if (wrapperCards !== null) {
            wrapperCards.style.padding = '150px 0 190px 0';
        }
        result =
            <div className="block-loading">
                <div className="loading-ball"/>
            </div>
    }
    else if (allPokemons[0] === undefined) {
        result =
            <div className="no-pokemon-found">
                <p className="no-found_title">Your search for Pokémon returned no results.</p>
                <p className="no-found_hide">Here are some search tips:</p>
                <p className="no-found_tips">Pokémon requires no more than two filters</p>
                <p className="no-found_tips">Try different sizes and shapes</p>
            </div>
    }
    else {
        if (wrapperCards !== null)
            wrapperCards.style.padding = '50px 40px 150px 40px';
        allPokemons.map((pokemon, index) => {
            if (index < props.limitPokemons)
                pokemons.push(pokemon);
        });
        result = pokemons.map((item, id) =>
        {
            if (!props.sorting)
                props.pokemons.sort((a, b) => a.id - b.id);
            return (
                <div key={id} className="card" onClick={() => props.clickCard(pokemons[id].id)}>
                    <div className="card-angle"/>
                    <p className="card-angle_id">#{pokemons[id].id}</p>
                    <img className="card-img" src={pokemons[id].image} alt=""/>
                    <div className="card-info-wrapper">
                        <div className="card-info-inline">
                            <p className="card-name">{pokemons[id].name}</p>
                        </div>
                        <div className="card-types">
                            {pokemons[id].types.map(type => props.colorType(type.type.name))}
                        </div>
                    </div>
                </div>);
        });
    }
    return result;
}