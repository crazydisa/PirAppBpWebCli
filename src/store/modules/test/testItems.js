import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'testItems',
    actions: {
        async loadTestItems({commit}) {
            await api.loadObjects(
                "GetTestItems",
                "/test/test-items/",
                commit,
                "setTestItems"
            );
        },
        async loadTestItem({commit}, Id) {
            await api.loadObject(
                "GetTestItem",
                "/test/test-item/" + Id,
                commit,
                "setTestItem"
            );
        },
        async createTestItem({commit}, values) {
            await api.createObject(
                "CreateTestItem",
                "/test/create-test-item",
                values,
                commit,
                "addTestItem"
            );
        },
        async updateTestItem({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdateTestItem",
                "/test/update-test-item",
                getters.getTestItemById(key),
                values,
                commit,
                "setTestItem",
            );
        },
        async deleteTestItem({commit, getters}, key) {
            await api.deleteObject(
                "DeleteTestItem",
                "/test/delete-test-item",
                getters.getTestItemById(key),
                commit,
                "removeTestItem"
            );
        },
    },
    mutations: {
        setTestItems(state, testItems) {
            state.testItems = testItems;
        },
        setTestItem(state, testItem) {
            utils.setItem(state.testItems, testItem);
        },
        addTestItem(state, testItem) {
            state.testItems.push(testItem);
        },
        removeTestItem(state, testItem) {
            state.testItems = utils.getItemsRemoveItem(state.testItems, testItem);
        },
    },
    state: {
        testItems: [],
    },
    getters:{
        getTestItems: (state) => {
            return state.testItems;
        },
        getTestItemById: (state) => (Id) => {
            return state.testItems.find(o => o.Id == Id);
        },
    }
}