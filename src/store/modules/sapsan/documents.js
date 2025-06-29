import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'documents',
    actions: {
        
        
        async loadDocuments({commit}, id_complect) {
            await api.loadObjects(
                "GetDocuments",
                "/sapsan/documents"+(id_complect? ("?id_complect=" + id_complect) : ""),
                commit,
                
                "setDocuments"
            );
        },
        async loadDocumentById({commit}, id_document) {
            await api.loadObject(
                "GetDocumentById",
                "/sapsan/documentById?id_document=" + id_document,
                commit,
                "setDocument"
            );
        },
        async updateDocument({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateDocument",
                "/sapsan/updateDocument",
                getters.getDocumentById(key),
                values,
                commit,
                "setDocument",
            );
        },
        
    },
    mutations: {
        
        setDocuments(state, documents) {
            state.documents=documents;
        },
        setDocument(state, document) {
            utils.setItem(state.documents, document);
        },
    },
    state: {     
        documents: [],
    },
    getters:{
       
        getDocuments: (state) => {
            return state.documents;
        },
        getDocumentById: (state) => (Id) => {
            return state.documents.find(o => o.Id == Id);
        },
    }
}