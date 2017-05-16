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

        return dom ? dom.getAttribute(tag) : null;
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


export function formatSVGStrToHTML(contentStr, conf) {
    function processContent(data,  componentTag, linkTag) {
        const deepData = JSON.parse(data).reduce(function (prev, item) {
            prev[item.parentId] ? prev[item.parentId].push(item) : prev[item.parentId] = [item];
            return prev;
        }, {});

        for (let key in deepData) {
            deepData[key].forEach(function (item, index) {
                deepData[item.id] ? item.children = deepData[item.id] : [];
            });
        }

        return deepData[null].reduce(function (prev, item) {
            const key = item[componentTag] ? componentTag : linkTag;
            prev[key] ? prev[key].push(item) : prev[key] = [item];
            return prev;
        }, {});
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

    const componentTag = conf.componentTag;
    const lineTag = conf.lineTag;
    const el = conf.el;
    const productLink = conf.productLink;
    const content = processContent(contentStr, componentTag, lineTag);
    const baseHTML = parseBaseComponent(el, componentTag);
    const svg = document.createElement('svg');
    const exclKey = ['children', 'parentId', componentTag];
    const addComponentDom = function (confArr, parent) {
        if (!Array.isArray(confArr)) return;
        confArr.forEach(function (item) {
            const el = strToDom(baseHTML[item[componentTag]]);
            initDOM(el, filterObj(item, exclKey));
            parent.appendChild(el);
            addComponentDom(item.children, el);
        });
    };
    const addLinkDom = function (confArr, parent) {
        if (!Array.isArray(confArr)) return;
        confArr.forEach(function (item) {
            const el = strToDom(productLink(item[lineTag]));
            parent.appendChild(el);
        });
    }

    addComponentDom(content[componentTag], svg);
    addLinkDom(content[lineTag], svg);

    return svg.outerHTML;
}

const reuse = {
    convertStrToDom,
    parseSVGBBox,
    formatSVGStrToHTML
};

export default reuse;
