import React, {Component} from 'react';

export default class Header extends Component {
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
                            <button className="search_btn" onClick={() => this.props.onClick()}>
                                <img className="search-btn_img" src="images/search_white.png"/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}