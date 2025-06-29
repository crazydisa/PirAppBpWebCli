import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'ois',
    actions: {      
        async loadOis({commit}) {
            await api.loadObjects(
                "GetOis",
                "/sapsan/ois",
                commit,
                "setOis"
            );
        },
       
        async loadOiById({commit}, id_oi) {
            await api.loadObject(
                "GetOiById",
                "/sapsan/oiById?id_oi=" + id_oi,
                commit,
                "setOi"
            );
        },
        
    },
    mutations: {
        setOis(state, ois) {
            state.ois = ois
        },
        setOi(state, oi) {
            utils.setItem(state.ois, oi);
        },
    },
    state: {     
        ois: [],
    },
    getters:{
        getOis: (state) => {
            return state.ois;
        },
        getOiById: (state) => (Id) => {
            return state.ois.find(o => o.Id == Id);
        },
    }
}