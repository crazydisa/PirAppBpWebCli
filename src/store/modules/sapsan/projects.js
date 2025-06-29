import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'projects',
    actions: {      
        async loadContracts({commit}) {
            await api.loadObjects(
                "GetContracts",
                "/sapsan/contracts",
                commit,
                "setContracts"
            );
        },
       
        async loadContractById({commit}, id_project) {
            await api.loadObject(
                "GetContractById",
                "/sapsan/contractById?id_project=" + id_project,
                commit,
                "setContract"
            );
        },
        
    },
    mutations: {
        setContracts(state, projects) {
            state.projects = projects
        },
        setContract(state, project) {
            utils.setItem(state.projects, project);
        },
    },
    state: {     
        projects: [],
    },
    getters:{
        getContracts: (state) => {
            return state.projects;
        },
        getContractById: (state) => (Id) => {
            return state.projects.find(o => o.Id == Id);
        },
    }
}