import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'anyObjects',
    actions: {
        
        
        async loadAnyObjects({commit}, requestOptions) {
            await api.loadAnyObjects(
                commit,
                requestOptions
            );
        },
        async setM2MAnyObjects({commit}, values) {
            await api.setM2MAnyObject(
                "SetM2MAnyObjects",
                "/universal/setM2MAnyObjects/",
                //getters.getAnyObjectById(triad),
                values,
                commit,
                "setAnyObject",
            );
        },
        async setOne2MAnyObjects({commit}, values) {
            await api.setOne2MAnyObject(
                "setOne2MAnyObjects",
                "/universal/setOne2MAnyObjects/",
                //getters.getAnyObjectById(triad),
                values,
                commit,
                "setOne2MAnyObjects",
            );
        },
        async updateAnyObject({commit, getters}, requestOptions) {
            await api.updateAnyObject(
                "UpdateAnyObjects",
                "/universal/updateAnyObjects/"+ requestOptions.typeName,
                getters.getAnyObjectById(requestOptions), //OldData
                requestOptions.newData,                   //NewData
                commit,
                requestOptions,
            );
        },
        async clearStore({commit}, storeName){
            commit("setStoreLengthZerro",storeName);
        }
    },
    mutations: {
        
        setAnyObjects(state, response) {

            const {typeName,nameSpace, responseData} = response
            const fullTypeName = nameSpace+"."+typeName
            state.anyObjects[fullTypeName]=responseData?responseData:[];
            
        },
        setM2MAnyObject(){},
        setOne2MAnyObjects(state, response){
            const {OneObject, ManyObject, OneTypeName,
                OneTypeNameSpace, ManyTypeName, ManyTypeNameSpace, RequestOption
            } = response
            const OneFullTypeName = OneTypeNameSpace+"."+OneTypeName
            const manyFullTypeName = ManyTypeNameSpace+"."+ManyTypeName
            if(OneFullTypeName && OneObject){
                if(RequestOption.actionName=="remove"){
                    state.anyObjects[OneFullTypeName] = utils.getItemsRemoveItem(state.anyObjects[OneFullTypeName], OneObject)
                }
                else{
                    utils.setItem(state.anyObjects[OneFullTypeName], OneObject)}
                }
            if(manyFullTypeName && ManyObject){
                if(RequestOption.actionName=="remove"){
                    for(let i =0;i<ManyObject.length;i++){
                        let obj = ManyObject[i]
                        state.anyObjects[manyFullTypeName] = utils.getItemsRemoveItem(state.anyObjects[manyFullTypeName], obj)
                    }
                }
                else{
                    for(let i =0;i<ManyObject.length;i++){
                        let obj = ManyObject[i]
                        utils.setItem(state.anyObjects[manyFullTypeName], obj)
                    }
                }
            }
           
        },
        setAnyObject(state, response) {
            const {typeName,nameSpace, anyObject} = response
            const fullTypeName = nameSpace+"."+typeName
            utils.setItem(state.anyObjects[fullTypeName], anyObject);
        },
        setStoreLengthZerro(state, storeName){
            state.anyObjects[storeName] = []
        }
    },
    state: {     
        anyObjects: {},
    },
    getters:{
       
        getAnyObjects: (state) =>  {
            return state.anyObjects;
        },
        getAnyObjectById: (state) => (triad) => {
            const {Id, typeName,nameSpace} = triad
            const fullTypeName = nameSpace+"."+typeName
            if (fullTypeName in state.anyObjects)
                return state.anyObjects[fullTypeName].find(o => o.Id == Id);
            else
                return null
        },
    }
}