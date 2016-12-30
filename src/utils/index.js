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

const utils = {
   wrapNameSelector,
   findParentByName,
   makeMouseFirst, 
   addEventListener
};

export default utils;