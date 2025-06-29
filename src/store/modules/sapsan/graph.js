import api from "@/store/api"

export default {
    name: 'graph',
    actions: {
      
        async loadGraph({commit}) {
            await api.loadObject(
                "GetGraph",
                "/sapsan/graph",
                commit,
                "setGraph"
            );
        },
        async updateGraph({commit}, graph){
            commit('setGraph',graph)
        },
        async updateValue({commit}, node){
            commit('setValue', node)
        }

    },
    mutations: {    
        setGraph(state, graph) {
            state.graph = graph;
            //state.graph ={...state.graph}
        },
        setSetting(state, setting){
            state.setting = setting
        },
        setDSetting(state, dSetting){
            state.dSetting = dSetting
        },
        setValue(state, node){

            state.graph.nodes[node.name] = node
            let start = node 
            const queue = [start.name];
            const visited = {};
            visited[start.name] = true;
            let currentVertex;
            let bindingEdge = 3
            let parents = {}
            while (queue.length) {
                currentVertex = queue.shift();
                let edgeList = state.graph.nodes[currentVertex].edgeList
                for (let key of Object.keys(edgeList)) {
                    if (!visited[key]) {
                        if (edgeList[key]==bindingEdge){
                            queue.push(key);
                            parents[key]=currentVertex
                        }
                        visited[key] = true;
                    }
                }
            }
            for (let key in parents) {
                let currentNode = state.graph.nodes[key]
                let currentPath = currentNode.nickname
                let parentNode = state.graph.nodes[parents[key]]
                currentNode.value = parentNode.value[currentPath]
                //console.log("parentNode.value[currentPath] = ", parentNode.value[currentPath])
            }
            //console.log("parents = ", parents)
        },
        
    },
    state: {     
        graph: {},
        setting: {},
        dSetting: [],
        value: {}
    },
    getters:{ 
        getGraph: (state) => {
            return state.graph;
        },
        getValue: (state)  => (name)=>{
            if(!name){return null}
            if(!state.graph.isPresent(name)){return null}
            let start = state.graph.nodes[name]
            let end = start
            if(!start){return null}
            let bindingEdge = 2
            const queue = [start.name];
            const result = [];
            const visited = {};
            visited[start.name] = true;
            let currentVertex;
            while (queue.length) {
                currentVertex = queue.shift();
                result.push(currentVertex);
                end = state.graph.nodes[currentVertex]
                let edgeList = state.graph.nodes[currentVertex].edgeList
                for (let key of Object.keys(edgeList)) {
                    if (!visited[key]) {
                        if (edgeList[key]<=bindingEdge){
                            visited[key] = true;
                            queue.push(key);
                            //console.log(key)
                        }
                    }
                }
            }
            //console.log("name = ", name, "; end = ",end.name)
            if(!end.nickname.includes("EventHandler")){
                
                return end.value

            }
            else{

                return null
            }
        },
        
        getSetting: (state) => {
            return state.setting;
        },
        getDSetting: (state) => {
            return state.dSetting;
        },
        getComp: (state)  => (name) => {
            for (let arrayIndex = 0; arrayIndex < state.setting.length; ++arrayIndex) {        
                var components = state.setting[arrayIndex].components
                var compIndex;
                for (compIndex = 0; compIndex < components.length; ++compIndex) {
                  var component = components[compIndex]
                  if(component.name.value == name){
                    return component
                  }
                }
            }
            return null
        },
    }
}