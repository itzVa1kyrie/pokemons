import React from 'react';
import {render} from 'react-dom';
import Main from "./main";
import Header from "./header";
import "./styles/main.css"
import "bootstrap/dist/css/bootstrap-grid.css"

function Site() {
    return (
        <div>
            <Main />
        </div>
    );
}

render(<Site />, document.getElementById('root'));
