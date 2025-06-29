import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'contractProp',
    actions: {
      
        
        async loadContractPropById({commit}, id_param) {
            await api.loadObject(
                "GetContractPropById",
                "/sapsan/contractPropById?id_param=" + id_param,
                commit,
                "setContractProp"
            );
        },
        async loadContractProps({commit}, id_contract) {
            await api.loadObjects(
                "GetContractProps",
                "/sapsan/contractProps?id_contract=" + id_contract,
                commit,
                "setContractProps"
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
        
        async updateContractProp({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateContractProp",
                "/sapsan/updateContractProp",
                getters.getContractPropById(key),
                values,
                commit,
                "setContractProp",
            );
        },
    },
    mutations: {    
        setContractProps(state, contractProps) {
            state.contractProps = contractProps
        },
        setContractProp(state, contractProp) {
            utils.setItem(state.contractProps, contractProp);
        },
    },
    state: {     
        contractProps: [],
    },
    getters:{ 
        getContractProps: (state) => {
            return state.contractProps;
        },
        getContractPropById: (state) => (Id) => {
            return state.contractProps.find(o => o.Id == Id);
        },
    }
}