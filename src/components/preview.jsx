import React from 'react';
import ReactDOM from 'react-dom';

import marked from 'marked';
import Clipboard from 'clipboard';

class Preview extends React.Component {
    createMDCode() {
        const {browsers} = this.props;

        let i = 0;
        let mdStringHeadingLine = '';

        for (i; i < browsers.length; i++) {
            if (browsers[i].support) {
                mdStringHeadingLine += '| --------- ';
            }
        }

        return (
            '## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>' +
            '\n\n' +
            browsers.map((item) => {
                if (item.support) {
                    return (
                        '| ' +
                        '[<img src="' + item.img + '" alt="' + item.name + '" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>' +
                        item.name + ' ');
                }

                return null;
            }).join('') +
            '|\n' +
            mdStringHeadingLine +
            '|\n' +
            browsers.map((item) => {
                if (item.support) {
                    if (item.name === 'IE / Edge') {
                        const ieSupportedVersions = [];

                        for (let key in item.version) {
                            if (item.version[key]) {
                                ieSupportedVersions.push(key);
                            }
                        }

                        return '| ' + ieSupportedVersions.join(', ');
                    } else {
                        if (item.version === 1) {
                            return '| last version';
                        } else {
                            return '| last ' + item.version + ' versions';
                        }
                    }
                }

                return null;
            }).join('')
        );
    }

    createMDPreview() {
        const mdString = this.createMDCode();

        return marked(mdString, {
            gfm: true,
            tables: true
        });
    }

    componentDidMount() {
        const copyAction = ReactDOM.findDOMNode(this.refs.mdCopyBtn);
        const copyCode = ReactDOM.findDOMNode(this.refs.mdCode);

        new Clipboard(copyAction, {
            target: () => {
                copyAction.classList.add('btn-copy--done');
                copyAction.textContent = 'Copied';

                setTimeout(function () {
                    copyCode.blur();
                }, 0);

                setTimeout(function () {
                    copyAction.classList.remove('btn-copy--done');
                    copyAction.textContent = 'Copy';
                }, 2000);

                return copyCode;
            }
        });

        ReactDOM.findDOMNode(this.refs.mdPreview).innerHTML = this.createMDPreview();
        ReactDOM.findDOMNode(this.refs.mdCode).value = this.createMDCode();
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this.refs.mdPreview).innerHTML = this.createMDPreview();
        ReactDOM.findDOMNode(this.refs.mdCode).value = this.createMDCode();
    }

    render() {
        return (
            <div className='markdown__wrap'>
                <article className='markdown-body__wrap'>
                    <h2 className='markdown-body__title'>
                        <span className='octicon octicon-book' /> README.md
                    </h2>
                    <div className='markdown-body'>
                        <div ref='mdPreview' />
                        Wanna? Just push a button and paste code below into your README.md
                    </div>
                    <span className='pointer pointer--inverse'>&#10548;</span>
                </article>
                <div className='markdown-code__wrap'>
                    <button
                        className='btn btn-copy btn--text'
                        ref='mdCopyBtn'
                        title='Click to copy to clipboard.'
                    >
                        Copy
                    </button>
                    <textarea
                        id='mdCode'
                        className='markdown-code'
                        ref='mdCode'
                        readOnly
                    />
                </div>
            </div>
        );
    }

}

export default Preview;
