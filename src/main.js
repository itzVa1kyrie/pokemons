import React, {Component} from 'react';
import colorType from "./colorType";
import Header from "./header";

export default class Main extends Component {
    state = {
        location: "main",
        activeId: null,
        error: null,
        isLoaded: false,
        limitPokemons: 15,
        items: [],
        pokemons: [],
        gender: {},
        category: {},
        evolve: [],
        description: {},
        descriptionAbilities: [],
        weaknesses: [],
        sorting: false,
        search: [],
        filter: []
    }

    componentDidMount() {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=800`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.results
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidUpdate() {
        if (this.state.isLoaded) {
            this.state.items.map(async item => {
                const id = item.url.split('/')[item.url.split('/').length - 2];
                await this.findGender(item.name);
                await this.findCategory_Description(item.name, id);
                this.generateOnePokemon(item.name);
            })
            this.setState({
                isLoaded: false
            })
        }
    }

    generateOnePokemon(name) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(res => res.json())
            .then(
                (result) => {
                    let pushResult = this.state.pokemons;
                    result.types.map(type => this.findOutWeaknesses(type.type.url, result.name, result.types));
                    pushResult.push({
                        id: result.id,
                        name: result.name,
                        types: result.types,
                        weaknesses: this.state.weaknesses,
                        image: result.sprites.other['official-artwork'].front_default,
                        description: this.state.description[name],
                        parameters: {
                            height: result.height,
                            weight: result.weight,
                            gender: this.state.gender[name],
                            category: this.state.category[name],
                            abilities: result.abilities,
                            descriptionAbilities: result.abilities.map(item =>
                                this.findDescriptionAbilities(item.ability.url))
                        },
                        stats: {
                            hp: result.stats[0].base_stat,
                            attack: result.stats[1].base_stat,
                            defense: result.stats[2].base_stat,
                            special_Attack: result.stats[3].base_stat,
                            special_Defense: result.stats[4].base_stat,
                            speed: result.stats[5].base_stat
                        }
                    });
                    this.setState({
                        pokemons: pushResult
                    });
                }
            )
    }

    async findGender(name) {
        let female, male = false;
        await fetch(`https://pokeapi.co/api/v2/gender/1/`)
            .then(res => res.json())
            .then(
                (result) => {
                    result.pokemon_species_details.map(item => {
                        if (item.pokemon_species.name === name)
                            female = true;
                    })
                }
            )
        await fetch(`https://pokeapi.co/api/v2/gender/2/`)
            .then(res => res.json())
            .then(
                (result) => {
                    result.pokemon_species_details.map(item => {
                        if (item.pokemon_species.name === name)
                            male = true;
                    })
                }
            )
        let gender = this.state.gender;
        female && male ? gender[name] = "♂ ♀" :
            female ? gender[name] = "♀" :
                male ? gender[name] = "♂" : gender[name] = "unknown";
        this.setState({
            gender: gender
        });
    }

    async findCategory_Description(name, id) {
        let category = this.state.category;
        let description = this.state.description;
        let urlForEvolve;
        let evolveList = this.state.evolve;
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(res => res.json())
            .then(
                (result) => {
                    category[name] = result.genera[7].genus.replace(' Pokémon', '');
                    result.flavor_text_entries.map(item => {
                        if (item.language.name === 'en')
                            description[name] = item.flavor_text.replace('\f', ' ');
                    });
                    urlForEvolve = result.evolution_chain.url;
                }
            )
        await fetch(urlForEvolve)
            .then(evolve => evolve.json())
            .then(evolve => {
                let evolveString = `${evolve.chain.species.name}_`;
                if (evolveList.length === 0)
                    evolveList.push(evolve.chain.species.name + '_' +
                        evolve.chain.evolves_to[0].species.name + '_' +
                        evolve.chain.evolves_to[0].evolves_to[0].species.name);
                else if (!evolveList[evolveList.length - 1].includes(name)) {
                    if (evolve.chain.evolves_to.length > 1)
                        evolve.chain.evolves_to.map((ev, index) => {
                            index !== evolve.chain.evolves_to.length - 1 ? evolveString += ev.species.name + '_' :
                                evolveString += ev.species.name;
                        });
                    else if (evolve.chain.evolves_to[0] !== undefined) {
                        evolveString += evolve.chain.evolves_to[0].species.name;
                        if (evolve.chain.evolves_to[0].evolves_to[0] !== undefined) {
                            evolveString += '_' + evolve.chain.evolves_to[0].evolves_to[0].species.name;
                            if (evolve.chain.evolves_to[0].evolves_to[1] !== undefined)
                                evolveString += '_' + evolve.chain.evolves_to[0].evolves_to[1].species.name;
                        }
                    }
                    evolveList.push(evolveString);
                }
            });
        this.setState({
            category: category,
            description: description,
            evolve: evolveList.filter((item, pos) => evolveList.indexOf(item) === pos)
        });
    }

