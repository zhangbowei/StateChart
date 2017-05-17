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

export function formatSVGHtmlToStr(palette, conf) {
    function parseAttribute(attribute) {
        const data = {};
        for (let key in attribute) {
            if (attribute.hasOwnProperty(key)) {
                data[attribute[key].name] = attribute[key].value;
            }
        }

        return data;
    }

    const moduleTag = conf.moduleTag;
    const lineTag = conf.lineTag;
    const selector = [moduleTag, lineTag].slice().reduce(function (prev, item) {
        return prev.concat([['[', item, ']'].join('')]);
    }, []).join();
    const targetArr = Array.from(palette.querySelectorAll(selector));
    const res = targetArr.reduce(function (prev, item) {
        const data = parseAttribute(item.attributes);
        const parent = item.parentNode;

        data.parentId = (parent.id && targetArr.includes(parent)) ? parent.id : null;
        return prev.concat([data]);
    }, []);


    return JSON.stringify(res);
}


export function formatSVGStrToHtml(contentStr, conf) {
    function recurMapDomId(el, tag) {
        let nodes = [el];
        let len = nodes.length;
        const map = new Map();
        const fn = function (dom) {
            dom.id = '';
            if (dom.getAttribute(tag)) {
                V(dom);
            }
            return dom.id;
        }

        for (let i = 0; i < len; i++) {
            map.set(nodes[i].getAttribute('id'), fn(nodes[i]));
            nodes = nodes.concat(Array.prototype.slice.call(nodes[i].children));
            len = nodes.length;
        };

        return map;
    }
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

        return svg.innerHTML;
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
    const res = {};

    res[moduleTag] = integrateComponent(content[moduleTag], list, moduleTag);

    const idMap = recurMapDomId(processStrToSVG(res[moduleTag]), moduleTag);
    res[lineTag] = integrateLink(content[lineTag], productLink, function (dataStr) {
        return dataStr.replace(/"id":"(.*?)"/g, function (all, id) {
            return ['"id":"', idMap.get(id), '"'].join('');
        })
    });

    return processStrToSVG(annotation(res, lineTag));
}
