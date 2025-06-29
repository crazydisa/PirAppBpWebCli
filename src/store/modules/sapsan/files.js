import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'files',
    actions: {
        async loadFilesTest({commit},pdf_file_path) {
            await api.downloadFile(
                "GetFile",
                "/sapsan/sendFile"+(pdf_file_path? ("?pdf_file_path=" + pdf_file_path) : ""),
                pdf_file_path,
                commit
            );
        },
        async loadFilesFromComplect({commit},id_complect) {
            await api.loadObjects(
                "GetFilesFromComplect",
                "/sapsan/filesFromComplect"+(id_complect? ("?id_complect=" + id_complect) : ""),
                commit,
                "setFilesFromComplect"
            );
        },
        
    },
    mutations: {
        setFilesFromComplect(state, filesFromComplect) {
            state.filesFromComplect=filesFromComplect;
        },
    },
    state: {      
        filesFromComplect: []
    },
    getters:{

        getFilesFromComplect: (state) => {
            return state.filesFromComplect;
        },  
         
    }
}