/* eslint-disable */

import React from 'react';

import Icon from './icons';

(function(d,s,id){let js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src='https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=1547693265447721&autoLogAppEvents=1';fjs.parentNode.insertBefore(js,fjs);}(document,'script','facebook-jssdk'));

const Footer = () => {
    return (
        <footer className="footer">
            <div className="author">
                made by
                <a
                    className="authorLink"
                    href="https://github.com/godban"
                    target="_blank"
                    rel="author"
                >
                    <Icon.MarkGithub className="authorIcon" />
                    {'godban'}
                </a>
            </div>
            <div className="social-box">
                <div className="social-box__item social-box__item--gh">
                    <a
                        className="github-button"
                        href="https://github.com/godban/browsers-support-badges"
                        data-icon="octicon-star"
                        data-show-count="true"
                        aria-label="Star godban/browsers-support-badges on GitHub"
                    >Star</a>
                </div>
                <div className="social-box__twitter social-box__item">
                    <a
                        href="https://twitter.com/share"
                        className="twitter-share-button"
                        data-show-count="false"
                    >Tweet</a>
                </div>
                <div className="social-box__facebook social-box__item">
                    <div
                        className="fb-like"
                        data-href="http://godban.github.io/browsers-support-badges"
                        data-layout="button_count"
                        data-action="like"
                        data-size="small"
                        data-show-faces="false"
                        data-share="false"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
