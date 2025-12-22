import store from '@/store'
//import weekeds from '@/utils/holidaysAndWeekends.js'
//import utils from '.'
import utils from '@/utils'
import notify from "@/notify";
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
  async LoadTournamentByBowlingId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERBowling")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Боулинги"){
        let QObjectsDataGridBowling = graph.findVertexByValue("QObjectsDataGridBowling")
        if (QObjectsDataGridBowling){
          let tournamentRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTournament")
          let baseTournamentResultRequestOptions = this.GetRequesOptionsTemplate("CONTAINERBaseTournamentResult")
          let selectedRow = graph.getNodeValue(QObjectsDataGridBowling.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            tournamentRequestOptions.condition = "BowlingId == "+selectedRow.Id
            await store.dispatch(baseTournamentResultRequestOptions.actionName,baseTournamentResultRequestOptions)
            let baseTournamentResultDataSource =  store.getters[baseTournamentResultRequestOptions.getterName][baseTournamentResultRequestOptions.nameSpace+"."+baseTournamentResultRequestOptions.typeName]//.filter(o=> o.TabelId === selectedTabel.Id)    
            let differentEventIds = this.getDifferentByProps(baseTournamentResultDataSource,"TournamentId")
            tournamentRequestOptions.useFilterIds = true
            tournamentRequestOptions.idPropTypeName = "System.Int64"
            for(let i = 0; i < differentEventIds.length; i++) {
              let Id = differentEventIds[i]
              tournamentRequestOptions.ids.push(Id)
            }
            await store.dispatch(tournamentRequestOptions.actionName, tournamentRequestOptions)
          }
          else{
            tournamentRequestOptions.actionName = "clearStore"
            let fullTypeName = tournamentRequestOptions.nameSpace+"."+tournamentRequestOptions.typeName
            store.dispatch(tournamentRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadTournamentByOilId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINEROil")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Программа масла"){
        let QObjectsDataGridOil = graph.findVertexByValue("QObjectsDataGridOil")
        if (QObjectsDataGridOil){
          let tournamentRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTournament")
          let selectedRow = graph.getNodeValue(QObjectsDataGridOil.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            tournamentRequestOptions.condition = "OilId == "+selectedRow.Id
            await store.dispatch(tournamentRequestOptions.actionName,tournamentRequestOptions)
          }
          else{
            tournamentRequestOptions.actionName = "clearStore"
            let fullTypeName = tournamentRequestOptions.nameSpace+"."+tournamentRequestOptions.typeName
            store.dispatch(tournamentRequestOptions.actionName,fullTypeName)
          }
        }
      }
    }
  },
  async LoadBaseTournamentResultByTournamentId(){
    let graph = store.getters.getGraph
    let rootComp = graph.findVertexByValue("CONTAINERTournament")
    if (rootComp){
      let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
      if(selectedTabName=="Турниры"){
        let QObjectsDataGridTournament = graph.findVertexByValue("QObjectsDataGridTournament")
        if (QObjectsDataGridTournament){
          let baseTournamentResultRequestOptions = this.GetRequesOptionsTemplate("CONTAINERBaseTournamentResult")
          let selectedRow = graph.getNodeValue(QObjectsDataGridTournament.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            baseTournamentResultRequestOptions.condition = "TournamentId == "+selectedRow.Id
            await store.dispatch(baseTournamentResultRequestOptions.actionName,baseTournamentResultRequestOptions)
          }
          else{
            baseTournamentResultRequestOptions.actionName = "clearStore"
            let fullTypeName = baseTournamentResultRequestOptions.nameSpace+"."+baseTournamentResultRequestOptions.typeName
            store.dispatch(baseTournamentResultRequestOptions.actionName,fullTypeName)
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
  // async LoadPlayerByRankId(){
  //   let graph = store.getters.getGraph
  //   let rootComp = graph.findVertexByValue("CONTAINERRank")
  //   if (rootComp){
  //     let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
  //     if(selectedTabName=="Разряды"){
  //       let QObjectsDataGridRank = graph.findVertexByValue("QObjectsDataGridRank")
  //       if (QObjectsDataGridRank){
  //         let playerRequestOptions = this.GetRequesOptionsTemplate("CONTAINERPlayer")
  //         let selectedRow = graph.getNodeValue(QObjectsDataGridRank.name,"selectedObject")
  //         selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
  //         if(!selectedRow) return
  //         if(typeof selectedRow.Id != "string"){
  //           playerRequestOptions.condition = "RankId == "+selectedRow.Id
  //           await store.dispatch(playerRequestOptions.actionName,playerRequestOptions)
  //         }
  //         else{
  //           playerRequestOptions.actionName = "clearStore"
  //           let fullTypeName = playerRequestOptions.nameSpace+"."+playerRequestOptions.typeName
  //           store.dispatch(playerRequestOptions.actionName,fullTypeName)
  //         }
  //       }
  //     }
  //   }
  // },

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
        let QObjectsDataGridPlayer = graph.findVertexByValue("QObjectsDataGridPlayer")
        if (QObjectsDataGridPlayer){
          let teamRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTeam")
          let teamMemberRequestOptions = this.GetRequesOptionsTemplate("CONTAINERTeamMember")
          let selectedRow = graph.getNodeValue(QObjectsDataGridPlayer.name,"selectedObject")
          selectedRow=utils.isValidObject({selectedRow},"Id","bigint","number","string","guid")
          if(!selectedRow) return
          if(typeof selectedRow.Id != "string"){
            teamMemberRequestOptions.condition = "PlayerId == "+selectedRow.Id
            await store.dispatch(teamMemberRequestOptions.actionName,teamMemberRequestOptions)
            let teamMemberDataSource =  store.getters[teamMemberRequestOptions.getterName][teamMemberRequestOptions.nameSpace+"."+teamMemberRequestOptions.typeName]//.filter(o=> o.TabelId === selectedTabel.Id)    
            let differentTeamMemberIds = this.getDifferentByProps(teamMemberDataSource,"TeamId")
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
  async getReport(){
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("CONTAINEREvent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Турниры"){
            let selectedId = null
            let QDataGrid = graph.findVertexByValue("QObjectsDataGridEvent")
            if(QDataGrid){
              let selectedItem = graph.getNodeValue(QDataGrid.name,"selectedObject")
              let matchValue = utils.isValidObject({selectedItem},"Id","bigint","number")
              if(matchValue){
                selectedId = matchValue.Id
                let actionName = "loadFilesReport"
                let fileName = matchValue.Title
                if(!fileName || fileName==""){
                  fileName = "Report.pdf"
                }else{
                  let ext = fileName.match(/\.[0-9a-z]+$/i)
                  if (ext){
                    if(ext[0]){
                      if(ext[0].toLowerCase()!=".pdf"){
                        fileName = fileName.replace(ext, ".xlsx");
                      }
                    }
                  }else{
                    fileName = fileName+".pdf"
                  }
                }
                console.log("selectedId = ",selectedId)
                await store.dispatch(actionName,{Id:selectedId,fileName})
              }
              else{
                notify.defaultError("Сначала сохраните табель в базу!")
                return
              }
            }
          }
        }
      }, 
      disableButtons(compName){
            let result = false
            let graph = store.getters.getGraph
            let QObjectsDataGridTournament = graph.findVertexByValue("QObjectsDataGridTournament")
            
            
            let isRowNotSelected
            
            switch (compName) {
              
              case "getReport": //Скачать отчет в pdf
                  isRowNotSelected = graph.getNodeValue(QObjectsDataGridTournament.name,"isRowNotSelected");
                  console.log("getReport, isRowNotSelected = ", isRowNotSelected)
                  if(isRowNotSelected()){
                    result = true
                  }
                  break;
              case "editSave":
                  
                  break;
              default:
                
            }
            return result
          },
}