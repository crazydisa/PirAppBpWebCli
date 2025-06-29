import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'globalOpsTree',
    actions: {     
        async loadGlobalOpsBranch({commit},branch) {            
            await api.loadObjectsPost(
                "GetGlobalOpsBranch",
                "/sapsan/globalOpsBranch",
                branch,
                commit,
                "setGlobalOpsBranch"
            );
        },   
    },
    mutations: {  
        setGlobalOpsBranch(state, globalOpsBranch) {           
            state.globalOpsBranch = globalOpsBranch
        },
    },
    state: {     
        globalOpsBranch:[],
    },
    getters:{    
        getGlobalOpsBranch: (state) => {
            return state.globalOpsBranch;
        },
    }
}