export function makeUniComponent(timestamp) {
    function generateSalt() {
        const set = 'abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
        let salt = '';
        for (let i = 0; i < 10; i++) {
            const p = Math.floor(Math.random() * set.length);
            salt += set[p];
        }
        return salt;
    }

    const date = (+timestamp).toString();
    const salt = generateSalt();

    return [salt, date].join('');
};

export function convertStrToDom(content) {
    const dom = document.createElement('div');
    dom.innerHTML = content;

    return dom;
}

export function calculateSizeRatio(realObj, ruleObj) {
    const res = {};
    for (let key in ruleObj) {
        res[key] = ruleObj[key] / (realObj[key] === 0 ? NaN : realObj[key]);
    }

    return res;
}

export function parseSVGBBox(paletteDom, svgDom) {
    let bbox;

    svgDom.setAttribute('style', 'width: 0px; height: 0px;');
    paletteDom.appendChild(svgDom);
    bbox = svgDom.getBBox();
    paletteDom.removeChild(svgDom);

    return bbox;
}
