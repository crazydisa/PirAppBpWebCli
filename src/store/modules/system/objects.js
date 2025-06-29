import api from "@/store/api"

export default {
    name: 'objects',
    actions: {
        async loadObjects({commit}, objIds) {
            const params = objIds ? "?objs=" + objIds.join(",") : "";
            await api.loadObjects(
                "GetObjects",
                "/system/objects" + params,
                commit,
                "setObjects"
            );
        }
    },
    mutations: {
        setObjects(state, objects) {
            state.objects = objects;
        }
    },
    state: {
        objects: [],
    },
    getters:{
        getObjects: (state) => {
            return state.objects;
        },
        getObjectById: (state) => (Id) => {
            return state.objects.find(o => o.Id == Id);
        }
    }
}