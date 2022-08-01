
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);
const config = {
    plugins: [createPersistedState()],
    state: {
        username: '',
        userHead:'',
        token: '',
        uid:'',
        userList:[],
    },
    getters: {
        token: state => state.token,
        uid: state => state.uid,
        username: state => state.username,
        userHead: state => state.userHead,
        userList: state => state.userList,
    },
    mutations: {
        updateToken(state, payload) {
            state.token = payload;
        },
        updateUsername(state, payload) {
            state.username = payload;
        },
        updateUid(state, payload) {
            state.uid = payload;
        },
        updateUserhead(state, payload) {
            state.userHead = payload;
        },
        updataUserList(state, payload) {
            state.userList = payload;
        },
    },
    actions: {}
}
const store = new Vuex.Store(config);
export default store;