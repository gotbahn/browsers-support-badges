var BrowsersPanel = React.createClass({
    getInitialState: function () {
        return {
            initialBrowsers: [
                {
                    name: 'IE / Edge',
                    version: 2,
                    support: true
                },
                {
                    name: 'Firefox',
                    version: 2,
                    support: true
                },
                {
                    name: 'Chrome',
                    version: 2,
                    support: true
                },
                {
                    name: 'Safari',
                    version: 2,
                    support: true
                },
                {
                    name: 'Opera',
                    version: 2,
                    support: false
                }
                //    {
                //        name: 'iOS Safari',
                //        version: ['last two version']
                //    },
                //    {
                //        name: 'Opera Mini',
                //        version: ['last two version']
                //    },
                //    {
                //        name: 'Chrome for Android',
                //        version: ['last two version']
                //    }
            ],
            browsers: {}
        };
    },
    componentWillMount: function () {
        this.setState({browsers: this.state.initialBrowsers});
    },
    handleVersionChange: function (event) {
        var target = event.target,
            browsers = this.state.browsers;

        browsers[target.dataset.id].version = target.value;
        this.setState({browsers: browsers});
    },
    handleVersionVary: function (event) {
        var target = event.target,
            id = target.dataset.id,
            btnDown = React.findDOMNode(this.refs['btnDown' + id]),
            btnUp = React.findDOMNode(this.refs['btnUp' + id]),
            browsers = this.state.browsers,
            VERSION_MAX = 10;

        if (target === btnUp) {
            if (browsers[id].version === 1) {
                btnDown.disabled = false;
            }
            if (browsers[id].version < VERSION_MAX) {
                browsers[id].version++;
            }
            if(browsers[id].version === VERSION_MAX) {
                target.disabled = true;
            }
        } else {
            if (browsers[id].version === VERSION_MAX) {
                btnUp.disabled = false;
            }
            if (browsers[id].version > 1) {
                browsers[id].version--;
            }
            if(browsers[id].version === 1) {
                target.disabled = true;
            }
        }
        this.setState({browsers: browsers});
    },
    handleBrowserSupport: function(event) {
        var target = event.target,
            id = target.dataset.index,
            browsers = this.state.browsers;

        browsers[id].support = !browsers[id].support;
        this.setState({browsers: browsers});
    },
    render: function () {
        return (
            <div>
                <div className='table'>
                    <div className='table__row'>
                        {this.state.browsers.map(function (item, index) {
                            return (
                                <div
                                    className='table__cell table__cell--heading'
                                    key={item.name}>
                                    <input
                                        id={'check' + item.name}
                                        className='form__checkbox'
                                        data-index={index}
                                        defaultChecked={item.support}
                                        onChange={this.handleBrowserSupport}
                                        type='checkbox' />
                                    <label htmlFor={'check' + item.name}>{item.name}</label>
                                </div>
                            );
                        }, this)}
                    </div>
                    <div className='table__row'>
                        {this.state.browsers.map(function (item, index) {
                            return (
                                <div
                                    className='table__cell browser-version__control'
                                    key={item.name + 'control'}>
                                    last
                                    <input
                                        className='form__input form__input--text form__input--no-spinners'
                                        data-id={index}
                                        onChange={this.handleVersionChange}
                                        value={item.version}
                                        type='number'/> verions
                                    <button
                                        className='btn btn--text btn-up'
                                        data-id={index}
                                        ref={'btnUp' + index}
                                        onClick={this.handleVersionVary}
                                        type='button'>↑
                                    </button>
                                    <button
                                        className='btn btn--text btn-down'
                                        data-id={index}
                                        ref={'btnDown' + index}
                                        onClick={this.handleVersionVary}
                                        type='button'>↓
                                    </button>
                                </div>
                            );
                        }, this)}
                    </div>
                </div>
                <BrowsersResult items={this.state.browsers}/>
            </div>
        );
    }
});

var BrowsersResult = React.createClass({
    render: function () {
        return (
            <div className='table'>
                <div className='table__row'>
                    {this.props.items.map(function (item) {
                        return (
                            <div
                                className='table__cell table__cell--heading'
                                disabled={!item.support}
                                key={item.name}>{item.name}</div>
                        );
                    })}
                </div>
                <div className='table__row'>
                    {this.props.items.map(function (item) {
                        return (
                            <div
                                className='table__cell browser-version__control'
                                disabled={!item.support}
                                key={item.name + 'control'}>
                                last {item.version} version
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

React.render(<BrowsersPanel />, document.getElementById('main'));
