import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'pshPlans',
    actions: {
        
        async loadPshPlanById({commit}, id_plan) {
            await api.loadObject(
                "GetPshPlanById",
                "/sapsan/pshPlanById?id_op=" + id_plan,
                commit,
                "setPshPlan"
            );
        },
        async loadPshPlans({commit}, id_contract) {
            await api.loadObjects(
                "GetPshPlans",
                "/sapsan/pshPlans?id_contract=" + id_contract,
                commit,
                "setPshPlans"
            );
        },
    },
    mutations: {
        setPshPlans(state, pshPlans) {
            state.pshPlans = pshPlans;
        },
        setPshPlan(state, pshPlan) {
            utils.setItem(state.pshPlans, pshPlan);
        },
    },
    state: {
        pshPlans: [],
    },
    getters:{
        getPshPlans: (state) => {
            return state.pshPlans;
        },
        getPshPlanById: (state) => (Id) => {
            return state.pshPlans.find(o => o.Id == Id);
        },
    }
}
