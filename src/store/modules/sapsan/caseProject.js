import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'caseProject',
    actions: {     
        async loadTreeObjectsBranch({commit},branch) {            
            await api.loadObjectsPost(
                "GetTreeObjectsBranch",
                "/sapsan/treeObjectsBranch",
                branch,
                commit,
                "setTreeObjectsBranch"
            );
        },   
    },
    mutations: {  
        setTreeObjectsBranch(state, treeObjectsBranch) {           
            state.treeObjectsBranch = treeObjectsBranch
        },
    },
    state: {     
        treeObjectsBranch:[],
    },
    getters:{    
        getTreeObjectsBranch: (state) => {
            return state.treeObjectsBranch;
        },
    }
}