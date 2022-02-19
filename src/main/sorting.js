import React, {Component} from 'react';
import colorType from "../colorType";

export default class Sorting extends Component {
    contains(array, otherArray) {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    filters() {
        let pokemons = this.props.state.pokemons;
        let filterPokemons = [];
        let typesAndWeaknesses = [...document.querySelectorAll(".one-type")];
        let nodeParam = document.querySelectorAll(".block-weight div, .block-height div");
        let paramHeight = "", paramWeight = "";
        let types = [], weaknesses = [];
        let heightPokemon = pokemons.map(item => item.parameters.height / 10);
        let weightPokemon = pokemons.map(item => item.parameters.weight / 10);
        let weightArr = [Math.max(...weightPokemon), Math.min(...weightPokemon), weightPokemon.reduce((sum, elem) => sum + elem) / weightPokemon.length];
        let heightArr = [Math.max(...heightPokemon), Math.min(...heightPokemon), heightPokemon.reduce((sum, elem) => sum + elem) / heightPokemon.length];
        [...nodeParam[0].children].map(child => {
            if (child.classList.contains("active-btn-size"))
                paramHeight = child.textContent;
        });
        [...nodeParam[1].children].map(child => {
            if (child.classList.contains("active-btn-size"))
                paramWeight = child.textContent;
        });
        typesAndWeaknesses.map(item => {
            [...item.children].map(el => {
                if (el.classList.contains("active-btn-type")) {
                    if (el.textContent === 'T')
                        types.push(item.children[0].textContent);
                    else
                        weaknesses.push(item.children[0].textContent);
                }
            });
        });

        let objectParam = {
            height: paramHeight !== '',
            weight: paramWeight !== '',
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
                if (paramWeight === "S" && pokemon.parameters.weight / 10 <= (weightArr[2] + weightArr[1]) / 2)
                    flag++;
                else if (paramWeight === "M" && pokemon.parameters.weight / 10 > (weightArr[2] + weightArr[1]) / 2 &&
                    pokemon.parameters.weight / 10 < (weightArr[0] + weightArr[1]) / 2)
                    flag++;
                else if (paramWeight === "L" && pokemon.parameters.weight / 10 >= (weightArr[0] + weightArr[1]) / 2)
                    flag++;
            }
            if (objectParam.height) {
                if (paramHeight === "S" && pokemon.parameters.height / 10 <= (heightArr[2] + heightArr[1]) / 2)
                    flag++;
                else if (paramHeight === "M" && pokemon.parameters.height / 10 > (heightArr[2] + heightArr[1]) / 2 &&
                    pokemon.parameters.height / 10 < (heightArr[0] + heightArr[1]) / 2)
                    flag++;
                else if (paramHeight === "L" && pokemon.parameters.height / 10 >= (heightArr[0] + heightArr[1]) / 2)
                    flag++;
            }
            if (objectParam.types) {
                let typesPokemon = pokemon.types.map(type => type.type.name);
                if (this.contains(types, typesPokemon))
                    flag++;
            }
            if (objectParam.weaknesses) {
                let weaknessesPokemon = this.props.weaknesses[pokemon.name].map(weakness => weakness);
                if (this.contains(weaknesses, weaknessesPokemon))
                    flag++;
            }
            if (flag === countTrueKey)
                filterPokemons.push(pokemon);
        });
        this.props.changeFilters(filterPokemons.length !== 0 ? filterPokemons : [undefined], 15, true);
    }

    addActive(index, active) {
        let buttons = document.querySelectorAll('.weight-btns, .height-btns');
        [...buttons[index].children].map(button => {
            if (button !== buttons[index].children[active])
                button.classList.remove('active-btn-size');
        });
        buttons[index].children[active].classList.toggle('active-btn-size');
    }

    createFilterTypes() {
        return Object.keys(colorType[0]).map((item, index) => {
            return (
                <div key={index} className="one-type">
                    {this.props.colorType(item)}
                    <button className="btn-type" onClick={() => this.clickTypeWeak(index, 'T')}>T</button>
                    <button className="btn-weak" onClick={() => this.clickTypeWeak(index, 'W')}>W</button>
                </div>
            );
        })
    }

    clickTypeWeak(index, text) {
        let buttons = document.querySelectorAll('.one-type');
        [...buttons[index].children].map(btn => {
            if (text === 'T' && btn !== buttons[index].children[1])
                btn.classList.remove("active-btn-type");
            else if (text === 'W' && btn !== buttons[index].children[2])
                btn.classList.remove("active-btn-type");
        });
        if (text === 'T')
            buttons[index].children[1].classList.toggle("active-btn-type");
        else
            buttons[index].children[2].classList.toggle("active-btn-type");
    }

    clickOpenFilter() {
        let blockFilter = document.querySelector('.block-filter');
        let btnOpen = document.querySelector('.filter-open');
        if (blockFilter.classList.contains('active-block-filter')) {
            blockFilter.classList.remove('active-block-filter');
            blockFilter.style.animation = 'shiftClose 1s ease-out';
            blockFilter.style.width = 0;
            blockFilter.style.padding = 0;
            btnOpen.classList.add('active-open');
        }
        else {
            btnOpen.classList.remove('active-open');
            blockFilter.style.animation = '';
            blockFilter.style.width = '550px';
            blockFilter.style.padding = '20px';
            blockFilter.classList.add('active-block-filter');
        }
    }

    clearFilters() {
        let typesAndWeaknesses = [...document.querySelectorAll(".one-type")];
        let nodeParam = document.querySelectorAll(".block-weight div, .block-height div");
        [...nodeParam[0].children].map(child => {
            if (child.classList.contains('active-btn-size'))
                child.classList.remove('active-btn-size');
        });
        [...nodeParam[1].children].map(child => {
            if (child.classList.contains('active-btn-size'))
                child.classList.remove('active-btn-size');
        });
        typesAndWeaknesses.map(item => {
            [...item.children].map(el => {
                if (el.classList.contains("active-btn-type")) {
                    el.classList.remove("active-btn-type");
                }
            });
        });
        this.props.changeFilters([], 15, true);
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <div className="surpriseAndSort">
                    <button className="surprise_btn" onClick={() => this.props.clickSurpriseMe()}>
                        <img className="surprise-btn_img" src="images/surprise.png" alt="surprise.png"/>
                        Surprise me
                    </button>
                    <div className="sort">
                        <div className="wrapper-sort" onClick={() => this.props.visibleList()}>
                            <button className="wrapper-sort_name">Sorting</button>
                            <img className="wrapper-sort_img" src="images/arrowDown.png" alt="arrowDown.png"/>
                        </div>
                        <ul className="sort_list">
                            <li onClick={() => this.props.sorting("asc")} value="asc">ASC</li>
                            <li onClick={() => this.props.sorting("desc")} value="desc">DESC</li>
                            <li onClick={() => this.props.sorting("a-z")} value="a-z">A-Z</li>
                            <li onClick={() => this.props.sorting("z-a")} value="z-a">Z-A</li>
                        </ul>
                    </div>
                </div>
                <div className="filter-wrapper">
                    <div className="block-filter">
                        <div className="flex-weight-height">
                            <div className="block-weight">
                                <p className="weight-title">Weight</p>
                                <div className="weight-btns">
                                    <button className="filter_btn" onClick={() => this.addActive(0, 0)}>S</button>
                                    <button className="filter_btn padding" onClick={() => this.addActive(0, 1)}>M</button>
                                    <button className="filter_btn" onClick={() => this.addActive(0, 2)}>L</button>
                                </div>
                            </div>
                            <div className="block-height">
                                <p className="height-title">Height</p>
                                <div className="height-btns">
                                    <button className="filter_btn" onClick={() => this.addActive(1, 0)}>S</button>
                                    <button className="filter_btn padding" onClick={() => this.addActive(1, 1)}>M</button>
                                    <button className="filter_btn" onClick={() => this.addActive(1, 2)}>L</button>
                                </div>
                            </div>
                        </div>
                        <div className="block-types-weaknesses">
                            <p className="type-title">Types and weaknesses</p>
                            <div className="types-btns">
                                {this.createFilterTypes()}
                            </div>
                        </div>
                        <div className="flex-search-clean">
                            <button className="filter_clear" onClick={() => this.clearFilters()}>Clear filters</button>
                            <button className="filter_search"
                                    onClick={() => this.filters()}>Search pokemons</button>
                        </div>
                    </div>
                    <div className="block-btn-open">
                        <button className="filter-open active-open" onClick={() => this.clickOpenFilter()}>
                            <img src="images/pokeball.png" alt="pokeball.png"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}