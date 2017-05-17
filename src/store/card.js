export const SET_CARD_KEY = 'SET_CARD_KEY';
export const INIT_CARD_DATASET = 'INIT_DATASET';
export const ADD_CARD_DATASET = 'ADD_DATASET';

//moduleAndComp map list.vue Component Name(import * from *) to Avoid variation
const moduleToComp = new Map([
    ['C1', 'Region'],
    ['C2', 'StateStart'],
    ['C3', 'StateEnd']
]);
const convertModuleToComp =  function(data) {
    return moduleToComp.has(data) ? moduleToComp.get(data) : data;
}

const keyArr = ['name', 'module', 'introduction', 'content'];
const dataArr = [
    ['区域', 'C1', 'testtesttes'],
    ['起始状态', 'C2', 'testtesttes'],
    ['终止状态', 'C3', 'testtesttes']
];
const parseData = function (data) {
    const rawData = data;

    return keyArr.reduce(function (prev, item) {
        prev[item] = rawData[item];
        return prev;
    }, {});
}
const datasets = dataArr.reduce(function (stock, good) {
    return stock.concat([good.reduce(function (box, element, order) {
        box[keyArr[order]] = element;
        return box;
    }, {})]);
}, []);
const keyObj = keyArr.reduce(function (prev, item) {
    prev[item] = item;
    return prev;
}, {});

const store = {
    state: {
        keyObj,
        convertModuleToComp,
        datasets,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        [INIT_CARD_DATASET](state, key) {
            const originDataset = JSON.parse(localStorage.getItem(key));

            if (Array.isArray(originDataset)) {
                const pureDataset = originDataset.map(function (item) {
                    return parseData(item);
                });
                state.datasets = state.datasets.concat(pureDataset);
            }
        },
        [ADD_CARD_DATASET](state, data) {
            state.datasets.push(parseData(data));
        },
        [SET_CARD_KEY](state, value) {
            state.filterKey = value;
        }
    },
    actions: {
        [INIT_CARD_DATASET]({ commit }, value) {
            commit(INIT_CARD_DATASET, value);
        },
        [ADD_CARD_DATASET]({ commit }, data) {
            commit(ADD_CARD_DATASET, data);
        },
        [SET_CARD_KEY]({ commit }, value) {
            commit(SET_CARD_KEY, value);
        }
    }
};


export default store;
