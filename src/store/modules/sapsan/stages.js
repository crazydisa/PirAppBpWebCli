import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'stages',
    actions: {      
        async loadSprStages({commit}, id_contract) {
            await api.loadObjects(
                "GetStage",
                "/sapsan/stage?id_contract=" + id_contract,
                commit,
                "setSprStages"
            );
        },  
        async loadSprStageById({commit}, id_stage) {
            await api.loadObject(
                "GetStageById",
                "/sapsan/stageById?id_stage=" + id_stage,
                commit,
                "setSprStage"
            );
        },
    },
    mutations: {      
        setSprStages(state, stages) {
            state.stages = stages
        },   
        setSprStage(state, stage) {
            utils.setItem(state.stages, stage);
        },  
    },
    state: {     
        stages: [],
    },
    getters:{
        getSprStages: (state) => {
            return state.stages;
        },
        getSprStageById: (state) => (Id) => {
            return state.stages.find(o => o.Id == Id);
        },
    }
}