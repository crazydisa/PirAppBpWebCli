import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'report',
    actions: {
        async loadFilesReport({commit},{tabelId, fileName}) {
            await api.downloadFile(
                "GetReportStream",
                "/sapsan-app/getReportStream?tabelId="+tabelId,
                fileName,
                commit
            );
        },
       
        
    },
    mutations: {
        setreport(state, report) {
            state.report=report;
        },
    },
    state: {      
        report: []
    },
    getters:{

        getReport: (state) => {
            return state.report;
        },  
         
    }
}