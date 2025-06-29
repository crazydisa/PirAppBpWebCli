import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'documentParts',
    actions: {
        
        
        async loadDocumentParts({commit}, id_document) {
            await api.loadObjects(
                "getDocumentParts",
                "/sapsan/documentParts"+(id_document? ("?id_document=" + id_document) : ""),
                commit,
                
                "setDocumentParts"
            );
        },
        async loadDocumentPartById({commit}, id_documentPart) {
            await api.loadObject(
                "getDocumentPartById",
                "/sapsan/documentPartById?id_documentPart=" + id_documentPart,
                commit,
                "setDocumentPart"
            );
        },
        async updateDocumentPart({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateDocumentPart",
                "/sapsan/updateDocumentPart",
                getters.getDocumentPartById(key),
                values,
                commit,
                "setDocumentPart",
            );
        },
        
    },
    mutations: {
        
        setDocumentParts(state, documentParts) {
            state.documentParts=documentParts;
        },
        setDocumentPart(state, documentPart) {
            utils.setItem(state.documentParts, documentPart);
        },
    },
    state: {     
        documentParts: [],
    },
    getters:{
       
        getDocumentParts: (state) => {
            return state.documentParts;
        },
        getDocumentPartById: (state) => (Id) => {
            return state.documentParts.find(o => o.Id == Id);
        },
    }
}