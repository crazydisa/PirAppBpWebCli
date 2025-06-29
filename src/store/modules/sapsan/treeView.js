import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'treeView',
    actions: {     
        async loadBranchTree({commit},branch) {            
            await api.loadObjectsPost(
                "GetBranchTreeView",
                "/sapsan/branchTreeView",
                branch,
                commit,
                "setBranchTreeView"
            );
        },   
    },
    mutations: {  
        setBranchTreeView(state, branch) {   
            //console.log("MUTATION", branch);        
            state.branch = branch
        },
    },
    state: {     
        branch:[],
    },
    getters:{    
        getBranchTreeView: (state) => {

            return state.branch;
        },
    }
}