import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'settings',
    actions: {
        async loadSystemSettings({commit}, path) {
            await api.loadObjects(
                "GetAppSettings",
                "/app-settings?path=" + path,
                commit,
                "setSystemSettings"
            );
        },
        async updateSystemSetting({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateAppSetting",
                "/update-app-setting",
                "setting",
                getters.getSystemSetting(key),
                values,
                commit,
                "setSystemSetting"
            );
        },
        async loadUserSettings({commit}, path) {
            await api.loadObjects(
                "GetAppUserSettings",
                "/app-user-settings?path=" + path,
                commit,
                "setUserSettings"
            );
        },
        async updateUserSetting({commit, getters}, {path, key, field, value}) {
            let newUserSetting = {Path: path, Key: key};
            let oldUserSetting = getters.getUserSetting(key);
            if(!oldUserSetting) {
                oldUserSetting = {...newUserSetting}; 
            }
            if(field) {
                let newValue = oldUserSetting.Value ? JSON.parse(oldUserSetting.Value) : {};
                newValue[field] = value;
                newUserSetting.Value = JSON.stringify(newValue)
            }
            else {
                newUserSetting.Value = (typeof value === "object") ? JSON.stringify(value) : value.toString();
            }
            if(oldUserSetting.Value != newUserSetting.Value) {
                await api.updateObject(
                    "UpdateAppUserSetting",
                    "/update-app-user-setting",
                    "setting",
                    oldUserSetting,
                    newUserSetting,
                    commit,
                    "setUserSetting"
                );
            }
        },
    },
    mutations: {
        setSystemSettings(state, systemSettings) {
            state.systemSettings = systemSettings;
        },
        setSystemSetting(state, systemSetting) {
            utils.setItem(state.systemSettings, systemSetting);
        },
        setUserSettings(state, userSettings) {
            state.userSettings = userSettings;
        },
        setUserSetting(state, userSetting) {
            utils.setItem(state.userSettings, userSetting);
        }
    },
    state: {
        systemSettings: [],
        userSettings: []
    },
    getters:{
        getSystemSettings: (state) => {
            return state.systemSettings;
        },
        getSystemSetting: (state) => (Key) => {
            return state.systemSettings.find(s => s.Key == Key);
        },
        getUserSettings: (state) => {
            return state.userSettings;
        },
        getUserSetting: (state) => (Key) => {
            return state.userSettings.find(s => s.Key == Key);
        },
        getUserSettingValue: (state) => (Key) =>{
            const userStateSetting = state.userSettings.find(s => s.Key == Key);
            const userStateValue = userStateSetting ? userStateSetting.Value : null;
            if(typeof userStateValue === "string" && userStateValue.startsWith('{') && userStateValue.endsWith('}')) {
                return JSON.parse(userStateValue);
            }
            return userStateValue;
        },
    }
}
