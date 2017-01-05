export function divisionTofixed(x, y) {
    return +((x / y) * 100).toFixed(2);
}

export function wrapNameSelector(name) {
    return ['[name=', name, ']'].join('');
}

export function findParentByName(el, nameSet) {

    const terminator = el.ownerSVGElement;

    if (_.isNull(terminator)) {
        return null;
    }

    while (el && el !== terminator) {

        if (nameSet.indexOf(el.getAttribute('name')) !== -1) {
            return el;
        }

        el = el.parentNode;
    }

    return null;
}

export function findContainByName(el, nameSet, findAll) {

    const NUM = 2;
    const terminator = el.ownerSVGElement;
    const contains = [];

    if (_.isNull(terminator)) {
        return null;
    }

    let num = 0;
    while (el && el !== terminator) {

        if (nameSet.indexOf(el.getAttribute('name')) !== -1) {
            num++;
            if (num >= NUM) {
                contains.push(el);
                if (!findAll) {
                    break;
                }
            }
        }

        el = el.parentNode;
    }

    return findAll ? contains : contains[0];
}

export function makeMouseFirst(data, offset) {
    offset = Math.abs(offset) || 1;
    for (let item in data) {
        data[item] -= offset;
    }
    return data;
}

export function addEventListener(events, el, func) {
    events.forEach(function(event) {
        el.addEventListener(event, func);
    });
}

export function curryIt(fn) {
    const len = fn.length;
    const args = [];

    const func = function(num) {
        args.push(num);
        if (args.length === len) {
            return () => fn.apply(null, args);
        } else {
            return func;
        }
    }

    return func;
}

export function containsRect(r, nr) {
    const X = nr.x;
    const Y = nr.y;
    const x = r.x;
    const y = r.y;

    let W = nr.width;
    let H = nr.height;
    let w = r.width;
    let h = r.height;

    if ((w | h | W | H) < 0) {
        return false;
    }
    if (X < x || Y < y) {
        return false;
    }
    w += x;
    W += X;
    if (W <= X) {
        if (w >= x || W > w) return false;
    } else {
        if (w >= x && W > w) return false;
    }
    h += y;
    H += Y;
    if (H <= Y) {
        if (h >= y || H > h) return false;
    } else {
        if (h >= y && H > h) return false;
    }
    return true;
}

export function parseScaleString(el) {
    let transform = el.getAttribute('transform') || '';
    let scale;

    if (transform) {
        var separator = /[ ,]+/;
        var scaleMatch = transform.match(/scale\((.*)\)/);

        if (scaleMatch) {
            scale = scaleMatch[1].split(separator);
        }
    }

    var sx = (scale && scale[0]) ? parseFloat(scale[0]) : 1;

    return {
        x: sx,
        y: (scale && scale[1]) ? parseFloat(scale[1]) : sx
    };
}

export function calculateNowScale(originalScale, containsScale, returnPalette) {
    let nowScale = _.clone(originalScale);

    if (returnPalette) {
        containsScale.forEach(function(item) {
            nowScale.x *= item.x;
            nowScale.y *= item.y;
        })
    } else {
        containsScale.forEach(function(item) {
            nowScale.x /= item.x;
            nowScale.y /= item.y;
        })
    }

    return nowScale;
}

const utils = {
    wrapNameSelector,
    findParentByName,
    findContainByName,
    makeMouseFirst,
    addEventListener,
    curryIt,
    containsRect,
    parseScaleString,
    calculateNowScale
};

export default utils;