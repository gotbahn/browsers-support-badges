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
                },
                {
                    name: 'iOS Safari',
                    version: 2,
                    support: true
                },
                {
                    name: 'Opera Mini',
                    version: 2,
                    support: false
                },
                {
                    name: 'Chrome for Android',
                    version: 2,
                    support: true
                }
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
            if (browsers[id].version === VERSION_MAX) {
                target.disabled = true;
            }
        } else {
            if (browsers[id].version === VERSION_MAX) {
                btnUp.disabled = false;
            }
            if (browsers[id].version > 1) {
                browsers[id].version--;
            }
            if (browsers[id].version === 1) {
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
            <div className='browsers__wrap'>
                <h1 className='main__title'>Browsers support badges for README.md</h1>
                <div className='browser__wrap'>
                    {this.state.browsers.map(function (item, index) {
                        return (
                            <div
                                className='browser'
                                key={item.name}
                                disabled={!item.support}>
                                <div className='browser__heading'>
                                    <input
                                        id={'check' + item.name}
                                        className='form__checkbox browser__checkbox'
                                        data-index={index}
                                        defaultChecked={item.support}
                                        onChange={this.handleBrowserSupport}
                                        type='checkbox' />
                                    <label
                                        className='browser__title'
                                        htmlFor={'check' + item.name}>
                                        <span className='browser__title-text'>{item.name}</span>
                                    </label>
                                </div>
                                <div className='browser__control'>
                                    last
                                    <input
                                        className='form__input form__input--text form__input--no-spinners'
                                        data-id={index}
                                        onChange={this.handleVersionChange}
                                        value={item.version}
                                        type='number' />
                                    <button
                                        className='btn btn--text btn-up'
                                        data-id={index}
                                        ref={'btnUp' + index}
                                        onClick={this.handleVersionVary}
                                        type='button' />
                                    <button
                                        className='btn btn--text btn-down'
                                        data-id={index}
                                        ref={'btnDown' + index}
                                        onClick={this.handleVersionVary}
                                        type='button' />
                                </div>
                            </div>
                        );
                    }, this)}
                </div>
                <BrowsersResult items={this.state.browsers}/>
            </div>
        );
    }
});

var BrowsersResult = React.createClass({
    createMDCode: function() {
        var browsers = this.props.items,
            i = 0,
            mdStringHeadingLine = '',
            mdString = '';

        for (i; i < browsers.length; i++) {
            if (browsers[i].support) mdStringHeadingLine += '| --------- ';
        }

        mdString =  browsers.map(function(item) {
                        if (item.support) return '| ' + item.name + ' ';
                    }).join('') +
                    '|\n' +
                    mdStringHeadingLine +
                    '|\n' +
                    browsers.map(function(item) {
                        if (item.support) return '| last ' +  item.version + ' versions';
                    }).join('');

        console.log('firing!');

        return mdString;
    },
    createMDPreview: function() {
        var mdString = this.createMDCode();
        return marked(mdString, {
            gfm: true,
            tables: true
        });
    },
    componentDidMount: function() {
        var client = new ZeroClipboard(React.findDOMNode(this.refs.mdCopyBtn));

        React.findDOMNode(this.refs.mdPreview).innerHTML = this.createMDPreview();
        React.findDOMNode(this.refs.mdCode).textContent = this.createMDCode();
    },
    componentDidUpdate: function() {
        React.findDOMNode(this.refs.mdPreview).innerHTML = this.createMDPreview();
        React.findDOMNode(this.refs.mdCode).textContent = this.createMDCode();
    },
    render: function () {
        return (
            <div className='markdown__wrap'>
                <article className='markdown-body__wrap'>
                    <h2 className='markdown-body__title'><span className='octicon octicon-book' /> README.md</h2>
                    <div className='markdown-body'>
                        <div ref='mdPreview' />
                        This is how it's gonna looks like in README.md
                    </div>
                </article>
                <div className='markdown-code__wrap'>
                    <button
                        className='btn btn-copy btn--text'
                        ref='mdCopyBtn'
                        data-clipboard-target='mdCode'
                        title='Click to copy to clipboard.'>Copy</button>
                    <div
                        id='mdCode'
                        className='markdown-code'
                        ref='mdCode' />
                </div>
            </div>
        );
    }
});

React.render(<BrowsersPanel />, document.getElementById('main'));
