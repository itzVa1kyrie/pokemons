import {useEffect, useRef, useState} from "react";
import FilterButtonTypes from "./filterButtonTypes";
import FilterButtonSize from "./filterButtonSize";
import Filters from "./filters";
import clsx from "clsx";
import colorType from "../colorType";

export default function Sorting(props) {
    const [clear, setClear] = useState(false);
    const [visibleList, setVisibleList] = useState(false);
    const [types, setTypes] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const blockFilter = useRef(null);
    const btnOpen = useRef(null);

    useEffect(() => {
        if (clear)
            setClear(false);
    }, [clear]);

    const sorting = (sortWay) => {
        let pokemonsList;
        if (props.search.length !== 0)
            pokemonsList = props.search.slice();
        else if (props.filter.length !== 0 && props.filter[0] !== undefined)
            pokemonsList = props.filter.slice();
        else
            pokemonsList = props.pokemons.slice();
        if (sortWay === 'asc')
            pokemonsList.sort((a, b) => a.id - b.id);
        else if (sortWay === 'desc')
            pokemonsList.sort((a, b) => b.id - a.id);
        else if (sortWay === 'a-z')
            pokemonsList.sort((a, b) => (a.name > b.name) ? 1 : -1)
        else if (sortWay === 'z-a')
            pokemonsList.sort((a, b) => (a.name < b.name) ? 1 : -1)
        props.changeSortPokemons(pokemonsList, true);
        setVisibleList(!visibleList);
    }

    const selectTypeWeak = (name, flag) => {
        let typesList = types.slice();
        let weakList = weaknesses.slice();
        if (flag === "type" && !types.includes(name)) {
            typesList.push(name);
            setWeaknesses(weakList.filter(item => item !== name));
            setTypes(typesList);
        }
        else if (flag === "weak" && !weaknesses.includes(name)) {
            weakList.push(name);
            setTypes(typesList.filter(item => item !== name));
            setWeaknesses(weakList);
        }
        else {
            setTypes(typesList.filter(item => item !== name));
            setWeaknesses(weakList.filter(item => item !== name));
        }
    }

    const selectWeightHeight = (size, flag) => {
        if (flag === "height")
            setHeight(size);
        else if (flag === "weight")
            setWeight(size);
        else if (flag === "heightClear")
            setHeight("");
        else
            setWeight("");
    }

    const filters = () => {
        setClear(false);
        let filterPokemons = Filters(types, weaknesses, weight, height, props.pokemons);
        props.changeFilters(filterPokemons.length !== 0 ? filterPokemons : [undefined], 15);
    }

    const createFilterTypes = () => {
        return Object.keys(colorType[0]).map((item, index) => {
            return (
                <div key={index} className="one-type">
                    {props.colorType(item)}
                    <FilterButtonTypes filter={clear} select={selectTypeWeak} name={item}/>
                </div>
            );
        })
    }

    const clickOpenFilter = () => {
        if (blockFilter.current.classList.contains('active-block-filter')) {
            blockFilter.current.classList.remove('active-block-filter');
            blockFilter.current.style.animation = 'shiftClose 1s ease-out';
            blockFilter.current.style.width = 0;
            blockFilter.current.style.padding = 0;
            btnOpen.current.classList.add('active-open');
        }
        else {
            btnOpen.current.classList.remove('active-open');
            blockFilter.current.style.animation = '';
            blockFilter.current.style.width = '550px';
            blockFilter.current.style.padding = '20px';
            blockFilter.current.classList.add('active-block-filter');
        }
    }

    const clearFilters = () => {
        setClear(true);
        setTypes([]);
        setWeaknesses([]);
        setHeight("");
        setWeight("");
        props.changeFilters([], 15);
    }

    return (
        <div style={{width: '100%'}}>
            <div className="surpriseAndSort">
                <button className="surprise_btn" onClick={() => props.clickSurpriseMe()}>
                    <img className="surprise-btn_img" src="images/surprise.png" alt="surprise.png"/>
                    Surprise me
                </button>
                <div className="sort">
                    <div className="wrapper-sort" onClick={() => setVisibleList(!visibleList)}>
                        <button className="wrapper-sort_name">Sorting</button>
                        <img className={clsx("wrapper-sort_img", { "activeImg": visibleList})}
                             src="images/arrowDown.png" alt="arrowDown.png"/>
                    </div>
                    <ul className={clsx("sort_list", { "activeList": visibleList})}>
                        <li onClick={() => sorting("asc")} value="asc">ASC</li>
                        <li onClick={() => sorting("desc")} value="desc">DESC</li>
                        <li onClick={() => sorting("a-z")} value="a-z">A-Z</li>
                        <li onClick={() => sorting("z-a")} value="z-a">Z-A</li>
                    </ul>
                </div>
            </div>
            <div className="filter-wrapper">
                <div ref={blockFilter} className="block-filter">
                    <div className="flex-weight-height">
                        <div className="block-weight">
                            <p className="weight-title">Weight</p>
                            <div className="weight-btns">
                                <FilterButtonSize filter={clear} select={selectWeightHeight} flag="weight"/>
                            </div>
                        </div>
                        <div className="block-height">
                            <p className="height-title">Height</p>
                            <div className="height-btns">
                                <FilterButtonSize filter={clear} select={selectWeightHeight} flag="height"/>
                            </div>
                        </div>
                    </div>
                    <div className="block-types-weaknesses">
                        <p className="type-title">Types and weaknesses</p>
                        <div className="types-btns">
                            {createFilterTypes()}
                        </div>
                    </div>
                    <div className="flex-search-clean">
                        <button className="filter_clear" onClick={clearFilters}>Clear filters</button>
                        <button className="filter_search"
                                onClick={filters}>Search pokemons</button>
                    </div>
                </div>
                <div className="block-btn-open">
                    <button ref={btnOpen} className="filter-open active-open" onClick={clickOpenFilter}>
                        <img src="images/pokeball.png" alt="pokeball.png"/>
                    </button>
                </div>
            </div>
        </div>
    );
}