import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'SprDocumentType',
    actions: {
        
        async loadSprDocumentTypes({commit}) {
            await api.loadObjects(
                "getSprDocumentTypes",
                "/sapsan/documentTypes",
                commit,
                "setSprDocumentTypes"
            );
        },
        
        async loadSprDocumentTypeById({commit}, id_documentType) {
            await api.loadObject(
                "getSprDocumentTypeById",
                "/sapsan/documentTypeById?id_documentType=" + id_documentType,
                commit,
                "setSprDocumentType"
            );
        },
        async updateSprDocumentType({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateSprDocumentType",
                "/sapsan/updateSprDocumentType",
                getters.getSprDocumentTypeById(key),
                values,
                commit,
                "setSprDocumentType",
            );
        },
        
    },
    mutations: {
        
        setSprDocumentTypes(state, documentTypes) {
            state.documentTypes=documentTypes;
        },
        setSprDocumentType(state, documentType) {
            utils.setItem(state.documentTypes, documentType);
        },
    },
    state: {     
        documentTypes: [],
    },
    getters:{
       
        getSprDocumentTypes: (state) => {
            return state.documentTypes;
        },
        getSprDocumentTypeById: (state) => (Id) => {
            return state.documentTypes.find(o => o.Id == Id);
        },
    }
}