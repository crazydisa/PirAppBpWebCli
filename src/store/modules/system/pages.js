import api from "@/store/api"
import utils from '@/utils'

export default {
    name: 'pages',
    actions: {
        async loadPages({commit}) {
            await api.loadObjects(
                "GetPages",
                "/system/pages",
                commit,
                "setPages"
            );
        },
        async updatePage({commit, getters}, {key, values}) {
            await api.updateObject(
                "UpdatePage",
                "/system/update-page",
                getters.getPageById(key),
                values,
                commit,
                "setPage",
            );
        },
    },
    mutations: {
        setPages(state, pages) {
            for(let i in pages) {
                const page = pages[i];
                if(page.Properties) {
                    utils.sortItems(page.Properties, "SortIndex");
                }
            }
            state.pages = pages;
        },
        setPage(state, page) {
            if(page && page.Properties) {
                utils.sortItems(page.Properties, "SortIndex");
            }
            utils.setItem(state.pages, page);
        }
    },
    state: {
        pages: [],
    },
    getters:{
        getPages: (state) => {
            return state.pages;
        },
        getPageById: (state) => (Id) => {
            return state.pages.find(o => o.Id == Id);
        },
        pagesIsLoaded: (state) => {
            return state.pages && state.pages.length > 0;
        },
    }
}