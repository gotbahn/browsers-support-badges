import React, {Component} from 'react';

import Panel from './panel';
import Footer from './footer';

class App extends Component {
    render() {
        return (
            <main className="main">
                <Panel/>
                <Footer/>
            </main>
        );
    }
}

export default App;
