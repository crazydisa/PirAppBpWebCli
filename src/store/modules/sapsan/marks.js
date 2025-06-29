import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'marks',
    actions: {      
        async loadSprMarks({commit}) {
            await api.loadObjects(
                "GetSprMarks",
                "/sapsan/marks",
                commit,
                "setSprMarks"
            );
        },
       
        async loadMarkById({commit}, id_mark) {
            await api.loadObject(
                "GetSprMarkById",
                "/sapsan/markById?id_mark=" + id_mark,
                commit,
                "setSprMark"
            );
        },
        async updateSprMark({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprMark",
                "/sapsan/updateMark",
                getters.getSprMarkById(key),
                values,
                commit,
                "setSprMark",
            );
        },
        
    },
    mutations: {
        setSprMarks(state, marks) {
            state.marks = marks
        },
        setSprMark(state, mark) {
            utils.setItem(state.marks, mark);
        },
    },
    state: {     
        marks: [],
    },
    getters:{
        getSprMarks: (state) => {
            return state.marks;
        },
        getSprMarkById: (state) => (Id) => {
            return state.marks.find(o => o.Id == Id);
        },
    }
}