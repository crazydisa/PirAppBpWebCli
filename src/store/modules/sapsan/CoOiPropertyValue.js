import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'coOiPropertyValue',
    actions: {
      
        
        async loadCoOiPropertyValueById({commit}, id_param) {
            await api.loadObject(
                "GetCoOiPropertyValueById",
                "/sapsan/coOiPropertyValueById?id_param=" + id_param,
                commit,
                "setSprCoOiParameter"
            );
        },
        async loadCoOiPropertyValues({commit},branch) {            
            await api.loadObjectsPost(
                "GetCoOiPropertyValues",
                "/sapsan/coOiPropertyValues",
                branch,
                commit,
                "setCoOiPropertyValues"
            );
        },
        
        async updateCoOiPropertyValue({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateCoOiPropertyValue",
                "/sapsan/updateCoOiPropertyValue",
                getters.getCoOiPropertyValueById(key),
                values,
                commit,
                "setCoOiPropertyValue",
            );
        },
    },
    mutations: {    
        setCoOiPropertyValues(state, coOiPropertyValues) {
            state.coOiPropertyValues = coOiPropertyValues
        },
        setCoOiPropertyValue(state, coOiPropertyValue) {
            utils.setItem(state.coOiPropertyValues, coOiPropertyValue);
        },
    },
    state: {     
        coOiPropertyValues: [],
    },
    getters:{ 
        getCoOiPropertyValues: (state) => {
            return state.coOiPropertyValues;
        },
        getCoOiPropertyValueById: (state) => (Id) => {
            return state.coOiPropertyValues.find(o => o.Id == Id);
        },
    }
}