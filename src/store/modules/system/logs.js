import api from "@/store/api"
import utils from '@/utils'
import localizeFilter from '@/localize';

export default {
    name: 'logs',
    actions: {
        async loadLogs({commit}, {from, to}) {
            const params = from && to ? ("?from=" + from + "&to=" + to) : from ? ("?from=" + from) : to ? ("?to=" + to) : null;
            if(params) {
                await api.loadObjects(
                    "GetLogs",
                    "/system/logs" + params,
                    commit,
                    "setLogs"
                );
            }
        },
        async loadLogDetails({commit}, logId) {
            await api.loadObjects(
                "GetLogDetails",
                "/system/log-details?id=" + logId,
                commit,
                "setLogDetails"
            );
        },
        async loadObjectLogs({commit}, {type, id}) {
            await api.loadObjects(
                "GetObjectLogs",
                "/system/object-logs?type=" + type + "&id=" + id,
                commit,
                "setLogs"
            );
        },
        async loadUserLogs({commit}, user) {
            await api.loadObjects(
                "GetUserLogs",
                "/system/user-logs?user=" + user,
                commit,
                "setLogs"
            );
        },
        async loadUserSessionsLogs({commit}, {from, to}) {
            await api.loadObjects(
                "GetUserSessionsLogs",
                "/system/user-sessions-logs?from=" + from + "&to=" + to,
                commit,
                "setUserSessionsLogs"
            );
        },
    },
    mutations: {
        setLogs(state, logs) {
            state.logs = logs;
        },
        setLogDetails(state, logDetails) {
            state.logDetails = logDetails;
        },
        setUserSessionsLogs(state, userSessionsLogs) {
            state.userSessionsLogs = userSessionsLogs;
        },
    },
    state: {
        logs: [],
        logDetails: [],
        logStatuses: [],
        userSessionsLogs: []
    },
    getters:{
        getLogs: (state) => {
            return state.logs;
        },
        getLogDetails: (state) => {
            return state.logDetails.map(d => {
                d.OldObject = utils.apiObjectToObject(JSON.parse(d.OldValue));
                d.NewObject = utils.apiObjectToObject(JSON.parse(d.NewValue));
                return d;
            });
        },
        getLogStatuses: (state) => {
            return state.logStatuses;
        },
        getUserSessionsLogs: (state) => {
            return state.userSessionsLogs;
        },
        getLogPeriods: () => {
            return [{
                    title: localizeFilter("LogPeriodPer1Week"),
                    from: utils.getDateDiff(7),
                    to: null
                }, {
                    title: localizeFilter("LogPeriodPer1Month"),
                    from: utils.getDateDiff(30),
                    to: null
                }, {
                    title: localizeFilter("LogPeriodPer3Month"),
                    from: utils.getDateDiff(91),
                    to: null
                }, {
                    title: localizeFilter("LogPeriodPer6Month"),
                    from: utils.getDateDiff(182),
                    to: null
                }, {
                    title: localizeFilter("LogPeriodPer1Year"),
                    from: utils.getDateDiff(365),
                    to: null
                }, {
                    title: localizeFilter("LogPeriodAll"),
                    from: null,
                    to: null
                }
            ];
        }
    }
}
