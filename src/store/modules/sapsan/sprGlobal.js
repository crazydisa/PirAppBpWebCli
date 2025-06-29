import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'sprGlobal',
    actions: {
      
        
        async loadSprGlobalById({commit}, id_param) {
            await api.loadObject(
                "GetSprGlobalById",
                "/sapsan/sprGlobalById?id_param=" + id_param,
                commit,
                "setSprGlobal"
            );
        },
        async loadSprGlobals({commit},branch) {            
            await api.loadObjectsPost(
                "GetSprGlobals",
                "/sapsan/sprGlobals",
                branch,
                commit,
                "setSprGlobals"
            );
        },
        
        async updateSprGlobal({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprGlobal",
                "/sapsan/updateSprGlobal",
                getters.getSprGlobalById(key),
                values,
                commit,
                "setSprGlobal",
            );
        },
    },
    mutations: {    
        setSprGlobals(state, sprGlobals) {
            state.sprGlobals = sprGlobals
        },
        setSprGlobal(state, sprGlobal) {
            utils.setItem(state.sprGlobals, sprGlobal);
        },
    },
    state: {     
        sprGlobals: [],
    },
    getters:{ 
        getSprGlobals: (state) => {
            return state.sprGlobals;
        },
        getSprGlobalById: (state) => (Id) => {
            return state.sprGlobals.find(o => o.Id == Id);
        },
    }
}