export default function AddButtons(props) {
    return (
        props.limitPokemons < props.pokemons.length && props.search.length === 0 ||
        props.limitPokemons < props.search.length ?
            <div className="btn-add-wrapper">
                <button className="btn-add-card" onClick={() => props.addMore(10)}>+10</button>
                <button className="btn-add-card" onClick={() => props.addMore(20)}>+20</button>
                <button className="btn-add-card" onClick={() => props.addMore(30)}>+30</button>
            </div> : ''
    );
}