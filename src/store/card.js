export const SET_CARD_KEY = 'SET_CARD_KEY'
export const INIT_CARD_DATASET = 'INIT_DATASET'
export const ADD_CARD_DATASET = 'ADD_DATASET'

const keyArr = ['name', 'component', 'introduction'];
const dataArr = [
    ['区域', 'Region', 'testtesttes'],
    ['起始状态', 'StateStart', 'testtesttes'],
    ['终止状态', 'StateEnd', 'testtesttes']
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

const store = {
    state: {
        // 会话列表
        datasets: datasets,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        [INIT_CARD_DATASET](state, key) {
            const originDataset = JSON.stringify(localStorage.getItem(key));

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
        [ADD_CARD_DATASET](state, data) {
            commit(ADD_CARD_DATASET, data);
        },
        [SET_CARD_KEY]({ commit }, value) {
            commit(SET_CARD_KEY, value);
        }
    }
};


export default store;
