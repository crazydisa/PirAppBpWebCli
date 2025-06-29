import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'projectStages',
    actions: {
        async loadProjectStages({commit}) {
            await api.loadObjects(
                "GetProjectStages",
                "/dictionaries/project-stages",
                commit,
                "setProjectStages"
            );
        }
    },
    mutations: {
        setProjectStages(state, projectStages) {
            state.projectStages = projectStages;
        }
    },
    state: {
        projectStages: [],
    },
    getters:{
        getProjectStages: (state) => {
            return state.projectStages;
        },
        getProjectStageByID: (state) => (ID) => {
            return utils.getItemByID(state.projectStages, ID);
        },
    }
}
