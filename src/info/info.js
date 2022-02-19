import React, {Component} from 'react';

export default class Info extends Component {
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

    animation(hp, attack, defense, specAtt, specDef, speed) {
        let blocks = [...document.querySelectorAll(".stats-block_filling")];
        let numbers = [...document.querySelectorAll(".stats-block_numb")];
        let arr = [hp, attack, defense, specAtt, specDef, speed];
        blocks.map((item, index) => {
            item.animate([
                    { height: '0%' },
                    { height: `${arr[index] / 2.2 + 10}%` },
                    { height: `${arr[index] / 2.2}%` }],
                { duration: 2000 })})
        blocks.map((item, index) => item.style.height = `${arr[index] / 2.2}%`);
        numbers.map((item, index) => {
            item.textContent = arr[index];
        })
    }

    createInfo() {
        window.scroll(0, 0);
        document.querySelector(".search_inp").disabled = true;
        let item;
        this.props.state.pokemons.map(pokemon => {
            if (pokemon.id - 1 === this.props.state.activeId)
                item = pokemon;
        });
        let prevId = item.id - 1 === 0 ? this.props.state.pokemons.length : item.id - 1;
        let nextId = item.id === this.props.state.pokemons.length ? 1 : item.id + 1;
        setTimeout(this.animation, 1,
            item.stats.hp, item.stats.attack, item.stats.defense,
            item.stats.special_Attack, item.stats.special_Defense, item.stats.speed);
        let evolve;
        this.props.state.evolve.map(it => {
            if (it.includes(item.name))
                evolve = it.split('_');
        })
        let evolveBlocks;
        if (evolve === undefined) {
            evolveBlocks =
                <div className="evolution-wrapper_one">
                    <p className="evolution-wrapper-one_name">
                        No evolutions
                    </p>
                </div>
        }
        else
            evolveBlocks = evolve.map(ev => {
                return this.props.state.pokemons.map(pokemon => {
                    if (pokemon.name === ev) {
                        return (
                            <div key={pokemon.id} className="evolution-wrapper_one">
                                <div className="evolution-wrapper-one_bubble" onClick={() => this.props.clickCard(pokemon.id)}>
                                    <img className="evolution-wrapper-one_img" src={pokemon.image} alt={`${pokemon.name}.png`}/>
                                </div>
                                <p className="evolution-wrapper-one_name" onClick={() => this.props.clickCard(pokemon.id)}>
                                    <span className="number-color">#{pokemon.id}</span> {pokemon.name}
                                </p>
                                <div className="evolution-wrapper-one_type">
                                    {pokemon.types.map(type => this.props.colorType(type.type.name))}
                                </div>
                            </div>
                        );
                    }
                })
        })
        return (
            <div className="wrapper-info">
                <button className="back-to-main" onClick={() => this.props.clickBack()}/>
                <div className="main-block">
                    <div className="main_name-block" style={{width: '300px', padding: '0'}}>
                        <p className="main-name-block_name"><span className="number-color">#{item.id}</span> {item.name}
                        </p>
                    </div>
                    <div className="wrapper-main-btn">
                        <div className="wrapper-prev">
                            <button onClick={() => this.props.clickOnPrevious(this.props.state.activeId)} className="wrapper-prev_btn"/>
                            <p className="wrapper-prev_name"><span className="number-color numb">#{prevId}</span> {
                                this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === prevId)].name}
                            </p>
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
                                            {item.types.map(type => this.props.colorType(type.type.name))}
                                        </div>
                                    </div>
                                    <div className="main-filling-info_type">
                                        <p className="info-type_title">Weaknesses</p>
                                        <div className="info-weak_list">
                                            {item.weaknesses[item.name].map(type => this.props.colorType(type))}
                                        </div>
                                    </div>
                                </div>
                                <div className="main-filling-info_abilities">
                                    <p className="info-type_title">Abilities</p>
                                    {item.parameters.abilities.map((item, index) => {
                                        return (
                                            <div key={index} className="abilities_one" onClick={() => this.clickDescription(item.ability.name)}>
                                                <p className="abilities-one_name">{item.ability.name}</p>
                                                <p className="abilities-one_desc">{this.props.state.descriptionAbilities[item.ability.name]}</p>
                                            </div>);
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="wrapper-next">
                            <button onClick={() => this.props.clickOnNext(this.props.state.activeId)} className="wrapper-next_btn"/>
                            <p className="wrapper-next_name"><span className="number-color numb">#{nextId}</span> {
                                this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === nextId)].name}
                            </p>
                        </div>
                    </div>
                    <div className="main_additional-fill">
                        <div className="additional-fill_stats">
                            <div className="stats_block">
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
                                <div className="stats-block_filling">
                                    <p className="stats-block_numb"/>
                                </div>
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
                                <p className="param_fill">{this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === this.props.state.activeId + 1)].parameters.height / 10} m</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Weight</p>
                                <p className="param_fill">{this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === this.props.state.activeId + 1)].parameters.weight / 10} kg</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Gender</p>
                                <p className="param_fill">{this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === this.props.state.activeId + 1)].parameters.gender}</p>
                            </div>
                            <div className="additional-fill-params_param">
                                <p className="param_name">Category</p>
                                <p className="param_fill">{this.props.state.pokemons[this.props.state.pokemons.findIndex(el => el.id === this.props.state.activeId + 1)].parameters.category}</p>
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

    render() {
        return this.createInfo();
    }
}