import React, {Component} from 'react';
import colorType from "./colorType";
import Header from "./header";
import Cards from "./main/cards";
import axios from "axios";
import Sorting from "./main/sorting";
import AddButtons from "./main/addButtons";
import Info from "./info/info";

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
        axios.get('https://pokeapi.co/api/v2/pokemon?limit=800')
            .then(result => {
                this.setState({
                    isLoaded: true,
                    items: result.data.results
                });
            })
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    error
                });
            });
    }

    componentDidUpdate() {
        if (this.state.isLoaded) {
            this.state.items.map(async item => {
                const id = item.url.split('/')[item.url.split('/').length - 2];
                await this.findGender(item.name);
                await this.findCategoryAndDescription(item.name, id);
                this.generateOnePokemon(item.name);
            })
            this.setState({
                isLoaded: false
            })
        }
    }

    generateOnePokemon(name) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(
                result => {
                    let pushResult = this.state.pokemons;
                    result.data.types.map(type => this.findOutWeaknesses(type.type.url, result.data.name, result.data.types));
                    pushResult.push({
                        id: result.data.id,
                        name: result.data.name,
                        types: result.data.types,
                        weaknesses: this.state.weaknesses,
                        image: result.data.sprites.other['official-artwork'].front_default,
                        description: this.state.description[name],
                        parameters: {
                            height: result.data.height,
                            weight: result.data.weight,
                            gender: this.state.gender[name],
                            category: this.state.category[name],
                            abilities: result.data.abilities,
                            descriptionAbilities: result.data.abilities.map(item =>
                                this.findDescriptionAbilities(item.ability.url))
                        },
                        stats: {
                            hp: result.data.stats[0].base_stat,
                            attack: result.data.stats[1].base_stat,
                            defense: result.data.stats[2].base_stat,
                            special_Attack: result.data.stats[3].base_stat,
                            special_Defense: result.data.stats[4].base_stat,
                            speed: result.data.stats[5].base_stat
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
        await axios.get(`https://pokeapi.co/api/v2/gender/1/`)
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
        let gender = this.state.gender;
        female && male ? gender[name] = "♂ ♀" :
            female ? gender[name] = "♀" :
                male ? gender[name] = "♂" : gender[name] = "unknown";
        this.setState({
            gender: gender
        });
    }

    async findCategoryAndDescription(name, id) {
        let category = this.state.category;
        let description = this.state.description;
        let urlForEvolve;
        let evolveList = this.state.evolve;
        await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(
                (result) => {
                    category[name] = result.data.genera[7].genus.replace(' Pokémon', '');
                    result.data.flavor_text_entries.map(item => {
                        if (item.language.name === 'en')
                            description[name] = item.flavor_text.replace('\f', ' ');
                    });
                    urlForEvolve = result.data.evolution_chain.url;
                }
            )
        await axios.get(urlForEvolve)
            .then(evolve => {
                let evolveString = `${evolve.data.chain.species.name}_`;
                if (evolveList.length === 0)
                    evolveList.push(evolve.data.chain.species.name + '_' +
                        evolve.data.chain.evolves_to[0].species.name + '_' +
                        evolve.data.chain.evolves_to[0].evolves_to[0].species.name);
                else if (!evolveList[evolveList.length - 1].includes(name)) {
                    if (evolve.data.chain.evolves_to.length > 1)
                        evolve.data.chain.evolves_to.map((ev, index) => {
                            index !== evolve.data.chain.evolves_to.length - 1 ? evolveString += ev.species.name + '_' :
                                evolveString += ev.species.name;
                        });
                    else if (evolve.data.chain.evolves_to[0] !== undefined) {
                        evolveString += evolve.data.chain.evolves_to[0].species.name;
                        if (evolve.data.chain.evolves_to[0].evolves_to[0] !== undefined) {
                            evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[0].species.name;
                            if (evolve.data.chain.evolves_to[0].evolves_to[1] !== undefined)
                                evolveString += '_' + evolve.data.chain.evolves_to[0].evolves_to[1].species.name;
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
        await axios.get(url)
            .then(descriptionRes => {
                if (descriptionRes.data.effect_entries[0].language.name === "en")
                    description[descriptionRes.data.name] = descriptionRes.data.effect_entries[0].short_effect;
                else
                    description[descriptionRes.data.name] = descriptionRes.data.effect_entries[1].short_effect;
            });
        if (this.state.descriptionAbilities.length !== 0)
            this.setState({
                descriptionAbilities: description
            })
    }

    async findOutWeaknesses(url, name, types) {
        let weaknesses = this.state.weaknesses;
        let weaknessesList = [];
        let typeList = types.map(type => type.type.name);
        await axios.get(url)
            .then(weaknesses =>
                weaknesses.data.damage_relations.double_damage_from.map(weak => {
                    if (!typeList.includes(weak.name))
                        weaknessesList.push(weak.name)
                })
            )
        if (typeof weaknesses[name] !== "undefined") {
            let weaknessesName = weaknesses[name];
            weaknessesList.map(weakness => weaknessesName.push(weakness));
            weaknesses[name] = weaknessesName;
        }
        else
            weaknesses[name] = weaknessesList;
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
        document.querySelector(".search_inp").disabled = false;
    }

    addMore(howMany) {
        this.setState({
            limitPokemons:  this.state.limitPokemons + howMany
        })
    }

    handleChangeSearch(search) {
        this.setState({
            search: search
        });
    }

    handleChangeFilters(filterPokemons, limitPokemons, isAdd) {
        this.setState({
            filter: filterPokemons,
            limitPokemons: limitPokemons,
            isAdd: isAdd
        });
    }

    render() {
        return (
            <div>
            <Header pokemons={this.state.pokemons} changeState={this.handleChangeSearch.bind(this)}/>
                {
                    this.state.location === "main" ?
                        <div className="main-back">
                            <div className="container">
                                <div className="main-block_filling">
                                    <Sorting state={this.state}
                                             weaknesses={this.state.weaknesses}
                                             clickSurpriseMe={() => this.clickSurpriseMe()}
                                             visibleList={() => this.visibleList()}
                                             sorting={this.sorting.bind(this)}
                                             colorType={this.colorType.bind(this)}
                                             changeFilters={this.handleChangeFilters.bind(this)}/>
                                    <div className="cards">
                                        <Cards state={this.state}
                                                   clickCard={this.clickCard.bind(this)}
                                                   colorType={this.colorType.bind(this)}/>
                                    </div>
                                    <AddButtons state={this.state} addMore={this.addMore.bind(this)}/>
                                </div>
                            </div>
                        </div>
                            :
                            <div className="main-back">
                                <div className="container">
                                    <div className="main-block_filling">
                                        <Info state={this.state}
                                              clickCard={this.clickCard.bind(this)}
                                              colorType={this.colorType.bind(this)}
                                              clickBack={() => this.clickBack()}
                                              clickOnPrevious={this.clickOnPrevious.bind(this)}
                                              clickOnNext={this.clickOnNext.bind(this)}/>
                                    </div>
                                </div>
                            </div>
                }
            </div>
        );
    }
}