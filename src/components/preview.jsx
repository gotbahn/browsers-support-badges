import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';

import marked from 'marked';
import Clipboard from 'clipboard';

import Icon from './icons';

class Preview extends React.Component {
    constructor() {
        super();

        this.state = {
            isCopied: null,
        };
    }

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
            '## Browsers support' +
            '\n\n' +
            browsers.map((item) => {
                if (item.support) {
                    return (
                        '| ' +
                        '[<img src="' + item.img + '" alt="' + item.name + '" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>' +
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
                this.setState({isCopied: true});

                setTimeout(() => {
                    copyCode.blur();
                }, 0);

                setTimeout(() => {
                    this.setState({isCopied: false});
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
            <div className='markdown'>
                <div className='markdown-body__wrap'>
                    <h3 className='markdown-body__title'>
                        <Icon.Book className="icon icon--book" /> README.md
                    </h3>
                    <div className='markdown-body'>
                        <div ref='mdPreview' />
                        <div className="tip">Click to collect code and paste it into yours README.md</div>
                    </div>
                    <span className='pointer pointer--inverse'>&#10548;</span>
                </div>
                <div className='markdown-code__wrap'>
                    <button
                        className='btn btn-copy btn--text'
                        ref='mdCopyBtn'
                        title='Click to copy to clipboard.'
                    >
                        {
                            this.state.isCopied ?
                                <Fragment>
                                    <Icon.Check className="icon--copy" />
                                    Copied
                                </Fragment>
                                :
                                <Fragment>
                                    <Icon.Clippy className="icon--copy" />
                                    Copy
                                </Fragment>
                        }
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
