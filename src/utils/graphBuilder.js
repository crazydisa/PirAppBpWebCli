import {Graph } from "@/utils/graph.js";
export default {
    prepareSetting(startId,containers){ 
        let id = startId
        let oldNames = {}
        for(let containerKey of Object.keys(containers)){
            let container = containers[containerKey]
            container ={id: id++, value: container}
            containers[containerKey]=container
            for(let containerPropKey of Object.keys(container.value)){
                container.value[containerPropKey]={id: id++, value: container.value[containerPropKey]}
                if(startId>1 && containerPropKey=="CONTAINERNAME"){
                    oldNames[container.value[containerPropKey].value]=container.id.toString()
                    container.value[containerPropKey] = container.id
                }
            }
            let dataSource = container.value.dataSource.value
            for (let arrayIndex = 0; arrayIndex < dataSource.length; ++arrayIndex) {
                let group = dataSource[arrayIndex]
                group = {id: id++, value: group}
                dataSource[arrayIndex] = group
                for(let key of Object.keys(group.value)){
                    group.value[key]={id: id++, value: group.value[key]}
                    if(startId>1 && key=="GROUPNAME"){
                        group.value[key].value = group.id
                    }
                } 
                let components = group.value.COMPONENTS.value
                for (let compIndex = 0; compIndex < components.length; ++compIndex) {
                    let component = components[compIndex]
                    component = {id: id++, value:  component}
                    components[compIndex]=component
                    for(let key of Object.keys(component.value)){
                        component.value[key]={id: id++, value: component.value[key]}
                        
                        if(startId>1 && key=="NAME"){
                            oldNames[component.value[key].value]=component.id.toString()
                            component.value[key].value = component.id.toString()
                            
                        }
                    }                   
                }
            }
            
        }
        if(startId>1){
            for(let containerKey of Object.keys(containers)){
                let container = containers[containerKey]
                for(let containerPropKey of Object.keys(container.value)){
                    let value = container.value[containerPropKey].value
                    if(typeof(value)=="string"){
                        this.editBindingString(container, containerPropKey, oldNames)
                    }
                }
                let dataSource = container.value.dataSource.value
                for (let arrayIndex = 0; arrayIndex < dataSource.length; ++arrayIndex) {
                    let group = dataSource[arrayIndex]
                    let components = group.value.COMPONENTS.value
                    for (let compIndex = 0; compIndex < components.length; ++compIndex) {
                        let component = components[compIndex]
                        for(let key of Object.keys(component.value)){
                            let value = component.value[key].value
                            if(typeof(value)=="string"){
                                this.editBindingString(component, key, oldNames)
                            }
                        }
                    }
                }
            }
        }
        return containers
    },
    editBindingString(obj, key, oldNames){
        let value = obj.value[key].value
        let binding=value.match(/^\{\s*\bbinding\b\s+\bcomponentName\b\s*=\s*(\w+)\s*,\s*\bpath\b\s*=\s*([A-Za-z0-9.[\]]+)\s*\}$/i) || []
        if(binding.length==3){
            let bindingCompName = binding[1]
            if( oldNames[bindingCompName] !== undefined ) {
                value = value.replace(bindingCompName, oldNames[bindingCompName])
                obj.value[key].value = value
            }
        }
    },
    buildTree(graph, containers){  //{GROUPNAME, COMPONENTS, NAME} - обязательные атрибуты входного массива
        let result = {addedRootNodes: {}, addedComponentNodes: {}}     
        let structureEdge = 1
        for(let containerKey of Object.keys(containers)){
            let topVertex = 0
            let vertex = containers[containerKey]
            let vertexName = vertex.id
            let vertexValue = vertex.value.CONTAINERNAME.value
            let nickname = "CONTAINERNAME"
            result.addedRootNodes[vertexName]=graph.addVertex(vertexName, nickname, vertexValue)
            let startVertex = topVertex
            let endVertex = vertexName
            let debugEdge = vertexValue
            graph.createEdge(startVertex, endVertex, structureEdge)
            graph.createDebugEdge(startVertex, endVertex, debugEdge)
            topVertex = endVertex
            vertex = vertex.value
            for(let containerPropKey of Object.keys(vertex)){
                vertexName = vertex[containerPropKey].id
                vertexValue = vertex[containerPropKey].value
                nickname = containerPropKey
                result.addedComponentNodes[vertexName]=graph.addVertex(vertexName, nickname, vertexValue)
                startVertex = topVertex
                endVertex = vertexName
                debugEdge = containerPropKey
                graph.createEdge(startVertex, endVertex, structureEdge)
                graph.createDebugEdge(startVertex, endVertex, debugEdge)
                if(containerPropKey=="dataSource"){
                    let containerVertexName = vertex[containerPropKey].id
                    let dataSource = vertex[containerPropKey].value
                    for (let arrayIndex = 0; arrayIndex < dataSource.length; ++arrayIndex) {
                        topVertex = containerVertexName
                        vertex = dataSource[arrayIndex]
                        vertexName = vertex.id
                        vertexValue = vertex.value.GROUPNAME.value
                        nickname = "GROUPNAME"
                        graph.addVertex(vertexName, nickname, vertexValue)
                        startVertex = topVertex
                        endVertex = vertexName
                        debugEdge = vertexValue
                        graph.createEdge(startVertex, endVertex, structureEdge)
                        graph.createDebugEdge(startVertex, endVertex, debugEdge)
                        topVertex = endVertex
                        vertex = vertex.value
                        for(let key of Object.keys(vertex)){
                            vertexName = vertex[key].id
                            vertexValue = vertex[key].value
                            nickname = key
                            graph.addVertex(vertexName, nickname, vertexValue)
                            startVertex = topVertex
                            endVertex = vertexName
                            debugEdge = key
                            graph.createEdge(startVertex, endVertex, structureEdge)
                            graph.createDebugEdge(startVertex, endVertex, debugEdge)
                            if(key=="COMPONENTS"){
                                let copyTopVertex = vertex[key].id
                                let components = vertex[key].value
                                for (let compIndex = 0; compIndex < components.length; ++compIndex) {
                                    topVertex = copyTopVertex
                                    vertex = components[compIndex]
                                    vertexName = vertex.id
                                    vertexValue = vertex.value.NAME.value     
                                    nickname = "NAME"
                                    result.addedComponentNodes[vertexName]=graph.addVertex(vertexName, nickname, vertexValue)
                                    startVertex = topVertex
                                    endVertex = vertexName
                                    debugEdge = vertexValue
                                    graph.createEdge(startVertex, endVertex, structureEdge)
                                    graph.createDebugEdge(startVertex, endVertex, debugEdge)
                                    topVertex = endVertex
                                    vertex = vertex.value
                                    for(let key of Object.keys(vertex)){
                                        vertexName = vertex[key].id
                                        vertexValue = vertex[key].value
                                        nickname = key
                                        if(key!="NAME"){
                                            graph.addVertex(vertexName, nickname, vertexValue)
                                            startVertex = topVertex
                                            endVertex = vertexName
                                            debugEdge = key
                                            graph.createEdge(startVertex, endVertex, structureEdge)
                                            graph.createDebugEdge(startVertex, endVertex, debugEdge)
                                        }
                                    }
                                }
                            }
                        } 
                    }
                }
            }
        }
        return result
    },

    buildGraph(exsistGraph,partSettings){
        let graph = exsistGraph
        if(!exsistGraph){
            graph = new Graph(true)
            graph.addVertex(0,"STARTVERTEX")
        }
        let startId = graph.getNextFreeId()
        let settings = this.prepareSetting(startId,partSettings)
        let addedRootNodes = this.buildTree(graph,settings)
        //console.log("graph!!!!!!!!!",graph)
        //this.addBindingEdges(graph, addedRootNodes.addedRootNodes)
        this.addBindingEdges2(graph, addedRootNodes.addedRootNodes)
        let newGraph = new Graph(true)
        Object.assign(newGraph.nodes, graph.nodes)
        for (let key in graph.nodes) {
            //Object.assign(newGraph.nodes[key], graph.nodes[key])
            Object.assign(newGraph.nodes[key].edgeList, graph.nodes[key].edgeList)
            Object.assign(newGraph.nodes[key].debugEdgeList, graph.nodes[key].debugEdgeList)
        }
        return {graph: newGraph, rootNodes: addedRootNodes, settings: settings}
    },

    addBindingEdges2(graph, rootNodes){
        for (let key of Object.keys(rootNodes)) {
            let start = rootNodes[key]
            const queue = [start.name];
            const visited = {};
            visited[start.name] = true;
            let currentVertex;
            let bindingEdge = 1
            let parents = {}
            let bindings = []
            let bindingPath
            while (queue.length) {
                currentVertex = queue.shift();
                let edgeList = graph.nodes[currentVertex].edgeList
                for (let key of Object.keys(edgeList)) {
                    if (!visited[key]) {
                        if (edgeList[key]==bindingEdge){
                            queue.push(key);
                            parents[key]=currentVertex
                            let vertex = graph.nodes[key]
                            if(typeof(vertex.value)=="string"){
                                let binding=vertex.value.match(/^\{\s*\bbinding\b\s+\bcomponentName\b\s*=\s*(\w+)\s*,\s*\bpath\b\s*=\s*([A-Za-z0-9.[\]]+)\s*\}$/i) || []
                                if(binding.length==3){
                                    let bindingCompName = binding[1]
                                    let bindingPaths = binding[2].split(/\.|\[/)
                                    bindingPath = bindingPaths[0]
                                    //bindingPath = binding[2].substring(0, binding[2].indexOf(".")<0?binding[2].length:binding[2].indexOf("."));
                                    //bindingPath = bindingPath.substring(0, bindingPath.indexOf("[")<0?bindingPath.length:bindingPath.indexOf("["));
                                    //console.log("bindingPath!!!!!!!!!",bindingPath)
                                    vertex['bindingCompName']=binding[1]
                                    vertex['bindingPath']=binding[2]
                                    let parentVertex = graph.findVertexByValue(bindingCompName)
                                    let childVertex = graph.getAllChildsByEdge(parentVertex, 1)
                                    for (let key of Object.keys(childVertex)) {
                                        if(childVertex[key].nickname==bindingPath){
                                            
                                            bindings.push({[key]: vertex.name, value: childVertex[key].value})
                                        }
                                    }
                                    //console.log("bindings = ",bindings)
                                }
                            }
                        }
                        visited[key] = true;
                    }
                }
            }

            for (let key  of Object.values(bindings)) {
                let startVertex = graph.nodes[Object.values(key)[0]]
                let endVertex = graph.nodes[Object.keys(key)[0]]
                let bindingPath = startVertex.bindingPath
                //console.log("bindingPath = ", bindingPath)
                if(!bindingPath){continue }
                let splitPath = bindingPath.split(/\.|\[|\]/)
                //console.log("splitPath = ", splitPath)
                let debugEdge = bindingPath
                if (splitPath.length>1){
                    const queue = [Object.keys(key)[0]]
                    //console.log("Object.keys(key)[0] = ", Object.keys(key)[0])
                    let endKey
                    while (queue.length) {
                        endKey = queue.shift();
                        for (let key  of Object.values(bindings)) {
                            if (Object.values(key)[0]==endKey){
                                queue.push(Object.keys(key)[0]);
                            }

                        }
                    }
                    endVertex = graph.nodes[endKey]
                    bindingEdge = 3
                    for (let arrayIndex = 1; arrayIndex < splitPath.length; ++arrayIndex) {
                        let nickname = splitPath[arrayIndex]    
                        if (nickname=="")continue                   
                        startVertex = endVertex
                        let startId = graph.getNextFreeId()
                        
                        let vertexValue = null
                        if (typeof endVertex.value === 'object' && !Array.isArray(endVertex.value) && endVertex.value !== null){
                            if (nickname in endVertex.value){
                                vertexValue = endVertex.value[nickname]}
                        }else if (Array.isArray(endVertex.value) && endVertex.value !== null && this.isNumeric(nickname)){
                            vertexValue = endVertex.value[Number(nickname)]
                        }
                        
                        debugEdge = nickname
                        endVertex = graph.addVertex(startId, nickname, vertexValue)
                        graph.createEdge(startVertex.name, endVertex.name, bindingEdge)
                        graph.createDebugEdge(startVertex.name, endVertex.name, debugEdge)
                    }
                }
                startVertex = graph.nodes[Object.values(key)[0]]
                bindingEdge = 2
                debugEdge = bindingPath
                graph.createEdge(startVertex.name, endVertex.name, bindingEdge)
                graph.createDebugEdge(startVertex.name, endVertex.name, debugEdge)  
            }
        }
    },

    addBindingEdges(graph, rootNodes){
        for (let node of Object.keys(rootNodes)) {
            let childNodes = graph.getAllChildsByEdge(rootNodes[node], 1)
            for(let child in childNodes){
                this.addDataEdges( graph, childNodes[child])
            }
        }
    },

    addDataEdges(graph, vertex){
        let bindingEdge = 2
        let endVertex = vertex
        if(typeof(vertex.value)=="string"){
            let binding=vertex.value.match(/^\{\s*\bbinding\b\s+\bcomponentName\b\s*=\s*(\w+)\s*,\s*\bpath\b\s*=\s*([A-Za-z0-9.]+)\s*\}$/i) || []
            if(binding.length==3){
                let bindingCompName = binding[1]
                let bindingPath = binding[2]
                let splitPath = bindingPath.split('.')
                let parentVertex = graph.findVertexByValue(bindingCompName)
                let childVertex = graph.getAllChildsByEdge(parentVertex, 1)
                let startVertex = vertex
                let debugEdge = bindingPath
                for (let key of Object.keys(childVertex)) {
                    if(childVertex[key].nickname==bindingPath){
                        
                        endVertex = childVertex[key]
                        if (splitPath.length>1){
                            startVertex = endVertex
                            bindingEdge = 3
                            for (let arrayIndex = 1; arrayIndex < splitPath.length; ++arrayIndex) {
                                let startId = graph.getNextFreeId()
                                let nickname = splitPath[arrayIndex]
                                let vertexValue = null
                                debugEdge = nickname
                                endVertex = graph.addVertex(startId, nickname, vertexValue)
                                graph.createEdge(startVertex.name, endVertex.name, bindingEdge)
                                graph.createDebugEdge(startVertex.name, endVertex.name, debugEdge)
                                startVertex = endVertex
                            }
                            startVertex = vertex
                            bindingEdge = 2
                            debugEdge = bindingPath
                        }
                        graph.createEdge(startVertex.name, endVertex.name, bindingEdge)
                        graph.createDebugEdge(startVertex.name, endVertex.name, debugEdge)  
                    }
                }               
            }
        }
        return endVertex
    },
    isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) && !isNaN(parseFloat(str)) 
    }
}