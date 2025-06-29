

export class Node {
  constructor(name,nickname, value) {
    (this.name = name),
    (this.nickname = nickname),
    (this.value = value),
    (this.edgeList = {}),
    (this.debugEdgeList = {})
  }
  addEdge(node, EdgeType) {
    this.edgeList[node.name]=EdgeType ? EdgeType : "0";
  }
  addDebugEdge(node, EdgeType) {
    this.debugEdgeList[node.name]=EdgeType ? EdgeType : "0";
  }

  removeEdge(node) {
    delete this.edgeList[node];
  }
}  
