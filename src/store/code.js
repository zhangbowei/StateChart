export const SET_FILTER_KEY = 'SET_FILTER_KEY'; 

const store = {
    state: {
        // 会话列表
        datasets: [
            
        ],
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        [SET_FILTER_KEY](state, value) {
            state.filterKey = value;
        }
    },
    actions: {
        [SET_FILTER_KEY]({commit}, value) {
            commit(SET_FILTER_KEY, value);
        }
    }
};


export default store;
