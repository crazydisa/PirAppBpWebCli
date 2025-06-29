import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'sprCoOiParameter',
    actions: {
      
        
        async loadSprCoOiParameterById({commit}, id_param) {
            await api.loadObject(
                "GetSprCoOiParameterById",
                "/sapsan/sprCoOiParameterById?id_param=" + id_param,
                commit,
                "setSprCoOiParameter"
            );
        },
        async loadSprCoOiParameters({commit},branch) {            
            await api.loadObjectsPost(
                "GetSprCoOiParameters",
                "/sapsan/sprCoOiParameters",
                branch,
                commit,
                "setSprCoOiParameters"
            );
        },
        
        async updateSprCoOiParameter({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprCoOiParameter",
                "/sapsan/updateSprCoOiParameter",
                getters.getSprCoOiParameterById(key),
                values,
                commit,
                "setSprCoOiParameter",
            );
        },
    },
    mutations: {    
        setSprCoOiParameters(state, sprCoOiParameters) {
            state.sprCoOiParameters = sprCoOiParameters
        },
        setSprCoOiParameter(state, sprCoOiParameter) {
            utils.setItem(state.sprCoOiParameters, sprCoOiParameter);
        },
    },
    state: {     
        sprCoOiParameters: [],
    },
    getters:{ 
        getSprCoOiParameters: (state) => {
            return state.sprCoOiParameters;
        },
        getSprCoOiParameterById: (state) => (Id) => {
            return state.sprCoOiParameters.find(o => o.Id == Id);
        },
    }
}