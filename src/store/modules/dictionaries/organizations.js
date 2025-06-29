import api from "@/store/api"
//import utils from '@/utils'

export default {
    name: 'organizations',
    actions: {
        async loadSprOrganizations({commit}) {
            await api.loadObjects(
                "GetSprOrganizations",
                "/dictionaries/organizations",
                commit,
                "setSprOrganizations"
            );
        }
    },
    mutations: {
        setSprOrganizations(state, organizations) {
            state.organizations = organizations;
        }
    },
    state: {
        organizations: [],
    },
    getters:{
        getSprOrganizations: (state) => {
            return state.organizations;
        },
        getSprOrganizationById: (state) => (Id) => {
            return state.organizations.find(o => o.Id == Id);
        },
    }
}
