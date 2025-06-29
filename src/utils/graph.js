//import { isProxy, toRaw } from 'vue';
//import { mapMutations } from "vuex";
import {Node } from "@/utils/node.js";
import store from '@/store'
export class Graph{
constructor(type) {
    (this.nodes = {}), 
    (this.directed = type ? type : false);

  }

  getNodeValue(id, propName){
    if (typeof propName === 'string' || propName instanceof String){
      let childs = this.getAllChildsByEdge(this.nodes[id],1)
      let propertyKey = Object.keys(childs).filter((item) => childs[item].nickname == propName)[0]
      let nodeValue = this.getValue(propertyKey)
      // if(isProxy(nodeValue))
      //   return toRaw(nodeValue)
      // else
        return nodeValue}
      
    //let getNode = this.nodes[propertyKey]
    //return getNode.value
  }
  getNodeValues(id, propNameRegex){
      //let graph = this.getGraph
      //let thisComp = graph.nodes[compId]
      let childs = this.getAllChildsByEdge(this.nodes[id],1)
      //console.log("getAllChildsByEdge ",childs)
      let regex = propNameRegex
      let propertyKeys = Object.keys(childs).filter((item) => childs[item].nickname.match(regex)!=null)
      let nodeValues = []
      for (let i = 0; i < propertyKeys.length; ++i) {
        let propertyKey = propertyKeys[i]
        let nodeValue = this.getValue(propertyKey)
        // if(isProxy(nodeValue))
        //   nodeValues.push(toRaw(nodeValue))
        // else
          nodeValues.push(nodeValue)
      }
      return nodeValues
  }
  
  setNodeValue(id, propName, value){
    if (typeof propName === 'string' || propName instanceof String){
      //console.log("1ssetNodeValue!!!!",value)
      let childs = this.getAllChildsByEdge(this.nodes[id],1)
      let propertyKey = Object.keys(childs).filter((item) => childs[item].nickname == propName)[0]

      //console.log("2ssetNodeValue!!!!",value)
      if (propertyKey){
        let saveNode = this.nodes[propertyKey]
        saveNode.value = value

        //let saveValue = null
        //if(isProxy(value))
          //saveValue = toRaw(value)
        //if(propName!="thisInstance")
          store.commit('setValue', saveNode)
      }
    }
  }

  addNodeValue(id, propName, value){
    if (typeof propName === 'string' || propName instanceof String){
      let childs = this.getAllChildsByEdge(this.nodes[id],1)
      let propertyKey = Object.keys(childs).filter((item) => childs[item].nickname == propName)[0]
      let saveNode = this.nodes[propertyKey]
      if(saveNode.value)
        saveNode.value = [...saveNode.value, ...value]
      else
        saveNode.value = [...value]
      store.commit('setValue', saveNode)

    }
  }
  addOrReplaceNodeValue(id, propName, value, key){
    if (typeof propName === 'string' || propName instanceof String){
      let childs = this.getAllChildsByEdge(this.nodes[id],1)
      let propertyKey = Object.keys(childs).filter((item) => childs[item].nickname == propName)[0]
      let saveNode = this.nodes[propertyKey]
      if(saveNode.value){
       
       let newValue = value.filter(function (item) {
        let isExist = saveNode.value.find(o=> o[key] === item[key])
        if(!isExist)
          return  true
        else       
          return false
      })

       let nodeValue  = saveNode.value.map(function (item) {
        let newItem = {...item}
        let isExist = value.find(o=> o[key] === item[key])
        if(isExist)
          newItem = isExist         
        return newItem
     })

        saveNode.value = [...nodeValue, ...newValue]
      }
      else
        saveNode.value = [...value]
      store.commit('setValue', saveNode)

    }
  }
  addVertex(name,nickname,value) {
    let node = new Node(name,nickname,value);
    this.nodes[name]=node
    return node
  }

  removeVertex(name) {
    let vertex = this.nodes[name];
    if (vertex) {
      for (let node in this.nodes) {
        node.removeEdge(vertex);
      }
    }
    return vertex;
  }

  createEdge(startNode, endNode, EdgeType) {
    let startVertex = this.nodes[startNode];
    let endVertex = this.nodes[endNode];
    if (startVertex && endVertex) {
      //startVertex.addEdge(endVertex, EdgeType);
      startVertex.addEdge(endVertex, EdgeType);
      if (!this.directed) {
        endVertex.addEdge(startVertex, EdgeType);
      }
    }else {
      console.log("non-existent vertex passed")
    }
  }
  createDebugEdge(startNode, endNode, EdgeType) {
    let startVertex = this.nodes[startNode];
    let endVertex = this.nodes[endNode];
    if (startVertex && endVertex) {
      //startVertex.addEdge(endVertex, EdgeType);
      startVertex.addDebugEdge(endVertex, EdgeType);
      if (!this.directed) {
        endVertex.addDebugEdge(startVertex, EdgeType);
      }
    }else {
      console.log("non-existent vertex passed")
    }
  }
  findVertexByValue(value){
    for (let key in this.nodes) {
      if(typeof(value)==typeof(this.nodes[key].value))
        if(this.nodes[key].value==value)
          return this.nodes[key]
    }
    return null
  }
  findNodeByNickName(value){
    for (let key in this.nodes) {
      if(typeof(value)==typeof(this.nodes[key].value))
        if(this.nodes[key].nickname==value)
          return this.nodes[key]
    }
    return null
  }
  deleteEdge(startNode, endNode) {
    let startVertex = this.nodes[startNode];
    let endVertex = this.nodes[endNode];

    startVertex.removeEdge(endVertex);
    endVertex.removeEdge(startVertex)
  }

  getVertex(name){
    return this.nodes[name]
  }

  isPresent(name){
    return Object.hasOwn(this.nodes, name)
  }

  vertexCount(){
    return Object.keys(this.nodes).length
  }
  getNextFreeId(){
    let result = 0
    for (let node in this.nodes) {
      if(Number(node)>result){
        result = Number(node)
      }
    }
    return Number(result)+1
  }
  
  getChild(vertex){
    return this.nodes[vertex].edgeList
  }
  getAllChildsByEdge(start, edgeType){
    
    if(!start){return null}
    const queue = [start.name];
    const result = {};
    const visited = {};
    visited[start.name] = true;
    let currentVertex;
    while (queue.length) {
      currentVertex = queue.shift();
      //console.log("currentVertex",currentVertex)
      let edgeList = this.nodes[currentVertex].edgeList
      for (let key of Object.keys(edgeList)) {
        if(edgeList[key]<=edgeType){
          if (!visited[key]) {
            visited[key] = true;
            if(edgeList[key]==edgeType){
              result[key]=this.nodes[key];
            }
            queue.push(key);
          }
        }
      }
    }
    return result
  }
  getValue(name){
    if(!name){return null}
    if(!this.isPresent(name)){return null}
    let start = this.nodes[name]
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
      end = this.nodes[currentVertex]
      let edgeList = this.nodes[currentVertex].edgeList
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
    return end.value
  }
}  
