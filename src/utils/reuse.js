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

export function formatSVGHtmlToStr(palette, domNameArr, lineTag) {
    function parseAttribute(attribute) {
        const data = {};
        for (let key in attribute) {
            if (attribute.hasOwnProperty(key)) {
                data[attribute[key].name] = attribute[key].value;
            }
        }

        return data;
    }
    function processLinkData(el, tag) {
        const dom = el.querySelector(['[', tag, ']'].join(''));

        return dom ?  dom.getAttribute(tag) : null;
    }

    const nameArr = domNameArr.slice();
    const selector = nameArr.slice().reduce(function (prev, item) {
        return prev.concat([['[name=', item, ']'].join('')]);
    }, []).join();
    const targetArr = Array.from(palette.querySelectorAll(selector));
    const res = targetArr.reduce(function (prev, item) {
        const data = parseAttribute(item.attributes);
        const parent = item.parentNode;

        data[lineTag] = processLinkData(item, lineTag);
        data.parentId = (parent.id && nameArr.includes(parent.getAttribute('name'))) ? parent.id : null;
        return prev.concat([data]);
    }, []);


    return JSON.stringify(res);
}

export function formatSVGStrToHTML(contentArr, conf) {
    function processContent(data) {
        const result = data.reduce(function (prev, item) {
            prev[item.parentId] ? prev[item.parentId].push(item) : prev[item.parentId] = [item];
            return prev;
        }, {});

        for (let key in result) {
            result[key].forEach(function (item, index) {
                result[item.id] ? item.children = result[item.id] : [];
            });
        }

        return result[null];
    }
    function initDOM(dom, option) {
        for (let key in option) {
            dom.setAttribute(key, option[key]);
        }
        return dom;
    }
    function filterObj(data, exclNameArr) {
        const res = {};
        for (let key in data) {
            if (exclNameArr.includes(key)) continue;
            if (key.indexOf('data-v-') !== -1) continue;
            res[key] = data[key];
        }

        return res;
    }
    function parseBaseComponent(el, tag) {
        const selector = ['[', tag, ']'].join('');
        const targetArr = Array.from(el.querySelectorAll(selector));

        return targetArr.reduce(function (prev, item) {
            prev[item.getAttribute(tag)] = item.outerHTML;
            return prev;
        }, {});
    }
    function strToDom(content) {
        const dom = document.createElement('div');
        dom.innerHTML = content;

        return dom.children[0];
    }

    const tag = conf.tag;
    const el = conf.el;
    const baseHTML = parseBaseComponent(el, tag);
    const deepContent = processContent(contentArr);
    const svg = document.createElement('svg');
    const exclKey = ['children', 'parentId', tag];
    const createSvgDom = function (confArr, parent) {
        if (!Array.isArray(confArr)) return;
        confArr.forEach(function (item) {
            if (item[tag] !== void 0) {
                const el = strToDom(baseHTML[item[tag]]);
                initDOM(el, filterObj(item, exclKey));
                parent.appendChild(el);
                createSvgDom(item.children, el);
            }
        });
    }

    createSvgDom(deepContent, svg);

    return svg.outerHTML;
}
