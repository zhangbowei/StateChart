export const SET_ROOT_METHOD = 'SET_ROOT_METHOD' //
export const SET_SCALE_METHOD = 'SET_SCALE_METHOD' //
export const SET_LINK_METHOD = 'SET_LINK_METHOD' //

const store = {
    state: {
        root: {
            name: 'root',
            method: () => {} 
        },
        scale: {
            name: 'scale',
            method: () => {} 
            
        },
        box: {
            name: 'box',
            method: () => {} 
            
        },
        link: {
            name: 'link',
            method: () => {} 
        },
        sign: {
            name: 'sign',
            method: () => {} 
        }
    },
    mutations: {
        [SET_ROOT_METHOD](state, setting) {
            state.root.method = setting;
        },
        [SET_SCALE_METHOD](state, setting) {
            state.scale.method = setting;
        },
        [SET_LINK_METHOD](state, setting) {
            state.link.method = setting;
        }
    },
    actions: {
        [SET_ROOT_METHOD]({commit}, setting) {
            commit(SET_ROOT_METHOD, setting);
        },
        [SET_SCALE_METHOD]({commit}, setting) {
            commit(SET_SCALE_METHOD, setting);
        },
        [SET_LINK_METHOD]({commit}, setting) {
            commit(SET_LINK_METHOD, setting);
        }
    }
};


export default store;
