import store from '@/store'
//import weekeds from '@/utils/holidaysAndWeekends.js'
//import utils from '.'
import utils from '@/utils'
//import notify from "@/notify";
//import appLib from "@/utils";
//import {toRaw} from 'vue';
export default {
  //weekeds,
  GetRequesOptionsTemplate(containerName){
    let requesOptionsTemplate = []
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue(containerName)
      if (rootComp){
          let requestOptions = graph.getNodeValue(rootComp.name,"requestOptions1")
          requesOptionsTemplate = {...requestOptions}
          requesOptionsTemplate.ids = []
          requesOptionsTemplate.useFilterIds = false
          requesOptionsTemplate.condition = null
      }
    return {...requesOptionsTemplate}
  },
  getDifferentByProps(dataSource, name){
    var distinct = []
    if(Array.isArray(dataSource)){
      for (var i = 0; i < dataSource.length; i++)
        if (!distinct.includes(dataSource[i][name]))
          distinct.push(dataSource[i][name])
    }
    return distinct
  },
  async LoadEventByBowlingId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERBowling")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Боулинги"){
        //let QObjectsDataGridEvent = graph.findVertexByValue("QObjectsDataGridEvent")
        let QObjectsDataGridBowling = graph.findVertexByValue("QObjectsDataGridBowling")
        //let QObjectsDataGridEvent = graph.findVertexByValue("QObjectsDataGridEvent")
        //let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
        if (QObjectsDataGridBowling){
          //graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
          //let dataSource = graph.getNodeValue(comp.name,"dataSource")
          let eventRequestOptions = this.GetRequesOptionsTemplate("CONTAINEREvent")
          let participationRequestOptions = this.GetRequesOptionsTemplate("CONTAINERParticipation")
          let selectedRow = graph.getNodeValue(QObjectsDataGridBowling.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          //let filter = graph.getNodeValue(QObjectsDataGridEvent.name,"filter")
          //if(filter != selectedRow.Id){
            //graph.setNodeValue(QObjectsDataGridEvent.name,"dataSource",[])
          //}
          //let addedRows = graph.getNodeValue(tabelObjectComp.name,"addedRows")
          //let deletedRows = graph.getNodeValue(tabelObjectComp.name,"deletedRows")
          //let selectedIsAdded = addedRows.find(o => o.Id == selectedTabel.Id)
          if(typeof selectedRow.Id != "string"){
            participationRequestOptions.condition = "BowlingId == "+selectedRow.Id
            //let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
            await store.dispatch(participationRequestOptions.actionName,participationRequestOptions)
            let participationDataSource =  store.getters[participationRequestOptions.getterName][participationRequestOptions.nameSpace+"."+participationRequestOptions.typeName]//.filter(o=> o.TabelId === selectedTabel.Id)    
            let differentEventIds = this.getDifferentByProps(participationDataSource,"EventId")
            console.log(differentEventIds)
            eventRequestOptions.useFilterIds = true
            eventRequestOptions.idPropTypeName = "System.Int64"
            for(let i = 0; i < differentEventIds.length; i++) {
              let Id = differentEventIds[i]
              eventRequestOptions.ids.push(Id)
            }
            await store.dispatch(eventRequestOptions.actionName, eventRequestOptions)
            //let debugEvent = store.getters[eventRequestOptions.getterName][eventRequestOptions.nameSpace+"."+eventRequestOptions.typeName]
            //console.log("debugEvent",eventRequestOptions.nameSpace)
            //graph.setNodeValue(QObjectsDataGridEvent.name,"dataSource",debugEvent)
          }
          else{
            eventRequestOptions.actionName = "clearStore"
            let fullTypeName = eventRequestOptions.nameSpace+"."+eventRequestOptions.typeName
            store.dispatch(eventRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadEventByOilId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINEROil")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Программа масла"){
        let QObjectsDataGridOil = graph.findVertexByValue("QObjectsDataGridOil")
        if (QObjectsDataGridOil){
          let eventRequestOptions = this.GetRequesOptionsTemplate("CONTAINEREvent")
          let selectedRow = graph.getNodeValue(QObjectsDataGridOil.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            eventRequestOptions.condition = "OilId == "+selectedRow.Id
            await store.dispatch(eventRequestOptions.actionName,eventRequestOptions)
          }
          else{
            eventRequestOptions.actionName = "clearStore"
            let fullTypeName = eventRequestOptions.nameSpace+"."+eventRequestOptions.typeName
            store.dispatch(eventRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadParticipationByEventId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINEREvent")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Турниры"){
        let QObjectsDataGridEvent = graph.findVertexByValue("QObjectsDataGridEvent")
        if (QObjectsDataGridEvent){
          let participationRequestOptions = this.GetRequesOptionsTemplate("CONTAINERParticipation")
          let selectedRow = graph.getNodeValue(QObjectsDataGridEvent.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            participationRequestOptions.condition = "EventId == "+selectedRow.Id
            await store.dispatch(participationRequestOptions.actionName,participationRequestOptions)
          }
          else{
            participationRequestOptions.actionName = "clearStore"
            let fullTypeName = participationRequestOptions.nameSpace+"."+participationRequestOptions.typeName
            store.dispatch(participationRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadTeamMemberByTeamId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERTeam")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Команды"){
        let QObjectsDataGridTeam = graph.findVertexByValue("QObjectsDataGridTeam")
        if (QObjectsDataGridTeam){
          let teamMemberRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTeamMember")
          let selectedRow = graph.getNodeValue(QObjectsDataGridTeam.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            teamMemberRequestOptions.condition = "TeamId == "+selectedRow.Id
            await store.dispatch(teamMemberRequestOptions.actionName,teamMemberRequestOptions)
          }
          else{
            teamMemberRequestOptions.actionName = "clearStore"
            let fullTypeName = teamMemberRequestOptions.nameSpace+"."+teamMemberRequestOptions.typeName
            store.dispatch(teamMemberRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadPlayerByRankId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERRank")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Разряды"){
        let QObjectsDataGridRank = graph.findVertexByValue("QObjectsDataGridRank")
        if (QObjectsDataGridRank){
          let playerRequestOptions = this.GetRequesOptionsTemplate("CONTAINERPlayer")
          let selectedRow = graph.getNodeValue(QObjectsDataGridRank.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            playerRequestOptions.condition = "RankId == "+selectedRow.Id
            await store.dispatch(playerRequestOptions.actionName,playerRequestOptions)
          }
          else{
            playerRequestOptions.actionName = "clearStore"
            let fullTypeName = playerRequestOptions.nameSpace+"."+playerRequestOptions.typeName
            store.dispatch(playerRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },

  async LoadPlayerByCityId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERCity")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Города"){
        let QObjectsDataGridCity = graph.findVertexByValue("QObjectsDataGridCity")
        if (QObjectsDataGridCity){
          let playerRequestOptions = this.GetRequesOptionsTemplate("CONTAINERPlayer")
          let selectedRow = graph.getNodeValue(QObjectsDataGridCity.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            playerRequestOptions.condition = "CityId == "+selectedRow.Id
            await store.dispatch(playerRequestOptions.actionName,playerRequestOptions)
          }
          else{
            playerRequestOptions.actionName = "clearStore"
            let fullTypeName = playerRequestOptions.nameSpace+"."+playerRequestOptions.typeName
            store.dispatch(playerRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  
  async LoadTeamByPlayerId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERPlayer")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Игроки"){
        //let QObjectsDataGridEvent = graph.findVertexByValue("QObjectsDataGridEvent")
        let QObjectsDataGridPlayer = graph.findVertexByValue("QObjectsDataGridPlayer")
        //let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
        if (QObjectsDataGridPlayer){
          //graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
          //let dataSource = graph.getNodeValue(comp.name,"dataSource")
          let teamRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTeam")
          let teamMemberRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTeamMember")
          let selectedRow = graph.getNodeValue(QObjectsDataGridPlayer.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          //let filter = graph.getNodeValue(QObjectsDataGridEvent.name,"filter")
          //if(filter != selectedRow.Id){
            //graph.setNodeValue(QObjectsDataGridEvent.name,"dataSource",[])
          //}
          //let addedRows = graph.getNodeValue(tabelObjectComp.name,"addedRows")
          //let deletedRows = graph.getNodeValue(tabelObjectComp.name,"deletedRows")
          //let selectedIsAdded = addedRows.find(o => o.Id == selectedTabel.Id)
          if(typeof selectedRow.Id != "string"){
            teamMemberRequestOptions.condition = "PlayerId == "+selectedRow.Id
            //let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
            await store.dispatch(teamMemberRequestOptions.actionName,teamMemberRequestOptions)
            let teamMemberDataSource =  store.getters[teamMemberRequestOptions.getterName][teamMemberRequestOptions.nameSpace+"."+teamMemberRequestOptions.typeName]//.filter(o=> o.TabelId === selectedTabel.Id)    
            let differentTeamMemberIds = this.getDifferentByProps(teamMemberDataSource,"TeamId")
            console.log(differentTeamMemberIds)
            teamRequestOptions.useFilterIds = true
            teamRequestOptions.idPropTypeName = "System.Int64"
            for(let i = 0; i < differentTeamMemberIds.length; i++) {
              let Id = differentTeamMemberIds[i]
              teamRequestOptions.ids.push(Id)
            }
            await store.dispatch(teamRequestOptions.actionName, teamRequestOptions)
          }
          else{
            teamRequestOptions.actionName = "clearStore"
            let fullTypeName = teamRequestOptions.nameSpace+"."+teamRequestOptions.typeName
            store.dispatch(teamRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },  
}