    async findDescriptionAbilities(url) {
        let description = this.state.descriptionAbilities;
        await fetch(url)
            .then(description => description.json())
            .then(descriptionRes => {
                if (descriptionRes.effect_entries[0].language.name === "en")
                    description[descriptionRes.name] = descriptionRes.effect_entries[0].short_effect;
                else
                    description[descriptionRes.name] = descriptionRes.effect_entries[1].short_effect;
            });
        if (this.state.descriptionAbilities.length !== 0) {
            this.setState({
                descriptionAbilities: description
            })
        }
    }

    async findOutWeaknesses(url, name, types) {
        let weaknesses = this.state.weaknesses;
        let weaknessesList = [];
        let typeList = types.map(type => type.type.name);
        await fetch(url)
            .then(weaknesses => weaknesses.json())
            .then(weaknesses =>
                weaknesses.damage_relations.double_damage_from.map(weak => {
                    if (!typeList.includes(weak.name))
                        weaknessesList.push(weak.name)
                })
            )
        if (typeof weaknesses[name] !== "undefined") {
            let weaknessesName = weaknesses[name];
            weaknessesList.map(weakness => weaknessesName.push(weakness));
            weaknesses[name] = weaknessesName;
        }
        else {
            weaknesses[name] = weaknessesList;
        }
        this.setState({
            weaknesses:  weaknesses
        });
    }

    clickCard(id) {
        this.setState({
            location: "card",
            activeId: id - 1
        });
    }

