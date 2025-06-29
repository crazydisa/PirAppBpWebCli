import axios from 'axios';

export default {
    name: 'weekends',
    actions: {
        
        async loadWeekendsAndHolidays({commit},year) {
            
            await axios.get('http://xmlcalendar.ru/data/ru/'+year+'/calendar.json', {proxy: {
                protocol: 'http',
                host: 'tmn-tnnc-proxy.rosneft.ru',
                port: 9090,
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
              }},)
                .then((response) => {
                    commit('weekendsAndHolidays', response.data);
                });
        },
    },
    mutations: {
        setWeekendsAndHolidays(state, weekendsAndHolidays) {
            state.weekendsAndHolidays = weekendsAndHolidays;
        }
    },
    state: {
        weekendsAndHolidays: {}
    },
    getters:{
        getWeekendsAndHolidays: (state) => {
            return state.weekendsAndHolidays;
        },
    }
}
