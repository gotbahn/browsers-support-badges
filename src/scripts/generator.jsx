var BrowsersPanel = React.createClass({
    getInitialState: function () {
        var pathToImages = 'https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/';
        return {
            initialBrowsers: [
                {
                    name: 'IE / Edge',
                    version: {
                        IE7: false,
                        IE8: false,
                        IE9: true,
                        IE10: true,
                        IE11: true,
                        Edge: true
                    },
                    img: pathToImages + 'edge.png',
                    support: true
                },
                {
                    name: 'Firefox',
                    version: 2,
                    img: pathToImages + 'firefox.png',
                    support: true
                },
                {
                    name: 'Chrome',
                    version: 2,
                    img: pathToImages + 'chrome.png',
                    support: true
                },
                {
                    name: 'Safari',
                    version: 2,
                    img: pathToImages + 'safari.png',
                    support: true
                },
                {
                    name: 'Opera',
                    version: 2,
                    img: pathToImages + 'opera.png',
                    support: true
                },
                {
                    name: 'iOS Safari',
                    version: 2,
                    img: pathToImages + 'safari-ios.png',
                    support: false
                },
                {
                    name: 'Opera Mini',
                    version: 2,
                    img: pathToImages + 'opera-mini.png',
                    support: false
                },
                {
                    name: 'Chrome for Android',
                    img: pathToImages + 'chrome-android.png',
                    version: 2,
                    support: false
                }
            ],
            browsers: {}
        };
    },
    componentWillMount: function () {
        this.setState({browsers: this.state.initialBrowsers});
    },
    isLastActive: function(arr, id) {
        var supportCounter = 0;

        arr.map(function(item) {
            if (item.support) supportCounter++;
        });

        if (supportCounter === 1 && arr[id].support) return true;
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

        if (this.isLastActive(browsers, id)) return;

        browsers[id].support = !browsers[id].support;

        if (browsers[id].name === 'IE / Edge') {
            for (key in browsers[id].version) {
                if (browsers[id].support) {
                    if (key !== 'IE7' && key !== 'IE8') browsers[id].version[key] = true;
                } else {
                    browsers[id].version[key] = false;
                }
            }
        }

        this.setState({browsers: browsers});
    },
    handleIEVersionsChange: function(event) {
        var target = event.target,
            key = target.dataset.key,
            browsers = this.state.browsers,
            supportLength = 0;

        browsers[0].version[key] = !browsers[0].version[key];

        for (supportKey in browsers[0].version) {
            if (browsers[0].version[supportKey]) supportLength++;
        }

        browsers[0].support = (supportLength !== 0);

        this.setState({browsers: browsers});
    },
    render: function () {
        return (
            <div className='browsers__wrap'>
                <h1 className='main__title'>
                    Browsers support badges for README.md
                    <span className='main__sub-title'><span className="octicon octicon-mark-github" /> GitHub Flavored Markdown</span>
                </h1>
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
                                        checked={item.support}
                                        onChange={this.handleBrowserSupport}
                                        type='checkbox' />
                                    <label
                                        className='browser__checkbox-label browser__title'
                                        htmlFor={'check' + item.name}>
                                        <span className='browser__title-text'>{item.name}</span>
                                    </label>
                                </div>
                                {(item.name === 'IE / Edge') ?
                                <div className='browser__control browser__control--ie'>
                                    {Object.keys(item.version).map(function(key) {
                                        return (
                                            <div className='browser__control-ie-version' key={key}>
                                                <input
                                                    id={'check' + key}
                                                    className='form__checkbox browser__checkbox'
                                                    data-key={key}
                                                    defaultChecked={item.version[key]}
                                                    checked={item.version[key]}
                                                    onChange={this.handleIEVersionsChange}
                                                    type='checkbox' />
                                                <label
                                                    className='browser__checkbox-label browser__checkbox-label--small'
                                                    htmlFor={'check' + key}>{key}</label>
                                            </div>
                                        );
                                    }, this)}
                                </div>
                                :
                                <div className='browser__control'>
                                    last
                                    <input
                                        className='form__input form__input--text form__input--no-spinners'
                                        data-id={index}
                                        onChange={this.handleVersionChange}
                                        value={item.version}
                                        max='10'
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
                                </div>}
                            </div>
                        );
                    }, this)}
                    <span className='pointer'>&#10549;</span>
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

        mdString =  '## Browsers support <sub><sup><sub><sub>made by @godban</sub></sub></sup></sub>' +
                    '\n\n' +
                    browsers.map(function(item) {
                        if (item.support) return (
                            '| ' +
                            '[<img src="' + item.img + '" alt="' + item.name + '" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>' +
                            item.name + ' ');
                    }).join('') +
                    '|\n' +
                    mdStringHeadingLine +
                    '|\n' +
                    browsers.map(function(item) {
                        if (item.support) {
                            if (item.name === 'IE / Edge') {
                                var ieSupportedVersions = [];
                                for (key in item.version) {
                                    if (item.version[key]) {
                                        ieSupportedVersions.push(key);
                                    }
                                }
                                return '| ' + ieSupportedVersions.join(', ');
                            } else {
                                if (item.version === 1) {
                                    return '| last version';
                                } else {
                                    return '| last ' +  item.version + ' versions';
                                }
                            }
                        }
                    }).join('');

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
        var copy = new ZeroClipboard(React.findDOMNode(this.refs.mdCopyBtn));

        copy.on('aftercopy', function(event) {
            var target = event.target;
            target.classList.add('btn-copy--done');
            target.textContent = 'Copied';
            setTimeout(function(){
                target.classList.remove('btn-copy--done');
                target.textContent = 'Copy';
            }, 2000);
        });

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
                    <h2 className='markdown-body__title'>
                        <span className='octicon octicon-book' /> README.md
                    </h2>
                    <div className='markdown-body'>
                        This is how it's gonna looks like on GitHub:
                        <div ref='mdPreview' />
                        Wanna? Just push a button and paste code below into your README.md
                    </div>
                    <span className='pointer pointer--inverse'>&#10548;</span>
                </article>
                <div className='markdown-code__wrap'>
                    <button
                        className='btn btn-copy btn--text'
                        ref='mdCopyBtn'
                        data-clipboard-target='mdCode'
                        title='Click to copy to clipboard.'>Copy</button>
                    <textarea
                        id='mdCode'
                        className='markdown-code'
                        ref='mdCode' />
                </div>
            </div>
        );
    }
});

React.render(<BrowsersPanel />, document.getElementById('main'));
