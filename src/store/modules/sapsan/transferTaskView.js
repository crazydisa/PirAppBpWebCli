import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'transferTaskView',
    actions: {
      
        
        async loadTransferTaskViewById({commit}, id_param) {
            await api.loadObject(
                "GetTransferTaskViewById",
                "/sapsan/transferTaskViewById?id_param=" + id_param,
                commit,
                "setTransferTaskView"
            );
        },
        async loadTransferTaskViews({commit}, id_contract) {
            await api.loadObjects(
                "GetTransferTaskViews",
                "/sapsan/transferTaskViews?id_contract=" + id_contract,
                commit,
                "setTransferTaskViews"
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
        
        async updateTransferTaskView({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateTransferTaskView",
                "/sapsan/updateTransferTaskView",
                getters.getTransferTaskViewById(key),
                values,
                commit,
                "setTransferTaskView",
            );
        },
    },
    mutations: {    
        setTransferTaskViews(state, transferTaskViews) {
            state.transferTaskViews = transferTaskViews
        },
        setTransferTaskView(state, transferTaskView) {
            utils.setItem(state.transferTaskViews, transferTaskView);
        },
    },
    state: {     
        transferTaskViews: [],
    },
    getters:{ 
        getTransferTaskViews: (state) => {
            return state.transferTaskViews;
        },
        getTransferTaskViewById: (state) => (Id) => {
            return state.transferTaskViews.find(o => o.Id == Id);
        },
    }
}