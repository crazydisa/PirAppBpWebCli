import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'protocols',
    actions: {
      
        async loadLetterProtocols({commit}, id_contract) {
            await api.loadObjects(
                "GetLetterProtocols",
                "/sapsan/letterProtocol?id_contract=" + id_contract,
                commit,
                "setLetterProtocols"
            );
        },
        async loadLetterProtocolById({commit}, id_protocol) {
            await api.loadObject(
                "GetLetterProtocol",
                "/sapsan/letterProtocolById?id_protocol=" + id_protocol,
                commit,
                "setLetterProtocol"
            );
        },
        
        
        async updateComplect({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateLetterProtocol",
                "/sapsan/updateletterProtocol",
                getters.getLetterProtocolById(key),
                values,
                commit,
                "setLetterProtocol",
            );
        },
    },
    mutations: {    
        setLetterProtocols(state, protocols) {
            state.protocols = protocols
        },
        setLetterProtocol(state, protocol) {
            utils.setItem(state.protocols, protocol);
        },
    },
    state: {     
        protocols: [],
    },
    getters:{ 
        getLetterProtocols: (state) => {
            return state.protocols;
        },
        getLetterProtocolById: (state) => (Id) => {
            return state.protocols.find(o => o.Id == Id);
        },
    }
}