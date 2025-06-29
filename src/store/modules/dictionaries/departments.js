import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'departments',
    actions: {
        async loadDepartments({commit}) {
            await api.loadObjects(
                "GetDepartments",
                "/dictionaries/departments",
                commit,
                "setDepartments"
            );
        }
    },
    mutations: {
        setDepartments(state, departments) {
            state.departments = departments;
        }
    },
    state: {
        departments: [],
    },
    getters:{
        getDepartments: (state) => {
            return state.departments;
        },
        getDepartmentByID: (state) => (ID) => {
            return utils.getItemByID(state.departments, ID);
        },
    }
}
