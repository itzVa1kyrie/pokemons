import React, {useState, useEffect, useRef} from 'react';
import colorsType from "./colorType";
import Header from "./header";
import Cards from "./main/cards";
import Sorting from "./main/sorting";
import AddButtons from "./main/addButtons";
import Info from "./info/info";
import AllData from "./API/allData";

const Main = () => {
    const [location, setLocation] = useState("main");
    const [activeId, setActiveId] = useState(null);
    const [limitPokemons, setLimitPokemons] = useState(15);
    const [pokemons, setPokemons] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [search, setSearch] = useState([]);
    const [filter, setFilter] = useState([]);

    const cards = useRef(null);

    useEffect(async () => {
        setPokemons(await AllData());
    }, []);

    const clickCard = (id) => {
        setLocation("card");
        setActiveId(id - 1);
    }

    const colorType = (type) => {
        let color;
        color = colorsType[0][type].length === 1 ?
            `linear-gradient(${colorsType[0][type]}, ${colorsType[0][type]})`
            : `linear-gradient(${colorsType[0][type][0]} 50%, ${colorsType[0][type][1]} 50%)`;
        return <p className="card-types_type" style={{background: color}}>{type}</p>;
    }

    const clickSurpriseMe = () => {
        if (search.length !== 0)
            setSearch(search.slice().sort(() => Math.random() - 0.5));
        else if (filter.length !== 0 && filter[0] !== undefined)
            setFilter(filter.slice().sort(() => Math.random() - 0.5));
        else
            setPokemons(pokemons.slice().sort(() => Math.random() - 0.5));
        setSorting(true);
    }

    const clickBack = () => {
        setLocation("main");
        window.scroll(0, 0);
    }

    const addMore = (howMany) => setLimitPokemons(limitPokemons + howMany);

    const handleChangeSearch = (search) => setSearch(search);

    const handleChangeFilters = (filterPokemons, limitPokemons) => {
        setFilter(filterPokemons);
        setLimitPokemons(limitPokemons);
    }

    const handleChangeActiveId = (id) => setActiveId(id);

    const handleChangeSorting = (bool) => setSorting(bool);

    const handleChangeSortPokemon = (pokemons, bool) => {
        setPokemons(pokemons);
        setSorting(bool);
    }

    const handleChangeDisable = (block) =>
        location === "main" ? block.current.disabled = false : block.current.disabled = true;

    return (
        <div><Header pokemons={pokemons} changeState={handleChangeSearch}
                     location={location} changeDisable={handleChangeDisable}/>
            {
                location === "main" ?
                    <div className="main-back">
                        <div className="container">
                            <div className="main-block_filling">
                                <Sorting pokemons={pokemons} clickSurpriseMe={clickSurpriseMe}
                                         search={search} filter={filter} colorType={colorType}
                                         changeFilters={handleChangeFilters} changeSortPokemons={handleChangeSortPokemon}/>
                                <div ref={cards} className="cards">
                                    <Cards search={search} filter={filter} pokemons={pokemons}
                                           limitPokemons={limitPokemons} sorting={sorting}
                                           clickCard={clickCard} colorType={colorType}
                                           changeSorting={handleChangeSorting} cards={cards.current}/>
                                </div>
                                <AddButtons limitPokemons={limitPokemons} pokemons={pokemons}
                                            search={search} addMore={addMore}/>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="main-back">
                        <div className="container">
                            <div className="main-block_filling">
                                <Info pokemons={pokemons} activeId={activeId} clickCard={clickCard} colorType={colorType}
                                      clickBack={clickBack} changeId={handleChangeActiveId}/>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}
export default Main;