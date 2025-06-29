import axios from 'axios';

export default {
    name: 'config',
    actions: {
        async loadConfigSettings({commit}) {
            await axios.get('./settings.json')
                .then((response) => {
                    commit('setConfigSettings', response.data);
                });
        },
    },
    mutations: {
        setConfigSettings(state, configSettings) {
            state.configSettings = configSettings;
        }
    },
    state: {
        configSettings: {}
    },
    getters:{
        isTestConfig: (state) => {
            return process.env.NODE_ENV !== 'production' && state.configSettings["isTest"];
        },
        isDebugConfig: () => {
            return process.env.NODE_ENV !== 'production';
        },
        
        getConfigSettings: (state) => {
            return state.configSettings;
        },
        getConfigSetting: (state) => (key) => {
            return state.configSettings[key];
        },
        getConfigServiceUrl: (state) => {
            if(process.env.NODE_ENV !== 'production') {
                return state.configSettings["debugServiceUrl"];
            }
            else {
                return state.configSettings["releaseServiceUrl"];
            }
        },
        getConfigAppPath: (state) => {
            if(process.env.NODE_ENV !== 'production') {
                return state.configSettings["debugAppPath"];
            }
            else {
                return state.configSettings["releaseAppPath"];
            }
        },
    }
}
