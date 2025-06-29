import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'sheduller',
    actions: {
      
        
        async loadShedullerById({commit}, id_param) {
            await api.loadObject(
                "GetShedullerById",
                "/sapsan/shedullerById?id_param=" + id_param,
                commit,
                "setSheduller"
            );
        },
        async loadShedullers({commit}, id_plan) {
            await api.loadObjects(
                "GetShedullers",
                "/sapsan/shedullers?id_plan=" + id_plan,
                commit,
                "setShedullers"
            );
        },
        //async loadContractProps({commit},id_contract) {            
            //await api.loadObjectsPost(
                //"GetContractProps",
                //"/sapsan/contractProps",
                //id_contract,
                //commit,
                //"setContractProps"
            //);
        //},
        
        async updateSheduller({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSheduller",
                "/sapsan/updateSheduller",
                getters.getShedullerById(key),
                values,
                commit,
                "setSheduller",
            );
        },
    },
    mutations: {    
        setShedullers(state, shedullers) {
            state.shedullers = shedullers
        },
        setSheduller(state, sheduller) {
            utils.setItem(state.shedullers, sheduller);
        },
    },
    state: {     
        shedullers: [],
    },
    getters:{ 
        getShedullers: (state) => {
            return state.shedullers;
        },
        getShedullerById: (state) => (Id) => {
            return state.shedullers.find(o => o.Id == Id);
        },
    }
}