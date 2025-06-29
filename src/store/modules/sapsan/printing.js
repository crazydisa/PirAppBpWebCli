import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'printing',
    actions: {      
        async createPrinting({commit},printing) {            
            await api.loadObjectsPost(
                "CreatePrinting",
                "/sapsan/set-printings",
                printing,
                commit,
                "addPrinting"
            );
        },  
        async loadPrintings({commit}) {
            await api.loadObjects(
                "getPrintings",
                "/sapsan/printings",
                commit,
                "setPrintings"
            );
        },
    },
    mutations: {
        setPrintings(state, printings) {
            state.printings=printings;
        },
        setPrinting(state, printing) {
            utils.setItem(state.printings, printing);
        },
        addPrinting(state, printing) {
            state.printings.push(printing);
        },
        removePrinting(state, printing) {
            state.printings = utils.getItemsRemoveItem(state.printings, printing);
        },
    },
    state: {
        printings:[]
    },
    getters:{
        getPrintings: (state) => {
            return state.printings;
        },       
    }
}