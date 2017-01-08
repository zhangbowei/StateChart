export const SET_CODE_KEY = 'SET_CODE_KEY';
export const ADD_CODE_DATA = 'ADD_CODE_DATA';
export const UPDATE_CODE_DATA = 'UPDATE_CODE_DATA';

const store = {
    state: {
        // 会话列表
        datasets: [
            {
                id: '',
                name: 'blank',
                code: '// Switch the language and put some code on me :)           ↑↑↑↑↑↑'
            }
        ],
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        [SET_CODE_KEY](state, value) {
            state.filterKey = value ? value : '';
        },
        [ADD_CODE_DATA](state, value) {
            state.datasets.push(value);
        },
        [UPDATE_CODE_DATA](state, value) {
            for(let i in state.datasets) {
                if (state.datasets[i].id === value.id) {
                    _.extend(state.datasets[i], _.pick(value, 'name', 'code'));
                    break;
                }
            }
        }
    },
    actions: {
        [SET_CODE_KEY]({commit}, value) {
            commit(SET_CODE_KEY, value);
        },
        [ADD_CODE_DATA]({commit}, value) {
            commit(ADD_CODE_DATA, value);
        },
        [UPDATE_CODE_DATA]({commit}, value) {
            commit(UPDATE_CODE_DATA, value);
        }
    }
};


export default store;
