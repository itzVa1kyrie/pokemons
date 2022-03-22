import React, { useRef } from 'react';
import GenerateEvolve from "./generateEvolve";
import GenerateStats from "./generateStats";
import GenerateParameters from "./generateParameters";

export default function Info(props) {
    const abilities_one = useRef([]);
    const closeDescription = () => {
        let block = [...abilities_one.current.children];
        block.shift();
        let blockDesc = [];
        block.map(item => blockDesc.push([...item.children][1]));
        blockDesc.map((item, index) => {
            block[index].style.width = '150px';
            block[index].classList.remove('active-desc-block');
            blockDesc[index].classList.remove('active-ability');
        });
    }

    const clickOnPrevious = (id) => {
        let newId;
        if (id === 0)
            newId = props.pokemons.length - 1;
        else
            newId = id - 1;
        props.changeId(newId);
        closeDescription();
    }

    const clickOnNext = (id) => {
        let newId;
        if (id + 1 === props.pokemons.length)
            newId = 0;
        else
            newId = id + 1;
        props.changeId(newId);
        closeDescription();
    }

    const clickDescription = (ability) => {
        let block = [...abilities_one.current.children];
        block.shift();
        let blockDesc = [];
        let blockName = [];
        block.map(item => {
            blockName.push([...item.children][0]);
            blockDesc.push([...item.children][1]);
        });
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

    const createInfo = () => {
        window.scroll(0, 0);
        let item;
        props.pokemons.map(pokemon => {
            if (pokemon.id - 1 === props.activeId)
                item = pokemon;
        });
        let prevId = item.id - 1 === 0 ? props.pokemons.length : item.id - 1;
        let nextId = item.id === props.pokemons.length ? 1 : item.id + 1;
        let evolve;
        props.pokemons.map(it => {
            if (it.evolve.includes(item.name))
                evolve = it.evolve.split('_');
        })
        let evolveBlocks = GenerateEvolve(evolve, props.pokemons, props.clickCard, props.colorType);
        console.log(item.parameters.descriptionAbilities);
        return (
            <div className="wrapper-info">
                <button className="back-to-main" onClick={() => props.clickBack()}/>
                <div className="main-block">
                    <div className="main_name-block" style={{width: '300px', padding: '0'}}>
                        <p className="main-name-block_name"><span className="number-color">#{item.id}</span> {item.name}
                        </p>
                    </div>
                    <div className="wrapper-main-btn">
                        <div className="wrapper-prev">
                            <button onClick={() => clickOnPrevious(props.activeId)} className="wrapper-prev_btn"/>
                            <p className="wrapper-prev_name"><span className="number-color numb">#{prevId}</span> {
                                props.pokemons[props.pokemons.findIndex(el => el.id === prevId)].name}
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
                                            {item.types.map(type => props.colorType(type.type.name))}
                                        </div>
                                    </div>
                                    <div className="main-filling-info_type">
                                        <p className="info-type_title">Weaknesses</p>
                                        <div className="info-weak_list">
                                            {item.weaknesses.map(type => props.colorType(type))}
                                        </div>
                                    </div>
                                </div>
                                <div ref={abilities_one} className="main-filling-info_abilities">
                                    <p className="info-type_title">Abilities</p>
                                    {item.parameters.abilities.map((it, index) => {
                                        return (
                                            <div key={index} className="abilities_one"
                                                 onClick={() => clickDescription(it.ability.name)}>
                                                <p className="abilities-one_name">{it.ability.name}</p>
                                                <p className="abilities-one_desc">
                                                    {item.parameters.descriptionAbilities[it.ability.name]}
                                                </p>
                                            </div>);
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="wrapper-next">
                            <button onClick={() => clickOnNext(props.activeId)} className="wrapper-next_btn"/>
                            <p className="wrapper-next_name"><span className="number-color numb">#{nextId}</span> {
                                props.pokemons[props.pokemons.findIndex(el => el.id === nextId)].name}
                            </p>
                        </div>
                    </div>
                    <div className="main_additional-fill">
                        <GenerateStats item={item} />
                        <GenerateParameters pokemons={props.pokemons} activeId={props.activeId}/>
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
    return createInfo();
}