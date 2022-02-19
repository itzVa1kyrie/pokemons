import React, {Component} from 'react';

export default class Header extends Component {
    searchPokemon() {
        let searchFilter = [];
        let btn = document.querySelector('.search_btn');
        let inp = document.querySelector('.search_inp');
        btn.classList.add('clicked-search');
        setTimeout(() => btn.classList.remove('clicked-search'), 500);
        this.props.pokemons.map(item => {
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
            setTimeout(() => inp.placeholder = 'Search your pokemon...', 2000);
        }
        else
            this.props.changeState(searchFilter);
    }

    render() {
        return (
            <header className="header">
                <div className="container header_flex-wrapper">
                    <a href="/">
                        <img className="header-flex-wrapper_img" src="images/logo.png"/>
                    </a>
                    <div className="header-flex-wrapper_search">
                        <p className="search_hint">Enter the name or number of the pokemon</p>
                        <div>
                            <input className="search_inp" placeholder="Search your pokemon..."/>
                            <button className="search_btn" onClick={() => this.searchPokemon()}>
                                <img className="search-btn_img" src="images/search_white.png"/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}