    createCard() {
        const allPokemons = this.state.search.length !== 0 ? this.state.search :
            this.state.filter.length !== 0 ? this.state.filter :
                this.state.pokemons;
        let pokemons = [];
        let result;
        let wrapperCards = document.querySelector('.cards');
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
            wrapperCards.style.padding = '50px 40px 150px 40px';
            allPokemons.map((pokemon, index) => {
                if (index < this.state.limitPokemons)
                    pokemons.push(pokemon);
            });
            result = pokemons.map((item, id) =>
            {
                if (!this.state.sorting)
                    this.state.pokemons.sort((a, b) => a.id - b.id);
                return (
                    <div key={id} className="card" onClick={() => this.clickCard(pokemons[id].id)}>
                        <div className="card-angle"/>
                        <p className="card-angle_id">#{pokemons[id].id}</p>
                        <img className="card-img" src={pokemons[id].image} alt=""/>
                        <div className="card-info-wrapper">
                            <div className="card-info-inline">
                                <p className="card-name">{pokemons[id].name}</p>
                            </div>
                            <div className="card-types">
                                {pokemons[id].types.map(type => this.colorType(type.type.name))}
                            </div>
                        </div>
                    </div>);
            });
        }
        return result;
    }

    colorType(type) {
        let color;
        color = colorType[0][type].length === 1 ?
            `linear-gradient(${colorType[0][type]}, ${colorType[0][type]})`
            : `linear-gradient(${colorType[0][type][0]} 50%, ${colorType[0][type][1]} 50%)`;
        return <p className="card-types_type" style={{background: color}}>{type}</p>;
    }

    clickSurpriseMe() {
        if (this.state.search.length !== 0)
            this.setState({
                search: this.state.search.sort(() => Math.random() - 0.5),
                sorting: true
            });
        else if (this.state.filter.length !== 0 && this.state.filter[0] !== undefined)
            this.setState({
                filter: this.state.filter.sort(() => Math.random() - 0.5),
                sorting: true
            });
        else
            this.setState({
                pokemons: this.state.pokemons.sort(() => Math.random() - 0.5),
                sorting: true
            });
    }

    sorting(sortWay) {
        let pokemons;
        if (this.state.search.length !== 0)
            pokemons = this.state.search;
        else if (this.state.filter.length !== 0 && this.state.filter[0] !== undefined)
            pokemons = this.state.filter;
        else
            pokemons = this.state.pokemons;
        if (sortWay === 'asc')
            pokemons.sort((a, b) => a.id - b.id);
        else if (sortWay === 'desc')
            pokemons.sort((a, b) => b.id - a.id);
        else if (sortWay === 'a-z')
            pokemons.sort((a, b) => (a.name > b.name) ? 1 : -1)
        else if (sortWay === 'z-a')
            pokemons.sort((a, b) => (a.name < b.name) ? 1 : -1)
        this.setState({
            pokemons: pokemons,
            sorting: true
        })
        this.visibleList();
    }

    visibleList() {
        let list = document.querySelector('.sort_list');
        let img = document.querySelector('.wrapper-sort_img');
        list.classList.toggle('activeList');
        img.classList.toggle('activeImg');
    }

    filter(size) {
        let filter = [];
        let weight = this.state.pokemons.map(item => item.parameters.weight / 10);
        let height = this.state.pokemons.map(item => item.parameters.height / 10);
        let weightArr = [Math.max(...weight), Math.min(...weight), weight.reduce((sum, elem) => sum + elem) / weight.length];
        let heightArr = [Math.max(...height), Math.min(...height), height.reduce((sum, elem) => sum + elem) / height.length];
        this.state.pokemons.map(pokemon => {
            if (size === "small" && pokemon.parameters.weight / 10 <= (weightArr[2] + weightArr[1]) / 2)
                filter.push(pokemon);
            else if (size === "average" && pokemon.parameters.weight / 10 > (weightArr[2] + weightArr[1]) / 2 &&
                pokemon.parameters.weight / 10 < (weightArr[0] + weightArr[1]) / 2)
                filter.push(pokemon);
            else if (size === "big" && pokemon.parameters.weight / 10 >= (weightArr[0] + weightArr[1]) / 2)
                filter.push(pokemon);
            else if (size === "short" && pokemon.parameters.height / 10 <= (heightArr[2] + heightArr[1]) / 2)
                filter.push(pokemon);
            else if (size === "medium" && pokemon.parameters.height / 10 > (heightArr[2] + heightArr[1]) / 2 &&
                pokemon.parameters.height / 10 < (heightArr[0] + heightArr[1]) / 2)
                filter.push(pokemon);
            else if (size === "tall" && pokemon.parameters.height / 10 >= (heightArr[0] + heightArr[1]) / 2)
                filter.push(pokemon);
        })
        this.setState({
            filter: filter
        })
    }

    contains(array, otherArray) {
        return array.every(item => otherArray.indexOf(item) !== -1);
    }

    filters() {
        let pokemons = this.state.pokemons;
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
                let weaknessesPokemon = this.state.weaknesses[pokemon.name].map(weakness => weakness);
                if (this.contains(weaknesses, weaknessesPokemon))
                    flag++;
            }
            if (flag === countTrueKey)
                filterPokemons.push(pokemon);
        });

        this.setState({
            filter: filterPokemons.length !== 0 ? filterPokemons : [undefined],
            limitPokemons: 15,
            isAdd: true
        });
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

    surpriseAndSort() {
        return (
            <div style={{width: '100%'}}>
                <div className="surpriseAndSort">
                    <button className="surprise_btn" onClick={() => this.clickSurpriseMe()}>
                        <img className="surprise-btn_img" src="images/surprise.png" alt="surprise.png"/>
                        Surprise me
                    </button>
                    <div className="sort">
                        <div className="wrapper-sort" onClick={() => this.visibleList()}>
                            <button className="wrapper-sort_name">Sorting</button>
                            <img className="wrapper-sort_img" src="images/arrowDown.png" alt="arrowDown.png"/>
                        </div>
                        <ul className="sort_list">
                            <li onClick={() => this.sorting("asc")} value="asc">ASC</li>
                            <li onClick={() => this.sorting("desc")} value="desc">DESC</li>
                            <li onClick={() => this.sorting("a-z")} value="a-z">A-Z</li>
                            <li onClick={() => this.sorting("z-a")} value="z-a">Z-A</li>
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
                            <button className="filter_search" onClick={() => this.filters()}>Search pokemons</button>
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
        this.setState({
            filter: [],
            limitPokemons: 15,
            isAdd: true
        });
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
                <div className="one-type">
                    {this.colorType(item)}
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

    closeDescription() {
        let block = document.querySelectorAll('.abilities_one');
        let blockDesc = [...document.querySelectorAll('.abilities_one .abilities-one_desc')];
        blockDesc.map((item, index) => {
            block[index].style.width = '150px';
            block[index].classList.remove('active-desc-block');
            blockDesc[index].classList.remove('active-ability');
        })
    }

    clickOnPrevious(id) {
        let newId;
        if (id === 0)
            newId = this.state.pokemons.length - 1;
        else
            newId = id - 1;
        this.setState({
            activeId: newId
        })
        this.closeDescription();
    }

    clickOnNext(id) {
        let newId;
        if (id + 1 === this.state.pokemons.length)
            newId = 0;
        else
            newId = id + 1;
        this.setState({
            activeId: newId
        })
        this.closeDescription();
    }

    clickBack() {
        this.setState({
            location: "main"
        })
        window.scroll(0, 0);
    }

    clickDescription(ability) {
        let block = document.querySelectorAll('.abilities_one');
        let blockName = [...document.querySelectorAll('.abilities_one .abilities-one_name')];
        let blockDesc = [...document.querySelectorAll('.abilities_one .abilities-one_desc')];
        blockName.map((item, index) => {
            if (item.textContent === ability) {
                if (block[index].classList.contains('active-desc-block')) {
                    block[index].classList.remove('active-desc-block');
                    block[index].style.width = '150px';
                    block[index].style.animation = 'narrow 1s ease-out';
                    blockDesc[index].classList.remove('active-ability');
                }
                else {
                    block[index].classList.add('active-desc-block');
                    blockDesc[index].classList.add('active-ability');
                    block[index].style.animation = '';
                    block[index].style.width = '100%';
                }
            }
        });
    }

    createInfo() {
        window.scroll(0, 0);
        let item;
        this.state.pokemons.map(pokemon => {
            if (pokemon.id - 1 === this.state.activeId)
                item = pokemon;
        });
        let prevId = item.id - 1 === 0 ? this.state.pokemons.length : item.id - 1;
        let nextId = item.id === this.state.pokemons.length ? 1 : item.id + 1;
        setTimeout(this.animation, 1,
            item.stats.hp, item.stats.attack, item.stats.defense,
            item.stats.special_Attack, item.stats.special_Defense, item.stats.speed);
        let evolve;
        this.state.evolve.map(it => {
            if (it.includes(item.name))
                evolve = it.split('_');
        })
        let evolveBlocks = evolve.map(ev => {
            return this.state.pokemons.map(pokemon => {
                if (pokemon.name === ev) {
                    return (
                        <div className="evolution-wrapper_one">
                            <div className="evolution-wrapper-one_bubble" onClick={() => this.clickCard(pokemon.id)}>
                                <img className="evolution-wrapper-one_img" src={pokemon.image} alt={`${pokemon.name}.png`}/>
                            </div>
                            <p className="evolution-wrapper-one_name" onClick={() => this.clickCard(pokemon.id)}>
                                <span className="number-color">#{pokemon.id}</span> {pokemon.name}
                            </p>
                            <div className="evolution-wrapper-one_type">
                                {pokemon.types.map(type => this.colorType(type.type.name))}
                            </div>
                        </div>
                    );
                }
            })
        })
        return (
            <div className="wrapper-info">
                <button className="back-to-main" onClick={() => this.clickBack()}/>
                <div className="main-block">
                    <div className="main_name-block" style={{width: '300px', padding: '0'}}>
                        <p className="main-name-block_name"><span className="number-color">#{item.id}</span> {item.name}</p>
                    </div>
                    <div className="wrapper-main-btn">
                        <div className="wrapper-prev">
                            <button onClick={() => this.clickOnPrevious(this.state.activeId)} className="wrapper-prev_btn"/>
                            <p className="wrapper-prev_name"><span className="number-color numb">#{prevId}</span> {this.state.pokemons[prevId - 1].name}</p>
                        </div>
                        <div className="main_filling">
                            <div className="main-filling_img">
                                <img className="main-filling-img_img" src={item.image} alt={`${item.name}.png`}/>
                            </div>
                            <div className="main-filling_info">
                                <p className="main-filling-info_description">{item.description}</p>
                                <div className="flex-types">
                                    <div className="main-filling-info_type">
                                        <p className="info-type_title">Type</p>
                                        <div className="info-type_list">
                                            {item.types.map(type => this.colorType(type.type.name))}
                                        </div>
                                    </div>
                                    <div className="main-filling-info_type">
                                        <p className="info-type_title">Weaknesses</p>
                                        <div className="info-weak_list">
                                            {item.weaknesses[item.name].map(type => this.colorType(type))}
                                        </div>
                                    </div>
                                </div>
                                <div className="main-filling-info_abilities">
                                    <p className="info-type_title">Abilities</p>
                                    {item.parameters.abilities.map(item => {
                                        return (
                                            <div className="abilities_one" onClick={() => this.clickDescription(item.ability.name)}>
                                                <p className="abilities-one_name">{item.ability.name}</p>
                                                <p className="abilities-one_desc">{this.state.descriptionAbilities[item.ability.name]}</p>
                                            </div>);
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="wrapper-next">
                            <button onClick={() => this.clickOnNext(this.state.activeId)} className="wrapper-next_btn"/>
                            <p className="wrapper-next_name"><span className="number-color numb">#{nextId}</span> {this.state.pokemons[nextId - 1].name}</p>
                        </div>
                    </div>
                    <div className="main_additional-fill">
                        <div className="additional-fill_stats">
                            <div className="stats_block">
                                <div className="stats-block_filling"/>
                                <div className="stats-block_filling"/>
                                <div className="stats-block_filling"/>
                                <div className="stats-block_filling"/>
                                <div className="stats-block_filling"/>
                                <div className="stats-block_filling"/>
                            </div>
                            <div className="stats_block">
                                <p className="stats-block_name">HP</p>
                                <p className="stats-block_name">Attack</p>
                                <p className="stats-block_name">Defense</p>
                                <p className="stats-block_name">Special Attack</p>
                                <p className="stats-block_name">Special Defense</p>
                                <p className="stats-block_name">Speed</p>
                            </div>
                        </div>
                        <div className="additional-fill_params">
                            <div className="additional-fill-params_param">
                                <p className="param_name">Height</p>
                                <p className="param_fill">{this.state.pokemons[this.state.activeId].parameters.height / 10} m</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Weight</p>
                                <p className="param_fill">{this.state.pokemons[this.state.activeId].parameters.weight / 10} kg</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Gender</p>
                                <p className="param_fill">{this.state.pokemons[this.state.activeId].parameters.gender}</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Category</p>
                                <p className="param_fill">{this.state.pokemons[this.state.activeId].parameters.category}</p>
                            </div>
                        </div>
                    </div>
                    <div className="main_evolution">
                        <p className="info-type_title">Stages of Evolution</p>
                        <div className="main-evolution_wrapper">
                            {evolveBlocks}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    animation(hp, attack, defense, specAtt, specDef, speed) {
        let blocks = [...document.querySelectorAll(".stats-block_filling")];
        let arr = [hp, attack, defense, specAtt, specDef, speed];
        blocks.map((item, index) => {
            item.animate([
            { height: '0%' },
            { height: `${arr[index] / 1.5 + 10}%` },
            { height: `${arr[index] / 1.5}%` }],
                { duration: 2000 })})
        blocks.map((item, index) => item.style.height = `${arr[index] / 1.5}%`);
    }

    searchPokemon() {
        let searchFilter = [];
        let btn = document.querySelector('.search_btn');
        let inp = document.querySelector('.search_inp');
        btn.classList.add('clicked-search');
        setTimeout(() => btn.classList.remove('clicked-search'), 500);
        this.state.pokemons.map((item, index) => {
            if (!isNaN(+inp.value) && item.id === +inp.value)
                searchFilter.push(item);
            else if (item.name.includes(inp.value.toLowerCase()))
                searchFilter.push(item);
        });
        if (searchFilter.length === 0) {
            inp.value = "";
            inp.style.animation = 'shake 1s ease-out';
            inp.placeholder = "We haven't such pokemon :(";
            setTimeout(() => inp.style.animation = '', 1000);
        }
        else
            this.setState({
                search: searchFilter
            });
    }

    addMore(howMany) {
        this.setState({
            limitPokemons:  this.state.limitPokemons + howMany
        })
    }

    render() {
        return (
            <div>
            <Header onClick={() => this.searchPokemon()}/>
                {
                    this.state.location === "main" ?
                        <div className="main-back">
                            <div className="container">
                                <div className="main-block_filling">
                                    {this.surpriseAndSort()}
                                    <div className="cards">
                                        {this.createCard()}
                                    </div>
                                    {
                                        this.state.limitPokemons < this.state.pokemons.length && this.state.search.length === 0 ||
                                            this.state.limitPokemons < this.state.search.length ?
                                        <div className="btn-add-wrapper">
                                            <button className="btn-add-card" onClick={() => this.addMore(10)}>+10</button>
                                            <button className="btn-add-card" onClick={() => this.addMore(20)}>+20</button>
                                            <button className="btn-add-card" onClick={() => this.addMore(30)}>+30</button>
                                        </div> : ''
                                    }
                                </div>
                            </div>
                        </div>
                            :
                            <div className="main-back">
                                <div className="container">
                                    <div className="main-block_filling">
                                        {this.createInfo()}
                                    </div>
                                </div>
                            </div>
                }
            </div>
        );
    }
}