import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'dictionaries',
    actions: {
        async loadDictionaryTypes({commit}) {
            await api.loadObjects(
                "GetDictionaryTypes",
                "/dictionaries/dictionary-types",
                commit,
                "setDictionaryTypes"
            );
        },
        async loadDictionaryItems({commit}, typeName) {
            await api.loadObjects(
                "GetDictionaryItems",
                "/dictionaries/dictionary-items" + (typeName ? ("?typeName=" + typeName) : ""),
                commit,
                "setDictionaryItems"
            );
        },
        async loadDictionaryItemsId({commit}, typeId) {
            await api.loadObjects(
                "GetDictionaryItems",
                "/dictionaries/dictionary-items?typeId="+typeId,
                commit,
                "setDictionaryItems"
            );
        },
        async loadDictionaryItem({commit}, Id) {
            await api.loadObject(
                "GetDictionaryItem",
                "/dictionaries/dictionary-item/" + Id,
                commit,
                "setDictionaryItem"
            );
        },
        async createDictionaryItem({commit}, values) {
            await api.createObject(
                "CreateDictionaryItem",
                "/dictionaries/create-dictionary-item",
                values,
                commit,
                "addDictionaryItem"
            );
        },
        async updateDictionaryItem({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateDictionaryItem",
                "/dictionaries/update-dictionary-item",
                getters.getDictionaryItemById(key),
                values,
                commit,
                "setDictionaryItem",
            );
        },
        async deleteDictionaryItem({commit, getters}, key) {
            await api.deleteObject(
                "DeleteDictionaryItem",
                "/dictionaries/delete-dictionary-item",
                getters.getDictionaryItemById(key),
                commit,
                "removeDictionaryItem"
            );
        }
    },
    mutations: {
        setDictionaryTypes(state, dictionaryTypes) {
            state.dictionaryTypes = dictionaryTypes;
        },
        setDictionaryItems(state, dictionaryItems) {
            state.dictionaryItems = dictionaryItems;
        },
        setDictionaryItem(state, dictionaryItem) {
            utils.setItem(state.dictionaryItems, dictionaryItem);
        },
        addDictionaryItem(state, dictionaryItem) {
            state.dictionaryItems.push(dictionaryItem);
        },
        removeDictionaryItem(state, dictionaryItem) {
            state.dictionaryItems = utils.getItemsRemoveItem(state.dictionaryItems, dictionaryItem);
        },
    },
    state: {
        dictionaryTypes: [],
        dictionaryItems: [],
    },
    getters:{
        getDictionaryTypes: (state) => {
            return state.dictionaryTypes;
        },
        getDictionaryItems: (state) => {
            return state.dictionaryItems;
        },
        getDictionaryItemById: (state) => (Id) => {
            return state.dictionaryItems.find(o => o.Id == Id);
        },
    }
}