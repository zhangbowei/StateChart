export const SET_CARD_KEY = 'SET_CARD_KEY' //登录成功

const now = new Date();
const store = {
    state: {
        // 会话列表
        datasets: [
            {
                name: '区域',
                component: 'Region',
                introduction: 'testtesttes'
            },
            {
                name: '起始状态',
                component: 'StateStart',
                introduction: 'testtesttes'
            },
            {
                name: '终止状态',
                component: 'StateEnd',
                introduction: 'testtesttes'
            }
        ],
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        [SET_CARD_KEY](state, value) {
            state.filterKey = value;
        }
    },
    actions: {
        [SET_CARD_KEY]({commit}, value) {
            commit(SET_CARD_KEY, value);
        }
    }
};


export default store;
