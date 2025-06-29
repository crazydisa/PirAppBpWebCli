import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'sprSubdivision',
    actions: {
      
        
        async loadSprSubdivisionById({commit}, id_param) {
            await api.loadObject(
                "GetSprSubdivisionById",
                "/sapsan/sprSubdivisionById?id_param=" + id_param,
                commit,
                "setSprSubdivision"
            );
        },
        async loadSprSubdivisions({commit},branch) {            
            await api.loadObjectsPost(
                "GetSprSubdivisions",
                "/sapsan/sprSubdivisions",
                branch,
                commit,
                "setSprSubdivisions"
            );
        },
        
        async updateSprSubdivision({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprSubdivision",
                "/sapsan/updateSprSubdivision",
                getters.getSprSubdivisionById(key),
                values,
                commit,
                "setSprSubdivision",
            );
        },
    },
    mutations: {    
        setSprSubdivisions(state, sprSubdivisions) {
            state.sprSubdivisions = sprSubdivisions
        },
        setSprSubdivision(state, sprSubdivision) {
            utils.setItem(state.sprSubdivisions, sprSubdivision);
        },
    },
    state: {     
        sprSubdivisions: [],
    },
    getters:{ 
        getSprSubdivisions: (state) => {
            return state.sprSubdivisions;
        },
        getSprSubdivisionById: (state) => (Id) => {
            return state.sprSubdivisions.find(o => o.Id == Id);
        },
    }
}