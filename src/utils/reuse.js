export function makeUniModule(timestamp) {
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

export function parseSVGBBox(paletteId, svgDom) {
    const paletteDom = document.querySelector(['#', paletteId].join(''));
    let bbox;

    svgDom.setAttribute('style', 'width: 0px; height: 0px;');
    paletteDom.appendChild(svgDom);
    bbox = svgDom.getBBox();
    paletteDom.removeChild(svgDom);

    return bbox;
}

export function replaceStrId(dataStr, idMap) {
    return dataStr.replace(/"id":"(.*?)"/g, function (all, id) {
        return ['"id":"', idMap.get(id), '"'].join('');
    });
}

export function recurMapDomId(elArr) {
    function resetId(dom) {
        if (dom.id) {
            dom.id = '';
            V(dom);
        }
        return dom.id;
    }

    const nodes = Array.isArray(elArr) ? elArr : [elArr];
    const map = new Map();
    const iteratorDom = function (nodes) {
        nodes.forEach(function (item) {
            map.set(item.id, resetId(item));
            iteratorDom(Array.prototype.slice.call(item.children));
        });
    };

    iteratorDom(nodes);

    return map;
}

export function productCombSelector(confArr) {
    const keyArr = Array.isArray(confArr) ? confArr : [confArr];
    const selector = keyArr.slice().reduce(function (prev, item) {
        return prev.concat([['[', item, ']'].join('')]);
    }, []).join();

    return selector;
}

export function formatSVGHtmlToStr(domArr) {
    function parseAttribute(attribute) {
        const data = {};
        for (let key in attribute) {
            if (attribute.hasOwnProperty(key)) {
                data[attribute[key].name] = attribute[key].value;
            }
        }

        return data;
    }

    const targetArr = Array.from(domArr);
    const res = targetArr.reduce(function (prev, item) {
        const data = parseAttribute(item.attributes);
        const parent = item.parentNode;

        data.parentId = (parent.id && targetArr.includes(parent)) ? parent.id : null;
        return prev.concat([data]);
    }, []);


    return JSON.stringify(res);
}


export function formatSVGStrToHtml(contentStr, conf) {
    function processContent(data, moduleTag, linkTag) {
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
            const key = item[moduleTag] ? moduleTag : linkTag;
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
    function annotation(data, key) {
        let res = '';
        for (let index in data) {
            res += (index === key ? ['<!--', data[index], '-->'].join('') : data[index]);
        }

        return res;
    }
    function processStrToSVG(content) {
        const dom = document.createElement('div');

        dom.innerHTML = ['<svg>', content, '</svg>'].join('');

        return dom.children[0];
    }
    function integrateComponent(moduleArr, list, tag) {
        const baseHTML = parseBaseComponent(list, tag);
        const svg = document.createElement('svg');
        const setComponent = function (dataArr, parent) {
            if (!Array.isArray(dataArr)) return;
            dataArr.forEach(function (item) {
                const el = strToDom(baseHTML[item[tag]]);
                initDOM(el, filterObj(item, exclKey));
                parent.appendChild(el);
                setComponent(item.children, el);
            });
        };

        setComponent(moduleArr, svg);

        return svg;
    }
    function integrateLink(lineArr, dataToHtml, updateData) {
        if (!Array.isArray(lineArr)) return;
        return lineArr.reduce(function (prev, item) {
            return prev + dataToHtml(updateData(item[lineTag]));
        }, '');
    }


    const moduleTag = conf.moduleTag;
    const lineTag = conf.lineTag;
    const list = conf.list;
    const productLink = conf.productLink;
    const content = processContent(contentStr, moduleTag, lineTag);
    const exclKey = ['children', 'parentId', moduleTag];
    const moduleSvg = integrateComponent(content[moduleTag], list, moduleTag);
    const idMap = recurMapDomId(moduleSvg);
    const res = {};

    res[moduleTag] = moduleSvg.innerHTML;
    res[lineTag] = integrateLink(content[lineTag], productLink, function (dataStr) {
        return replaceStrId(dataStr, idMap);
    });

    return processStrToSVG(annotation(res, lineTag));
}
