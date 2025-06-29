import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'complects',
    actions: {
      
        async loadComplectsByContractId({commit}, id_contract) {
            await api.loadObject(
                "GetComplectsByContractId",
                "/sapsan/complectsByContractId?id_contract=" + id_contract,
                commit,
                "setComplects"
            );
        },
        async loadComplectById({commit}, id_complect) {
            await api.loadObject(
                "GetComplectById",
                "/sapsan/complectById?id_complect=" + id_complect,
                commit,
                "setComplect"
            );
        },
        async loadComplects({commit},branch) {            
            await api.loadObjectsPost(
                "GetComplects",
                "/sapsan/complects",
                branch,
                commit,
                "setComplects"
            );
        },
        
        async updateComplect({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateComplect",
                "/sapsan/updateComplect",
                getters.getComplectById(key),
                values,
                commit,
                "setComplect",
            );
        },
    },
    mutations: {    
        setComplects(state, complects) {
            state.complects = complects
        },
        setComplect(state, complect) {
            utils.setItem(state.complects, complect);
        },
    },
    state: {     
        complects: [],
    },
    getters:{ 
        getComplects: (state) => {
            return state.complects;
        },
        getComplectById: (state) => (Id) => {
            return state.complects.find(o => o.Id == Id);
        },
    }
}