import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user.profile'));

const initialState = user   
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        async login({ commit }, user) {
            try {
                await AuthService.login(user);
                const profile = await AuthService.profile();
                commit('loginSuccess', profile);
                return profile;
            } catch (error) {
                commit('loginFailure');
                if(error.response) throw new Error(error.response.data);

                throw error;
            }
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },     
        register({ commit }, user) {
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess');
                    return Promise.resolve(response.data);
                },
                error => {
                    commit('registerFailure');
                    if(error.response) return Promise.reject(new Error(error.response.data));

                    return Promise.reject(error);
                }
            );
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            console.log(user)
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        }
    }
};