import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'fields',
    actions: {
        async loadSprFields({commit}) {
            await api.loadObjects(
                "GetSprFields",
                "/sapsan/fields",
                commit,
                "setSprFields"
            );
        },
        async loadSprFieldById({commit}, id_field) {
            await api.loadObject(
                "GetSprFieldById",
                "/sapsan/fieldById?id_field=" + id_field,
                commit,
                "setSprField"
            );
        },
        async updateSprField({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprField",
                "/sapsan/updateField",
                getters.getSprFieldById(key),
                values,
                commit,
                "setSprField",
            );
        },
    },
    mutations: {
        setSprFields(state, fields) {
            state.fields = fields;
        },
        setSprField(state, field) {
            utils.setItem(state.fields, field);
        },
    },
    state: {
        fields: [],
    },
    getters:{
        getSprFields: (state) => {
            return state.fields;
        },
        getSprFieldById: (state) => (Id) => {
            return state.fields.find(o => o.Id == Id);
        },
      
    }
}
