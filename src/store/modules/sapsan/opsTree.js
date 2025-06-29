import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'casePropsTreeoject',
    actions: {     
        async loadOpsBranch({commit},branch) {            
            await api.loadObjectsPost(
                "GetOpsBranch",
                "/sapsan/opsBranch",
                branch,
                commit,
                "setOpsBranch"
            );
        },   
    },
    mutations: {  
        setOpsBranch(state, opsBranch) {           
            state.opsBranch = opsBranch
        },
    },
    state: {     
        opsBranch:[],
    },
    getters:{    
        getOpsBranch: (state) => {
            return state.opsBranch;
        },
    }
}