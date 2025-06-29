import api from "@/store/api"
import utils from '@/utils'
import anyObjects from '@/store/modules/sapsan/anyObjects.js'
export default {
    name: 'objectTypes',
    actions: {
        async loadObjectTypes({commit}) {
            await api.loadObjects(
                "GetObjectTypes",
                "/system/object-types",
                commit,
                "setObjectTypes"
            );
        },
        async updateObjectType({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateObjectType",
                "/system/update-object-type",
                getters.getObjectTypeById(key),
                values,
                commit,
                "setObjectType",
            );
        },
    },
    mutations: {
        setObjectTypes(state, objectTypes) {
            for(let i in objectTypes) {
                const objectType = objectTypes[i];
                if(objectType.Properties) {
                    utils.sortItems(objectType.Properties, "SortIndex");
                }
            }
            state.objectTypes = objectTypes;
            if(anyObjects.state.anyObjects){
                let obj = anyObjects.state.anyObjects
                for (let i = 0; i <objectTypes.length; ++i){
                    let objectType = objectTypes[i]
                    const typeName = objectType.Name
                    const nameSpace = objectType.NameSpace
                    const fullTypeName = nameSpace+"."+typeName
                    obj[fullTypeName] = []
                    console.log("obj[fullTypeName]",fullTypeName)
                }
            }
        },
        setObjectType(state, objectType) {
            if(objectType && objectType.Properties) {
                utils.sortItems(objectType.Properties, "SortIndex");
            }
            utils.setItem(state.objectTypes, objectType);
        }
    },
    state: {
        objectTypes: [],
    },
    getters:{
        getObjectTypes: (state) => {
            return state.objectTypes;
        },
        getObjectTypeById: (state) => (Id) => {
            return state.objectTypes.find(o => o.Id == Id);
        },
        getObjectTypeByName: (state) => (name) => {
            return state.objectTypes.find(o => o.Name == name);
        },
        objectTypesIsLoaded: (state) => {
            return state.objectTypes && state.objectTypes.length > 0;
        },
    }
}