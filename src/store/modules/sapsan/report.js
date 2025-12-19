import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'report',
    actions: {
        async loadFilesReport({commit},{Id, fileName}) {
            await api.downloadFile(
                "GetReportStream",
                "/documents?eventId="+Id,
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