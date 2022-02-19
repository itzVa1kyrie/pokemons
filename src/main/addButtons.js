import React, {Component} from 'react';

export default class AddButtons extends Component {
    render() {
        return (
            this.props.state.limitPokemons < this.props.state.pokemons.length && this.props.state.search.length === 0 ||
            this.props.state.limitPokemons < this.props.state.search.length ?
                <div className="btn-add-wrapper">
                    <button className="btn-add-card" onClick={() => this.props.addMore(10)}>+10</button>
                    <button className="btn-add-card" onClick={() => this.props.addMore(20)}>+20</button>
                    <button className="btn-add-card" onClick={() => this.props.addMore(30)}>+30</button>
                </div> : ''
        );
    }
}