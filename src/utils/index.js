export function divisionTofixed(x, y) {
    return +((x / y) * 100).toFixed(2);
}

export function wrapNameSelector(name) {
    return ['[name=', name, ']'].join('');
}

export function wrapIdSelector(id) {
    return ['#', id].join('');
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

export function getAngle(data) {
    const width = data.end.x - data.start.x;
    const height= data.end.y - data.start.y;
    let angle = Math.atan2(Math.abs(height), Math.abs(width))*180/Math.PI;
    if (width < 0) {
        if (height < 0) {
            angle = angle + 180;
        } else {
            angle = 180 - angle;
        }
    } else {
        if (height < 0) {
            angle = -angle;
        } else {
            angle = angle;
        }
    }
    return angle;
}

export function makeMouseFirst(data, offset) {
    offset = offset || 3;

    const width = data.end.x - data.start.x;
    const height= data.end.y - data.start.y;
    const arc = Math.atan2(Math.abs(height), Math.abs(width));
    let offsetX = offset * Math.cos(arc);
    let offsetY = offset * Math.sin(arc);
    offsetX = width < 0 ? -offsetX : offsetX;
    offsetY = height < 0 ? -offsetY : offsetY;

    return {x: data.end.x - offsetX, y:data.end.y - offsetY};
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

function containsRect(r, nr) {
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

export function findNearContain(el, allRoots) {
    const vel = V(el);
    let min;
    let nearContain;

    allRoots.forEach(function(root) {
        if (el.id !== root.node.id && containsRect(root.bbox(), vel.bbox())) {
            let offset = vel.bbox().x - root.bbox().x;
            if (min !== void 0) {
                if (min > offset) {
                    nearContain = root.node;
                    min = offset;
                }
            } else {
                nearContain = root.node;
                min = offset;
            }
        }
    });

    return nearContain;
}


export function findContainsByName(el, nameSet) {

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
            }
        }

        el = el.parentNode;
    }

    return contains;
}


function parseScaleString(el) {
    let scale;
    const transform = el.getAttribute('transform') || '';

    if (transform) {
        const separator = /[ ,]+/;
        const scaleMatch = transform.match(/scale\((.*)\)/);

        if (scaleMatch) {
            scale = scaleMatch[1].split(separator);
        }
    }

    const sx = (scale && scale[0]) ? parseFloat(scale[0]) : 1;

    return {
        x: sx,
        y: (scale && scale[1]) ? parseFloat(scale[1]) : sx
    };
}

function calculateNowScale(originalScale, containsScale, returnPalette) {
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

export function scaleTheRoot(el, contains, returnPalette) {
    const vel = V(el);
    const containsScale = contains.map(function(el) {
        return parseScaleString(el);
    });
    const originalScale = parseScaleString(el);
    const nowScale = calculateNowScale(originalScale, containsScale, returnPalette);

    vel.scale(nowScale.x, nowScale.y);
}

function translateTheRoot(el, contains, returnPalette) {
    const vel = V(el);
    let scale;
    let relativeTranslate;
    let absoluteTranslate;

    if (contains.length) {
        scale = contains.map(function(el) {
            return parseScaleString(el);
        }).reduce(function(a, b) {
            return { x: a.x * b.x, y: a.y * b.y };
        });
        relativeTranslate = vel.bbox(false, contains[0]);
        absoluteTranslate = V(contains[0]).bbox();
    } else {
        scale = { x: 1, y: 1 };
        relativeTranslate = vel.bbox();
        absoluteTranslate = V(el.ownerSVGElement).bbox();
    }

    const nowTranslate = {};
    if (returnPalette) {
        nowTranslate.x = (relativeTranslate.x * scale.x) + absoluteTranslate.x;
        nowTranslate.y = (relativeTranslate.y * scale.y) + absoluteTranslate.y;
    } else {
        nowTranslate.x = (relativeTranslate.x - absoluteTranslate.x) / scale.x;
        nowTranslate.y = (relativeTranslate.y - absoluteTranslate.y) / scale.y;
    }

    vel.translate(nowTranslate.x, nowTranslate.y, { absolute: true });
}

function autoTransformTheRoot(el, name, returnPlatte) {
    const contains = findContainsByName(el, name);
    scaleTheRoot(el, contains, returnPlatte);
    translateTheRoot(el, contains, returnPlatte);
}

export function setToolDisplay(nodes, name, display) {
    if (!nodes) {
        return null;
    }
    if (!_.isArray(nodes)) {
        nodes = [nodes];
    }
    nodes.forEach(function(node) {
       let el = node.querySelector(wrapNameSelector(name));
       if (el) {
           el.setAttribute('display', display);
       }
    });
}

const utils = {
    wrapNameSelector,
    findParentByName,
    makeMouseFirst,
    addEventListener,
    curryIt,
    findNearContain,
    autoTransformTheRoot,
    setToolDisplay
};

export default utils;