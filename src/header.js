import React, {useEffect, useRef} from 'react';

export default function Header(props) {
    const btn = useRef(null);
    const inp = useRef(null);

    useEffect(() => {
        props.changeDisable(inp);
    }, [props.location]);

    const searchPokemon = () => {
        let searchFilter = [];
        btn.current.classList.add('clicked-search');
        setTimeout(() => btn.current.classList.remove('clicked-search'), 500);
        props.pokemons.map(item => {
            if (!isNaN(+inp.current.value) && item.id === +inp.current.value)
                searchFilter.push(item);
            else if (item.name.includes(inp.current.value.toLowerCase()))
                searchFilter.push(item);
        });
        if (searchFilter.length === 0) {
            inp.current.value = "";
            inp.current.style.animation = 'shake 1s ease-out';
            inp.current.placeholder = "We haven't such pokemon :(";
            setTimeout(() => inp.current.style.animation = '', 1000);
            setTimeout(() => inp.current.placeholder = 'Search your pokemon...', 2000);
        }
        else
            props.changeState(searchFilter);
    }

    return (
        <header className="header">
            <div className="container header_flex-wrapper">
                <a href="/">
                    <img className="header-flex-wrapper_img" src="images/logo.png" alt=""/>
                </a>
                <div className="header-flex-wrapper_search">
                    <p className="search_hint">Enter the name or number of the pokemon</p>
                    <div>
                        <input ref={inp} className="search_inp" placeholder="Search your pokemon..."/>
                        <button ref={btn} className="search_btn" onClick={searchPokemon}>
                            <img className="search-btn_img" src="images/search_white.png" alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}