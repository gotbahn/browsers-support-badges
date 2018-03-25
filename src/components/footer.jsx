/* eslint-disable */

import React from 'react';

setTimeout((function(d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.4&appId=263072313724602";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')),1e3);

setTimeout(function(){!function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'twitter-wjs');},1e3);

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-box">
                <div className="social-box__facebook social-box__item">
                    <div id="fb-root" />
                    <script>
                    </script>
                    <div
                        className="fb-like"
                        data-layout="button_count"
                        data-action="like"
                        data-show-faces="false"
                        data-share="false"
                    />
                </div>
                <div className="social-box__twitter social-box__item">
                    <a
                        href="https://twitter.com/share"
                        className="twitter-share-button"
                        data-via="bogdan_plieshka"
                        data-related="bogdan_plieshka"
                    />
                </div>
                <div className="social-box__item social-box__item--gh">
                    <iframe
                        src="https://ghbtns.com/github-btn.html?user=godban&repo=browsers-support-badges&type=watch&count=true"
                        frameBorder="0"
                        scrolling="0"
                        height="20px"
                    />
                </div>
            </div>
            <div className="footer__author">
                <a
                    className="octicon octicon-mark-github footer__link" href="https://github.com/godban"
                    target="_blank"
                />
            </div>
        </footer>
    );
};

export default Footer;
