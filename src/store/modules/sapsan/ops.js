import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'ops',
    actions: {
        async loadOps({commit}) {
           // const params = id_project ? ("?id_project=" + id_project) : "";
            await api.loadObjects(
                "GetOps",
                "/sapsan/ops",// + params,
                commit,
                "setOps"
            );
        },
        async loadOpById({commit}, id_op) {
            await api.loadObject(
                "GetOpById",
                "/sapsan/opById?id_op=" + id_op,
                commit,
                "setOp"
            );
        },
    },
    mutations: {
        setOps(state, ops) {
            state.ops = ops;
        },
        setOp(state, op) {
            utils.setItem(state.ops, op);
        },
    },
    state: {
        ops: [],
    },
    getters:{
        getOps: (state) => {
            return state.ops;
        },
        getOpById: (state) => (Id) => {
            return state.ops.find(o => o.Id == Id);
        },
    }
}
