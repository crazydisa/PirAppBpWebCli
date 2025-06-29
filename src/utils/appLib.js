import store from '@/store'
import weekeds from '@/utils/holidaysAndWeekends.js'
//import utils from '.'
import utils from '@/utils'
import notify from "@/notify";
//import appLib from "@/utils";
//import {toRaw} from 'vue';
export default {
  weekeds,
    //requesOptionsTemplate:  null,
    GetRequesOptionsTemplate(){
      let requesOptionsTemplate = []
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
            let requestOptions = graph.getNodeValue(rootComp.name,"requestOptions1")
            requesOptionsTemplate = {...requestOptions}
            requesOptionsTemplate.ids = []
            requesOptionsTemplate.useFilterIds = false
            requesOptionsTemplate.condition = null
        }
      return {...requesOptionsTemplate}
    },
    async loadpageProjectContent(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("complectContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Коплекты"||selectedTabName=="Документы"){
          let mainTreeView = graph.findVertexByValue("mainTreeView")
          if (mainTreeView){
            let selectedObject = graph.getNodeValue(mainTreeView.name,"selectedObject")
            if(utils.isValidObject({selectedObject},"Type","string")){
              if(selectedObject.Type=="Complect")
              {
                graph.setNodeValue(mainTreeView.name,"objectType",store.getters["getObjectTypes"].find(o => o.Name == "Document"))
                const actionName = "loadDocuments"      //загрузка документов по id комплекта
                await store.dispatch(actionName, selectedObject.Id);
              }
              else
              {
                graph.setNodeValue(mainTreeView.name,"objectType",store.getters["getObjectTypes"].find(o => o.Name == "Complect"))
                const actionName = "loadComplects"
                await store.dispatch(actionName, selectedObject);
              }
            }
          }
        }
      }
    },
   
    dateRule(props){
      //let result = [false]
      
      let date = props.row[props.col.name]
      if(!date){return true}
      let startPeriod = props.row["startPeriod"]
      let endPeriod = props.row["endPeriod"]
      if(!startPeriod || !endPeriod){return true}
      if(props.col.name == "startPeriod" || props.col.name == "endPeriod"){
        let startPerDate = window.dt.parse(props.row["startPeriod"])
        let endPerDate = window.dt.parse(props.row["endPeriod"])
        if(startPerDate.getTime() > endPerDate.getTime()){
          return true
        }
      }
     
      let graph = store.getters.getGraph
      let beginDateComp = graph.findVertexByValue("beginDate")
      let endDateComp = graph.findVertexByValue("endDate")
      if (beginDateComp && endDateComp){
        let beginDate = graph.getNodeValue(beginDateComp.name,"selected")
        let endDate = graph.getNodeValue(endDateComp.name,"selected")
        if(!(beginDate instanceof Date)  || !(endDate instanceof Date) ){notify.defaultError("Не удалось получить общий период!"); return}     
        beginDate.setHours(0,0,0,0)
        endDate.setHours(0,0,0,0)
        let beginDateWithoutTime = beginDate
        let endDateWithoutTime = endDate
        let checkedDateAsDate = window.dt.parse(date)
        if(beginDateWithoutTime && endDateWithoutTime && checkedDateAsDate){
          checkedDateAsDate.setHours(0,0,0,0)
          let checkedDateWithoutTime = checkedDateAsDate
          let curTime = checkedDateWithoutTime.getTime()
          let endTime = endDateWithoutTime.getTime()
          let startTime = beginDateWithoutTime.getTime()
          if(startTime<=curTime && curTime<=endTime){
            return false
          }
          else{
            return true
          }
        }
      }
      return false
    },
    assignedRule(props){
      let result = true
      let assigned = props.row[ "assigned" ]
      let remains = props.row[ "remains" ]
      if(typeof assigned == "number" && typeof remains == "number"){
        if(assigned>0){
          if(assigned<=remains){
            result = false
          }
        }
      }
      return result
    },

    ruleAsPositiveNumber(props){
      let result = false
      let val = props.row[ props.col.name ]
      if(typeof val == "number"){
        if(val<=0){
          result = true
        }
      }
      else{result = true}
      
       
      return result
    },
    ruleAsPositiveNumberWithRange(props){
      let result = false
      
      let val = props.row[ props.col.name ]
      if(typeof val == "number"){
        if(val<=0 || val>8){
          result = true
        }
      }
      else{result = true}
       
      return result
    },

    ruleAsPositiveNumberIfSelected(props){
      
      let result = false
      let graph = store.getters.getGraph
      let ListBox1 = graph.findVertexByValue("ListBox1")
      if(ListBox1){
        let selectedObject = graph.getNodeValue(ListBox1.name,"selectedObject")
        if(selectedObject){
          let isRowSelected = selectedObject.find(o => o.Id == props.row.Id)
          if(isRowSelected){
            let val = props.row[ props.col.name ]
            if(typeof val == "number"){
              if(val<=0){
                result = true
              }
            }
            else{result = true}
          }
        }
      }
      
      return result
    },
    ruleAsPositiveNumberWithRangeIfSelected(props){
      let result = false
      let graph = store.getters.getGraph
      let ListBox1 = graph.findVertexByValue("ListBox1")
      if(ListBox1){
        let selectedObject = graph.getNodeValue(ListBox1.name,"selectedObject")
        if(selectedObject){
          let isRowSelected = selectedObject.find(o => o.Id == props.row.Id)
          if(isRowSelected){
            let val = props.row[ props.col.name ]
            if(typeof val == "number"){
              if(val<=0 || val>8){
                result = true
              }
            }
            else{result = true}
          }
        }
      }
      return result
    },


    endDateRule(date){
      if(!date){return true}
      else {return false}
    },
    beginDateRule(date){
      if(!date){return true}
      let graph = store.getters.getGraph
      let endDateComp = graph.findVertexByValue("endDate")
      if (endDateComp){
        let endDate = graph.getNodeValue(endDateComp.name,"selected")
        if(!endDate){return false}
        endDate.setHours(0,0,0,0)
        let endDateWithoutTime = endDate
        let checkedDateAsDate = window.dt.parse(date)
        if(endDateWithoutTime && checkedDateAsDate){
          checkedDateAsDate.setHours(0,0,0,0)
          let checkedDateWithoutTime = checkedDateAsDate
          let curTime = checkedDateWithoutTime.getTime()
          let endTime = endDateWithoutTime.getTime()
          if(curTime<=endTime){
            return false
          }
          else{
            return true
          }
        }
      }
      return true
    },
   
    async getErrorRecords(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Очистка от неиспользуемых данных"){
          let requestOptions = this.GetRequesOptionsTemplate()
          requestOptions.typeName = "Tabel"
          requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
          requestOptions.condition = 'DeletedAt != null'
          requestOptions.ids.length = 0
          const fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
          await store.dispatch(requestOptions.actionName, requestOptions)
          let tabels = store.getters[requestOptions.getterName][fullTypeName]

          requestOptions.typeName = "CardClock"
          
          requestOptions.idPropName = "TabelId"
          requestOptions.idPropTypeName = "System.Int64"
          requestOptions.useFilterIds = true
          //fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
          
          for(let i = 0; i < tabels.length; i++) {
            let Id = tabels[i].Id
            requestOptions.ids.push(Id)
          }
          requestOptions.condition = ""
          //requestOptions.condition = "Date >= \""+startData+"\" && Date <= \""+endData+"\""
          await store.dispatch(requestOptions.actionName, requestOptions)
        }
      }
    },
    // async getErrorRecords(){
    //   let graph = store.getters.getGraph
    //   let rootComp = graph.findVertexByValue("laborCostContent")
    //   if (rootComp){
    //     let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
    //     if(selectedTabName=="Для отладки"){
    //       let cardClocksWithoutTabel = graph.findVertexByValue("cardClocksWithoutTabel")
    //       if(cardClocksWithoutTabel){
            
    //       }
    //     }
    //   }
    // },

    async addRecordButton(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let addRecordButton = graph.findVertexByValue("addRecordButton")
          let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
          let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
          if (utils.isValidObject({cardClockObjectComp}) && utils.isValidObject({tabelObjectComp})){
            let deletedData
            let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
            let cardClockDataSource = graph.getNodeValue(cardClockObjectComp.name,"dataSource")
            //let addedRows = graph.getNodeValue(tabelObjectComp.name,"addedRows")
            let deletedRows = graph.getNodeValue(tabelObjectComp.name,"deletedRows")
            //let deletedRowsCardClock = graph.getNodeValue(cardClockObjectComp.name,"deletedRows")
            selectedTabel=utils.isValidObject({selectedTabel})
            if(selectedTabel)
            {
              if(cardClockDataSource && cardClockDataSource.length>0){

              
                if(addRecordButton){
                  graph.setNodeValue(addRecordButton.name,"progress",{ loading: true, percentage: 5 })
                }
                let startPeriod = selectedTabel.startPeriod
                let endPeriod = selectedTabel.endPeriod
                let requestOptions = this.GetRequesOptionsTemplate()
                requestOptions.typeName = "CardClock"
                requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
                let origCardClockDataSource =  store.getters[requestOptions.getterName][requestOptions.nameSpace+"."+requestOptions.typeName].filter(o=> o.TabelId === selectedTabel.Id)
                
                let differentEmployeeIds = this.getDifferentEmployeeIds(origCardClockDataSource)
                let serverCardClockData = await this.getCurrentCardClockData(differentEmployeeIds,startPeriod,endPeriod)
                
                //----------------------Копия с сервера и клиента-------------------------------
                if(!serverCardClockData) {serverCardClockData = []}
                serverCardClockData = serverCardClockData.map(function (item) {
                  let newItem = {...item}
                  return newItem
                })
                let clientDataSource = cardClockDataSource.map(function (item) {
                  let newItem = {...item}
                  return newItem
                })
                //------------------------------------------------------------------------------

                //----------------------Серверные данные для этого табеля-----------------------
                let oldTableData = serverCardClockData.filter(o => o.TabelId === selectedTabel.Id)
                if(!oldTableData) {oldTableData = []}
                //------------------------------------------------------------------------------

                //--------------------Сворачиваем серверные данные------------------------------
                let collapseOldTabelData = []
                oldTableData.reduce(function(res, value) {
                  let valueDate
                  if(value.Date instanceof Date) {valueDate = value.Date.getTime()}
                  else {let strAsDate = window.dt.parse(value.Date); valueDate = strAsDate.getTime()}
                  if (!res[value.EmployeeId]) {
                    res[value.EmployeeId] = { [valueDate]: {EmployeeId: value.EmployeeId, Date: valueDate, Watch: 0 }};
                    collapseOldTabelData.push(res[value.EmployeeId][valueDate])
                  }
                  else if (!res[value.EmployeeId][valueDate]) {
                    res[value.EmployeeId][valueDate] = {EmployeeId: value.EmployeeId, Date: valueDate, Watch: 0 }
                    collapseOldTabelData.push(res[value.EmployeeId][valueDate])
                  }
                  res[value.EmployeeId][valueDate].Watch += value.Watch;
                  return res;
                }, {});
                //------------------------------------------------------------------------------

                //---------------------Для совпадающих данных оставляем новые часы---------------------
                clientDataSource = clientDataSource.map(function (item) {
                  let newItem = {...item}
                  let newItemWatch = newItem.Watch
                  let serverItem = collapseOldTabelData.find( o => window.dt.parse(newItem.Date).getTime() == o.Date && o.EmployeeId == item.EmployeeId)
                  if(serverItem){
                    newItem = {...serverItem}
                    newItem.Date = window.dt.parse(serverItem.Date)
                    newItem.Watch = newItemWatch}
                  return newItem})
                //-----------------------------------------------------------------------------

                //------------Данные с сервера помечаем на удаление---------
                deletedData = oldTableData.map((o) =>{let del = {...o}; del.DeletedAt = new Date(); return del})
                if(!deletedData) {deletedData = []}
                //-----------------------------------------------------------------------------
                
                //------------Исключаем из данных сервера все старые данные для этого табеля---
                serverCardClockData = serverCardClockData.filter(o => o.TabelId != selectedTabel.Id)
                if(!serverCardClockData) {serverCardClockData =[]}
                //-----------------------------------------------------------------------------

                //-----------Свертываем серверные данные из других табелей по сотруднику и дате------------------
                let colapseServerData = [];
                serverCardClockData.reduce(function(res, value) {
                  let valueDate
                  if(value.Date instanceof Date) {valueDate = value.Date.getTime()}
                  else {let strAsDate = window.dt.parse(value.Date); valueDate = strAsDate.getTime()}
                  if (!res[value.EmployeeId]) {
                    res[value.EmployeeId] = { EmployeeId: value.EmployeeId, Id: value.Id, Date: {[valueDate]: 0 }, TabelId: value.TabelId};
                    colapseServerData.push(res[value.EmployeeId])}
                  else if(!res[value.EmployeeId].Date[valueDate]){res[value.EmployeeId].Date[valueDate]=0}
                  res[value.EmployeeId].Date[valueDate] += value.Watch;
                  return res}, {});
                //-----------------------------------------------------------------------------
                
                //-----------Свертываем данные с клиента по сотруднику и дате------------------
                var colapseClientData = [];
                clientDataSource.reduce(function(res, value) {
                  let valueDate
                  if(value.Date instanceof Date) {valueDate = value.Date.getTime()}
                  else {
                    let strAsDate = window.dt.parse(value.Date); valueDate = strAsDate.getTime()}
                  if (!res[value.EmployeeId]) {
                    res[value.EmployeeId] = { EmployeeId: value.EmployeeId, Id: value.Id, Date: {[valueDate]: 0 }};
                    colapseClientData.push(res[value.EmployeeId])}
                  else if(!res[value.EmployeeId].Date[valueDate]){res[value.EmployeeId].Date[valueDate]=0}
                  res[value.EmployeeId].Date[valueDate] += value.Watch;
                  return res}, {});
                //------------------------------------------------------------------------------
              console.log("colapseServerData = ", colapseServerData)
              
                //-------Проверка на условие не превышения часов в день для сотрудника----------
                let errors = []
                for(let i = 0;i<colapseClientData.length;i++){
                  let clientData = colapseClientData[i]
                  let clientDates = clientData.Date
                  let serverData = colapseServerData.find(o => o.EmployeeId == clientData.EmployeeId)
                  if(!serverData){serverData = {Date: {}}}
                  let serverDates = serverData.Date
                  for (let key of Object.keys(clientDates)) {
                    let clientDate = clientDates[key]
                    if(key < startPeriod.getTime() || key > endPeriod.getTime()){
                      let d =new Date(Number(key))
                      let error = "Назначенные часы на дату " + d.toString() + " нарушают границы периода табеля! Начало периода "+ startPeriod;
                      errors.push(error)
                      continue
                    }
                    let serverDate = serverDates[key]
                    if(!serverDate){serverDate=0}
                    let freeHours = this.GetFreeHours(key, serverDate)
                    let userName = this.getUserNameById(serverData.EmployeeId)
                    let tabelName = this.getTabelNameById(serverData.TabelId)
                    if(freeHours<0){
                      let d =new Date(Number(key))
                      
                      
                      //requestOptions.condition = 'DeletedAt != null'
                      //requestOptions.ids.length = 0
                      //await store.dispatch(requestOptions.actionName, requestOptions)
                      

                      let error = "Ошибка в базе!! На дату "+ d.toString() + " уже сохранено "  +serverDate + " часов" + " - Табель: " + tabelName + ", ФИО: " + userName
                      errors.push(error)
                      continue
                    }
                    if(freeHours<clientDate){
                      let d =new Date(Number(key))
                      let error = d.toString() + " свободно - "+ freeHours +", назначено - "+clientDate
                      errors.push(error)
                    }
                    
                  }
                  
                }
                if(errors.length>0){
                  let message =""
                  for(let i = 0; i<errors.length;i++){
                    message = message + errors[i]+"\n"
                  }
                  notify.defaultError(message)
                  if(addRecordButton){
                    graph.setNodeValue(addRecordButton.name,"progress",{ loading: false, percentage: 0 })
                  }
                  return
                }

                let OneObject = {...selectedTabel}
                let OneTypeName = "Tabel"
                let actionName = "setOne2MAnyObjects"
                let ManyTypeName ="CardClock"
                let selectedTabelId = selectedTabel.Id
                if( typeof selectedTabelId === "string"){
                  OneObject.Id=0
                }
                let ManyObject = []

                for(let i = 0; i < clientDataSource.length; i++) {
                  let cardClockRow = cardClockDataSource[i]
                  if(typeof cardClockRow.Id === "string"){
                    cardClockRow.Id=0
                  }
                  ManyObject.push({...cardClockRow})
                }
                //------Добавляем старые удаляемые данные если строка с таким id еще не включалась в набор------------------------
                for(let i = 0; i < deletedData.length; i++) {
                  let id = ManyObject.find(o => o.Id === deletedData[i].Id)
                  if(!id){
                    ManyObject.push({...deletedData[i]})
                  }
                  
                }
                //---------------------------------------------------------------
                if(addRecordButton){
                  graph.setNodeValue(addRecordButton.name,"progress",{ loading: true, percentage: 50 })
                }
                await store.dispatch(actionName, {OneTypeName: OneTypeName, ManyTypeName: ManyTypeName, OneObject:OneObject,ManyObject:ManyObject })
                if(addRecordButton){
                  graph.setNodeValue(addRecordButton.name,"progress",{ loading: false, percentage: 0 })
                }
                //graph.setNodeValue(tabelObjectComp.name,"selectedObject",[])
              }
            
              
            }
            if(deletedRows.length>0){

              let deletedRowsToSave  = deletedRows.filter(o => typeof o.Id != "string")
              for(let i=0; i<deletedRowsToSave.length; i++){
                let delRow = deletedRowsToSave[i]
                let OneObject = {...delRow}
                let OneTypeName = "Tabel"
                let actionName = "setOne2MAnyObjects"
                let ManyTypeName ="CardClock"
                let ManyObject = []
                await store.dispatch(actionName, {OneTypeName: OneTypeName, ManyTypeName: ManyTypeName, OneObject:OneObject,ManyObject:ManyObject })
                if(addRecordButton){
                  graph.setNodeValue(addRecordButton.name,"progress",{ loading: true, percentage: 100/deletedRowsToSave.length*(i+1) })
                }
              }
              if(addRecordButton){
                graph.setNodeValue(addRecordButton.name,"progress",{ loading: false, percentage: 0 })
              }
            }
          }
        }
      }
    },
    getUserNameById(EmployeeId){
      let requestOptions = this.GetRequesOptionsTemplate()
      requestOptions.typeName = "User"
      requestOptions.nameSpace = "SapsanLib.Models"
      let userName =""
      let users = store.getters[requestOptions.getterName][requestOptions.nameSpace+"."+requestOptions.typeName]
      if(users){
        let user = users.find(o=> o.Id == EmployeeId)
        if(user){
          userName = user.Surname
        }
      }
      return userName
    },
    getTabelNameById(TabelId){
      let requestOptions = this.GetRequesOptionsTemplate()
      requestOptions.typeName = "Tabel"
      requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
      //requestOptions.condition = 'DeletedAt != null'
      //requestOptions.ids.length = 0
      //await store.dispatch(requestOptions.actionName, requestOptions)
      let tabels = store.getters[requestOptions.getterName][requestOptions.nameSpace+"."+requestOptions.typeName]
      let tabelName = ""
      if(tabels){
        let tabel = tabels.find(o=> o.Id == TabelId)
        if(tabel){
          tabelName = tabel.Title
        }
      }
      return tabelName;
    },
    async getCurrentCardClockData(employees, startPeriod, endPeriod){
      let requestOptions = this.GetRequesOptionsTemplate()
      startPeriod = window.dt.parse(startPeriod)
      endPeriod = window.dt.parse(endPeriod)
      requestOptions.typeName = "CardClock"
      requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
      requestOptions.idPropName = "EmployeeId"
      requestOptions.idPropTypeName = "System.Guid"
      requestOptions.useFilterIds = true
      const fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
      let startData = utils.prepareDate(startPeriod)
      let endData = utils.prepareDate(endPeriod)
      for(let i = 0; i < employees.length; i++) {
        let Id = employees[i]
        requestOptions.ids.push(Id)
      }
      requestOptions.condition = "Date >= \""+startData+"\" && Date <= \""+endData+"\""
      await store.dispatch(requestOptions.actionName, requestOptions)
      let epmp = store.getters[requestOptions.getterName][fullTypeName]
      return epmp
    },
    getDifferentEmployeeIds(dataSource){
      var distinct = []
      if(Array.isArray(dataSource)){
        for (var i = 0; i < dataSource.length; i++)
          if (!distinct.includes(dataSource[i].EmployeeId))
            distinct.push(dataSource[i].EmployeeId)
      }
      return distinct
    },
    
    async LoadUsers(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let requestOptions = this.GetRequesOptionsTemplate()
          requestOptions.typeName = "User"
          requestOptions.nameSpace = "SapsanLib.Models"
          await store.dispatch(requestOptions.actionName,requestOptions)
          
        }
      }
    },
    
    
    traceMethodCalls(obj) {
      let handler = {
          get(target, propKey) {
              const origMethod = target[propKey];
              return function (...args) {
                  let result = origMethod.apply(this, args);
                  console.log(propKey + JSON.stringify(args)
                      + ' -> ' + JSON.stringify(result));
                  return result;
              };
          }
      };
      return new Proxy(obj, handler);
  },
    async getReport(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let tabelId = null
          let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
          if(tabelObjectComp){
            let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
            let matchValue = utils.isValidObject({selectedTabel},"Id","bigint","number")
            if(matchValue){
              tabelId = matchValue.Id
              let actionName = "loadFilesReport"
              let fileName = matchValue.Title
              if(!fileName || fileName==""){
                fileName = "Report.xlsx"
              }else{
                let ext = fileName.match(/\.[0-9a-z]+$/i)
                if (ext){
                  if(ext[0]){
                    if(ext[0].toLowerCase()!=".xlsx"){
                      fileName = fileName.replace(ext, ".xlsx");
                    }
                  }
                }else{
                  fileName = fileName+".xlsx"
                }
              }
              
              await store.dispatch(actionName,{tabelId,fileName})
            }
            else{
              notify.defaultError("Сначала сохраните табель в базу!")
              return
            }
          }
        }
      }
    },

    async LoadCardClockByTabelId(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
          let cardClockComp = graph.findVertexByValue("cardClockComp")
          //let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
          if (tabelObjectComp){
            //graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
            //let dataSource = graph.getNodeValue(comp.name,"dataSource")
            let requestOptions = this.GetRequesOptionsTemplate()
            let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
            selectedTabel=utils.isValidObject({selectedTabel},"Id","bigint","number","string","guid")
            if(!selectedTabel) return
            let shownTabelId = graph.getNodeValue(cardClockComp.name,"shownTabelId")
            if(shownTabelId != selectedTabel.Id){
              graph.setNodeValue(cardClockComp.name,"dataSource",[])
            }
            //let addedRows = graph.getNodeValue(tabelObjectComp.name,"addedRows")
            //let deletedRows = graph.getNodeValue(tabelObjectComp.name,"deletedRows")
            //let selectedIsAdded = addedRows.find(o => o.Id == selectedTabel.Id)
            if(typeof selectedTabel.Id != "string"){
              
              requestOptions.typeName = "CardClock"
              requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
              requestOptions.condition = "TabelId == "+selectedTabel.Id
              //let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
              await store.dispatch(requestOptions.actionName,requestOptions)
            }
            else{
              requestOptions.typeName = "CardClock"
              requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
              requestOptions.actionName = "clearStore"
              let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
              store.dispatch(requestOptions.actionName,fullTypeName)
            }
          }
        }
      }
    },

    async visualizeTabel(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let cardClockComp = graph.findVertexByValue("cardClockComp")
          graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Редактировать", 
            enable: true, disable: this.disableButtons,
            progress: { loading: false, percentage: 0 },
            buttonClick: this.CommandButtons.bind(this)}])
          if (cardClockComp){
            let columns = [] //= graph.getNodeValue(cardClockComp.name,"columns")
            let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
            let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
           
            if (tabelObjectComp && cardClockObjectComp){
              let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
              selectedTabel = utils.isValidObject({selectedTabel},"startPeriod","date","string")
              if(!selectedTabel){return}
              let dataSource = graph.getNodeValue(cardClockObjectComp.name,"dataSource")
              if(!dataSource) return
              if(dataSource.length==0) return
              graph.setNodeValue(cardClockComp.name,"shownTabelId",selectedTabel.Id)
              var ids = []
              for(let i = 0; i<dataSource.length; i++){
                ids.push(dataSource[i].Id)
              }
              graph.setNodeValue(cardClockComp.name,"cardClockIds",ids)
              //let differentEmployeeIds = this.getDifferentEmployeeIds(dataSource)
              let startPeriod = selectedTabel.startPeriod
              let endPeriod = selectedTabel.endPeriod
              let startPeriodAsDate = window.dt.parse(startPeriod)
              let endPeriodAsDate = window.dt.parse(endPeriod)
              if(!(startPeriodAsDate instanceof Date)  || !(endPeriodAsDate instanceof Date) ){notify.defaultError("Не удалось получить общий период из табеля!"); return}
              startPeriodAsDate.setHours(0,0,0,0)
              endPeriodAsDate.setHours(0,0,0,0)
              let calendarPeriod = this.GetCalendarPeriod(startPeriodAsDate, endPeriodAsDate)
              let requestOptions = this.GetRequesOptionsTemplate()
              requestOptions.typeName = "User"
              requestOptions.nameSpace = "SapsanLib.Models"
              //requestOptions.idPropName = "Id"
              //requestOptions.idPropTypeName = "System.Guid"
              //requestOptions.useFilterIds = true
              //for(let i = 0; i < differentEmployeeIds.length; i++) {
              //  let Id = differentEmployeeIds[i]
              //   requestOptions.ids.push(Id)
              //}
              let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
              //await store.dispatch(requestOptions.actionName, requestOptions)
              let userSpr = store.getters[requestOptions.getterName][fullTypeName]
              let fioCol = {dataField: "Surname", dataType: "string", allowEditing: true,
                name: "Surname", label: "ФИО сотрудника  ", field: "Surname", required: false, nested:3,
                append: function(props){
                  let summ=0
                  for (let key of Object.keys(props.row)){
                    let rawDate = key.match(/(^[A-Za-z]{4}-)(\d{4})-(\d{1,2})-(\d{1,2})$/)
                    if(!rawDate){continue}
                    if(rawDate.length==5){
                      summ = summ + parseFloat(props.row[key])
                    }
                  }
                  return summ
                }
              }
                //['auto-width']: true}
              columns.push(fioCol)
              let y =1
              let yearCols = []
              let tempMonth
              let h1 =""
              let h2 =""
              for(let m =0;m<calendarPeriod.length;m++){
                let yearCol = {name: "", label: "", cols:[], }
                let year = calendarPeriod[m][0]
                let monthCol = {name: "", label: "", cols:[], nested:2}
                if(y!=year){
                  y = year
                  yearCol.name = year
                  yearCol.label = year
                  yearCol.cols.push(monthCol)
                  yearCols.push(yearCol)
                  tempMonth = yearCol
                  h1 = y
                }
                else{
                  yearCol = tempMonth
                  yearCol.cols.push(monthCol)
                }
                let month = calendarPeriod[m][1]
               
 
                monthCol.name = month
                monthCol.label = month
                h2 = month
                //columns.push(monthCol)
                let startDay = calendarPeriod[m][2]
                let endDay = calendarPeriod[m][3]
                for(let d =startDay;d<=endDay;d++){
                  //let date = (new Date(year,month,d)).getTime()
                 
                  let fieldName = "date"+"-"+year+"-"+month+"-"+d
                  let dayCol = {dataField: fieldName, dataType: "number", allowEditing: true,
                    name: fieldName, label: d, field: fieldName, nested:3, h1:h1, h2:h2,
                    onUpdate: function(props) {
                      let origVal =props.row[ props.col.name+"-orig" ]
                      if(origVal == null || isNaN(origVal) || origVal<0 || typeof origVal != "number"){
                        origVal = props.row[ props.col.name+"-orig" ] = 0
                      }

                      let newVal = props.row[ props.col.name ]
                      if(newVal == null || isNaN(newVal) || newVal<0 || typeof newVal != "number"){
                        newVal = props.row[ props.col.name ] = props.row[ props.col.name+"-orig" ]
                      }
                      let hint = props.row[ props.col.name+"-hint"]
                      if(hint == null || isNaN(hint) || hint<0 || typeof hint != "number"){
                        hint = props.row[ props.col.name+"-hint"] = 0
                      }
                      props.row[ props.col.name+"-hint"] = hint+newVal-origVal
                      props.row[ props.col.name+"-orig" ] = props.row[ props.col.name ]
                      
                    },

                    rule: function(props){
                      let max = 8
                      let colName = props.col.name
                      let rawDate = colName.match(/(^[A-Za-z]{4}-)(\d{4})-(\d{1,2})-(\d{1,2})/)
                      if(!rawDate){return false}
                      if(rawDate.length==5){
                        let year = rawDate[2]
                        let month = rawDate[3]
                        let day = rawDate[4]
                        let date = new Date(year,month-1,day)
                        let dayNum = date.getDay()
                        let isFriday = dayNum==5?true:false
                        if(isFriday){max = 7}
                        let isWeekend = dayNum == 6 || dayNum==0?true:false
                        if(isWeekend){max = 0}
                        if(props.row[ colName]>max || props.row[colName+"-hint"]>max){
                          return true
                        }
                        else{
                          return false
                        }
                      }
                    }}

                  monthCol.cols.push(dayCol)
                  if(h1!="")
                    h1=""
                  if(h2!="")
                    h2=""
                  
                  columns.push(dayCol)
                }
              }
              let invertedDataSource =[]
              const queue = [...dataSource]
              const visited = {};
              while (queue.length){
                let currentEmployee = queue.shift()
                if (!visited[currentEmployee.EmployeeId]) {
                  let allDataCurEmp = dataSource.filter(o => o.EmployeeId == currentEmployee.EmployeeId)
                  let collapseallDataCurEmp = []
                  allDataCurEmp.reduce(function(res, value) {
                    let valueDate
                    if(value.Date instanceof Date) {valueDate = value.Date.getTime()}
                    else {let strAsDate = window.dt.parse(value.Date); valueDate = strAsDate.getTime()}
                    if (!res[value.EmployeeId]) {
                      res[value.EmployeeId] = { [valueDate]: {EmployeeId: value.EmployeeId, Date: valueDate, Watch: 0 }};
                      collapseallDataCurEmp.push(res[value.EmployeeId][valueDate])
                    }
                    else if (!res[value.EmployeeId][valueDate]) {
                      res[value.EmployeeId][valueDate] = {EmployeeId: value.EmployeeId, Date: valueDate, Watch: 0 }
                      collapseallDataCurEmp.push(res[value.EmployeeId][valueDate])
                    }
                    res[value.EmployeeId][valueDate].Watch += value.Watch;
                    return res;
                  }, {});
                  visited[currentEmployee.EmployeeId] = true
                  
                  let invertedRow = {}
                  // for(let i = 0; i < columns.length;i++){
                  //   invertedRow[columns[i].field] = 0
                  // }
                  let curUser = "ФИО не найдено"
                  let impId
                  //let fio
                  if(userSpr){
                    curUser = userSpr.find(o => o.Id == currentEmployee.EmployeeId)
                    if(curUser){
                      impId = curUser.Id
                      curUser = curUser.Surname
                    }
                  }
                  invertedRow.Surname = curUser
                  invertedRow["Surname-hint"] = "Всего назначено на дату"
                  if(currentEmployee.isNewRow){
                    invertedRow.isNewRow = true
                  }
                  invertedRow.EmployeeId = impId
                  console.log("collapseallDataCurEmp = ",collapseallDataCurEmp)
                  for(let i =0;i<collapseallDataCurEmp.length;i++){
                    let empData = collapseallDataCurEmp[i]
                    let date = window.dt.parse(empData.Date)
                    let Year = date.getFullYear()
                    let Month = date.getMonth() + 1
                    let Day = date.getDate()
                    let fieldName = "date"+"-"+Year+"-"+Month+"-"+Day
                    invertedRow[fieldName] = parseFloat(empData.Watch)
                    invertedRow[fieldName+"-orig"] = invertedRow[fieldName]
                    //invertedRow.Id = this.uuidv4()
                  }
                  invertedDataSource.push(invertedRow)
                }
              }

             
              //let mainTreeView = graph.findVertexByValue("mainTreeView")
              //let selectedTreeData = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
             
              graph.setNodeValue(cardClockComp.name,"columns",columns)
              //graph.setNodeValue(cardClockComp.name,"visibleColumns",['first'])
              graph.setNodeValue(cardClockComp.name,"dataSource",invertedDataSource)
             
              //graph.setNodeValue(comp.name,"dataSource",dataSource)
            }
          }
        }
      }
    },
    
    async CommandButtons(buttonName){
      let graph = store.getters.getGraph
      let cardClockComp = graph.findVertexByValue("cardClockComp")
      let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
      let getReport = graph.findVertexByValue("getReport")
      let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
      let showcardClock = graph.findVertexByValue("showcardClock")
      let cancelTabel = graph.findVertexByValue("cancelTabel")
      let addRecordButton = graph.findVertexByValue("addRecordButton") 
      let result 
      switch (buttonName) {
        case "Редактировать":
          result = await this.changeTabel(cardClockComp,tabelObjectComp,cardClockObjectComp)
          if(result){
            graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Сохранить", 
              enable: true, disable: this.disableButtons,
              progress: { loading: false, percentage: 0 },
              buttonClick: this.CommandButtons.bind(this)}])
            if(tabelObjectComp){
              graph.setNodeValue(tabelObjectComp.name,"selection","none")
              graph.setNodeValue(tabelObjectComp.name,"isRowNotSelected",() => true)
            }
            if(cardClockObjectComp){
              graph.setNodeValue(cardClockObjectComp.name,"title","Часы из всех табелей за период и по сотрудников редактируемого табеля")
            }
            if(cancelTabel){
              graph.setNodeValue(cancelTabel.name,"disable",()=> false)
              graph.setNodeValue(cancelTabel.name,"label","Отменить редактирование")
              graph.setNodeValue(cancelTabel.name,"handlerqButtonClick1", () => { this.CommandButtons("cancelEditTabel")})
            }
            if(showcardClock){
              graph.setNodeValue(showcardClock.name,"disable",()=> true)
            }
            if(getReport){
              graph.setNodeValue(getReport.name,"disable",()=> true)
            }
            if(addRecordButton){
              graph.setNodeValue(addRecordButton.name,"disable",()=> true)
            }
          }
        break;
        case "Сохранить":
          try {
            await this.saveChangeTabel(cardClockComp,tabelObjectComp,cardClockObjectComp)
         } catch(e) {
            alert(e)
         } finally { //}
            graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Редактировать", 
              enable: true, disable: this.disableButtons,
              progress: { loading: false, percentage: 0 },
              buttonClick: this.CommandButtons.bind(this)}])
            if(tabelObjectComp){
              graph.setNodeValue(tabelObjectComp.name,"isRowNotSelected",() => false)
            }
            if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disable",() =>{return this.disableButtons("addRecordButton")})
            }
            
          }
        break;
        case "cancelEditTabel":
          try {
            this.cancelEditTabel()
         } catch(e) {
            alert(e)
         } finally { 
          if(getReport){
            graph.setNodeValue(getReport.name,"disable", () => {return this.disableButtons("getReport")})
          }
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disable",() =>{return this.disableButtons("addRecordButton")})
          }
          if(showcardClock){
            graph.setNodeValue(showcardClock.name,"disable",() => {return this.disableButtons("showcardClock")})
          }
        }
        break;
        case "createTabel":
          try {
            await this.createTabel()
         } catch(e) {
            alert(e)
         } finally { //}
          if(cardClockComp){
            graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Редактировать", 
              enable: true, disable: this.disableButtons,
              progress: { loading: false, percentage: 0 },
              buttonClick: this.CommandButtons.bind(this)}])
            graph.setNodeValue(cardClockComp.name,"dataSource",[])
          }
          
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disableTooltipText","Выберете табель!")
          }
          if(tabelObjectComp){
            graph.setNodeValue(tabelObjectComp.name,"selection","single")
            //graph.setNodeValue(tabelObjectComp.name,"isRowNotSelected",() => true)
          }
          if(cardClockObjectComp){
            graph.setNodeValue(cardClockObjectComp.name,"title","Часы сотрудников из выбранного табеля")
          }
          if(cancelTabel){
            graph.setNodeValue(cancelTabel.name,"disable",() =>{return this.disableButtons("cancelTabel")})
            graph.setNodeValue(cancelTabel.name,"label","Отменить создание табеля")
            graph.setNodeValue(cancelTabel.name,"handlerqButtonClick1", () => { this.CommandButtons("cancelTabel")})
          }
          if(getReport){
            graph.setNodeValue(getReport.name,"disable", () => {return this.disableButtons("getReport")})
          }
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disable",() =>{return this.disableButtons("addRecordButton")})
          }
          if(showcardClock){
            graph.setNodeValue(showcardClock.name,"disable",()=>{return this.disableButtons("showcardClock")})
            
          }
         }

        break;
        case "showcardClock":
          try {
           await this.visualizeTabel()
         } catch(e) {
            alert(e)
         } //finally { }
        break;
        case "addDataSet":
          try {
           await this.addDataSet()
         } catch(e) {
            alert(e)
         } finally {
          let ListBox1 = graph.findVertexByValue("ListBox1")
          let ListBox2 = graph.findVertexByValue("ListBox2")
          if(ListBox1){
            graph.setNodeValue(ListBox1.name,"customButtons",[{name:"addSet", lable: "Добавить в табель", enable: true, disable: () =>false, 
              progress: { loading: false, percentage: 0 },
              buttonClick: () => { this.CommandButtons.bind(this)("addDataSet")}}])
          }
          if(ListBox2){
            graph.setNodeValue(ListBox2.name,"customButtons",[{name:"recalc", lable: "Пересчитать остатки часов", enable: true,  disable: () =>false,
              progress: { loading: false, percentage: 0 },
              buttonClick: this.updateAddedDataSet.bind(this)}])
          }
        }
        break;
        case "cancelTabel":
          try {
            this.cancelCreateTabel()
         } catch(e) {
            alert(e)
         } finally { 
          if(getReport){
            graph.setNodeValue(getReport.name,"disable", () => {return this.disableButtons("getReport")})
          }
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disable",() =>{return this.disableButtons("addRecordButton")})
          }
          if(showcardClock){
            graph.setNodeValue(showcardClock.name,"disable",()=>{return this.disableButtons("showcardClock")})
          }
           
         }
        break;
        case "addRecordButton":
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"progress",{ loading: true, percentage: 0 })
            
          }
          try {
            await this.addRecordButton()
          } catch(e) {
            alert(e)
          } finally { 
          if(cardClockComp){
            
              
            graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Редактировать", 
              enable: true, disable: this.disableButtons,
              progress: { loading: false, percentage: 0 },
              buttonClick: this.CommandButtons.bind(this)}])
          }
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"disableTooltipText","Выберете табель!")
          }
          if(tabelObjectComp){
            graph.setNodeValue(tabelObjectComp.name,"selection","single")
            graph.setNodeValue(tabelObjectComp.name,"importDataSource",[])
            //graph.setNodeValue(tabelObjectComp.name,"isRowNotSelected",() => true)
          }
          if(cardClockObjectComp){
            graph.setNodeValue(cardClockObjectComp.name,"title","Часы сотрудников из выбранного табеля")
            graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
          }
          if(cancelTabel){
            graph.setNodeValue(cancelTabel.name,"disable",() => {return this.disableButtons("cancelTabel")})
            graph.setNodeValue(cancelTabel.name,"label","Отменить создание табеля")
            graph.setNodeValue(cancelTabel.name,"handlerqButtonClick1", () => { this.CommandButtons("cancelTabel")})
          }
          if(showcardClock){
            graph.setNodeValue(showcardClock.name,"disable", () => {return this.disableButtons("showcardClock")})
          }
          if(getReport){
            graph.setNodeValue(getReport.name,"disable", () => {return this.disableButtons("getReport")})
          }
          
          // if(cardClockObjectComp){
          //   let selected = graph.getNodeValue(cardClockObjectComp.name,"selected")
          //   if(selected){selected.length =0}
          //   graph.setNodeValue(cardClockObjectComp.name,"selected",selected)
          // }
          if(addRecordButton){
            graph.setNodeValue(addRecordButton.name,"progress",{ loading: false, percentage: 0 })
          }
         }
        break;
       
        //default:
      }
    },

    disableButtons(compName){
      let result = false
      let graph = store.getters.getGraph
      let cardClockComp = graph.findVertexByValue("cardClockComp")
      let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
      let dataSource
      let selectedTabel
      let importDataSource
      let deletedRows
      let customButtons
      let isRowNotSelected
      
      switch (compName) {
        case "showcardClock": //Показать табель
          dataSource = graph.getNodeValue(cardClockComp.name,"dataSource");
          if(dataSource && dataSource.length>0){
            result = true
          }
          else{
            selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
            //selectedTabel = utils.isValidObject({selectedTabel},"Id","number","string")
            if(!selectedTabel){result = true}
            else{
              if(Array.isArray(selectedTabel)){
                if(selectedTabel.length == 0){result = true}
              }
              else{
                if (Object.keys(selectedTabel).length == 0) {
                  result = true
                }
              }
            }
          }
          break;
        case "cancelTabel": //Отмена создания табеля
          importDataSource = graph.getNodeValue(tabelObjectComp.name,"importDataSource");
          if(importDataSource){
            if(importDataSource.length == 0){
              return true
            }
          }
          break;
        case "addRecordButton": //Сохранить изменения в базу
            deletedRows = graph.getNodeValue(tabelObjectComp.name,"deletedRows");
            customButtons = graph.getNodeValue(cardClockComp.name,"customButtons");
            isRowNotSelected = graph.getNodeValue(tabelObjectComp.name,"isRowNotSelected");
            if((isRowNotSelected() || deletedRows.length == 0) && customButtons.lable == "Сохранить"){
              result=true
          }
          break;
        case "getReport": //Скачать отчет в Excel
            isRowNotSelected = graph.getNodeValue(tabelObjectComp.name,"isRowNotSelected");
            console.log("getReport, isRowNotSelected = ", isRowNotSelected)
            if(isRowNotSelected()){
              result = true
            }
            break;
        case "editSave":
            dataSource = graph.getNodeValue(cardClockComp.name,"dataSource");
            selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject");
            //selectedTabel = utils.isValidObject({selectedTabel},"Id","number","string");
            if(!dataSource) {return true}
            if(dataSource.length == 0) {return true}
            if(!selectedTabel){result = true}
            else{
              if(Array.isArray(selectedTabel)){
                if(selectedTabel.length == 0){result = true}
              }
              else{
                if (Object.keys(selectedTabel).length == 0) {
                  result = true
                }
              }
            }
            break;
        default:
          
      }
      return result
    },

    cancelEditTabel(){
      let graph = store.getters.getGraph
      let cardClockComp = graph.findVertexByValue("cardClockComp")
      let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
      let addRecordButton = graph.findVertexByValue("addRecordButton")
      let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
      let cancelTabel = graph.findVertexByValue("cancelTabel")
      let showcardClock = graph.findVertexByValue("showcardClock")
      graph.setNodeValue(cardClockComp.name,"customButtons",[{name:"change", lable: "Редактировать", 
        enable: true, disable: this.disableButtons,
        progress: { loading: false, percentage: 0 },
        buttonClick: this.CommandButtons.bind(this)}])
      if(cardClockComp){
        if(tabelObjectComp){
          let importDataSource = graph.getNodeValue(tabelObjectComp.name,"importDataSource")
          if(!importDataSource || importDataSource.length==0){
            graph.setNodeValue(cardClockComp.name,"dataSource",[])
          }
        }
        
      }
      if(addRecordButton){
        graph.setNodeValue(addRecordButton.name,"disableTooltipText","Выберете табель!")
      }
      if(tabelObjectComp){
        graph.setNodeValue(tabelObjectComp.name,"selection","single")
        graph.setNodeValue(tabelObjectComp.name,"isRowNotSelected",() => false)
      }
      if(cardClockObjectComp){
        if(tabelObjectComp){
          let importDataSource = graph.getNodeValue(tabelObjectComp.name,"importDataSource")
          if(!importDataSource || importDataSource.length==0){
            graph.setNodeValue(cardClockObjectComp.name,"title","Часы сотрудников из выбранного табеля")
            graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
            this.LoadCardClockByTabelId()
          }
        }
        
      }
      if(cancelTabel){
        graph.setNodeValue(cancelTabel.name,"disable",() => {return this.disableButtons("cancelTabel")})
        graph.setNodeValue(cancelTabel.name,"label","Отменить создание табеля")
        graph.setNodeValue(cancelTabel.name,"handlerqButtonClick1", () => { this.CommandButtons("cancelTabel")})
      }
      
      if(showcardClock){
        graph.setNodeValue(showcardClock.name,"disable", () => {return this.disableButtons("showcardClock")})
      }
    },

    async saveChangeTabel(cardClockComp,tabelObjectComp,cardClockObjectComp){
      let result = false
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          //let cardClockComp = graph.findVertexByValue("cardClockComp")
          if (cardClockComp){
            //let columns = []
            //let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
            //let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
            let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
            selectedTabel = utils.isValidObject(notify.defaultInfo, {selectedTabel},"Id","guid","string", "bigint", "number")
            if(!selectedTabel){notify.defaultInfo("Требуется отметить табель галочкой!"); return false}
            let dataSource = []// = graph.getNodeValue(cardClockObjectComp.name,"dataSource")
            let shownTabelId = graph.getNodeValue(cardClockComp.name,"shownTabelId")
            shownTabelId = utils.isValidValue({shownTabelId},["number","bigint", "guid","string"],(x)=>{return x == selectedTabel.Id})
            if(!shownTabelId){notify.defaultInfo("Показанный табель не совпадает с выбранным!"); return false}
            let invertedDatasource = graph.getNodeValue(cardClockComp.name,"dataSource")
            for(let i =0; i< invertedDatasource.length; i++){
              let row = invertedDatasource[i]
              let EmployeeId = row.EmployeeId
              for (let key of Object.keys(row)){
                let rawDate = key.match(/(^[A-Za-z]{4}-)(\d{4})-(\d{1,2})-(\d{1,2})$/)
                if(!rawDate){continue}
                if(rawDate.length==5){
                  let year = rawDate[2]
                  let month = rawDate[3]
                  let day = rawDate[4]
                  let date = new Date(year,month-1,day)
                  let Watch = parseFloat(row[key])
                  if(Watch && Watch > 0){
                    dataSource.push({EmployeeId, Date:date, Watch, Id: this.uuidv4(), isNewRow: true})
                  }
                  
                }
              }
            }
            if(cardClockObjectComp){
              graph.setNodeValue(cardClockObjectComp.name,"importDataSource",dataSource)
              result = true
            }
          }
        }
      }
      return result
    },

    async changeTabel(cardClockComp,tabelObjectComp,cardClockObjectComp){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          if (cardClockComp){
            if (tabelObjectComp && cardClockObjectComp){
              let selectedTabel = graph.getNodeValue(tabelObjectComp.name,"selectedObject")
              selectedTabel = utils.isValidObject(notify.defaultInfo, {selectedTabel},"Id","guid","string", "bigint", "number")
              if(!selectedTabel){notify.defaultInfo("Требуется отметить табель галочкой!"); return false}
              let dataSource = graph.getNodeValue(cardClockObjectComp.name,"dataSource")
              if(!dataSource) {notify.defaultInfo("В выбранном табеле отсутствуют записи!"); return false}
              if(dataSource.length==0) {notify.defaultInfo("В выбранном табеле отсутствуют записи!"); return false}
              let shownTabelId = graph.getNodeValue(cardClockComp.name,"shownTabelId")
              shownTabelId = utils.isValidValue({shownTabelId},["number","bigint", "guid","string"],(x)=>{return x == selectedTabel.Id})
              if(!shownTabelId){notify.defaultInfo("Показанный табель не совпадает с выбранным!"); return false}
              let invertedDatasource = graph.getNodeValue(cardClockComp.name,"dataSource")
              
              //Проверки завершились успешно
              let startDate = selectedTabel.startPeriod
              let endDate = selectedTabel.endPeriod
              if(!(startDate instanceof Date)  || !(endDate instanceof Date) ){notify.defaultError("Не удалось получить общий период из выбранного табеля!"); return false}
              startDate.setHours(0,0,0,0)
              endDate.setHours(0,0,0,0)
              if(startDate.getTime()>endDate.getTime()){
               notify.defaultInfo("Не верно задан период!")
               return
              }
              let calendarPeriod = this.GetCalendarPeriod(startDate, endDate)
              
              let maxHoursFromPeriod = this.GetMaxHoursFromPeriod(calendarPeriod)
              if(maxHoursFromPeriod==0){notify.defaultInfo("В заданным периоде нет рабочих дней!");
              
                return false}
              
              let workingDays = this.GetWorkingDays(calendarPeriod)
              
              let differentEmployeeIds = this.getDifferentEmployeeIds(dataSource)
            
              let assignedHours = await this.getCurrentCardClockData(differentEmployeeIds,startDate,endDate)
              
              let newDataSource = []
              for(let i = 0; i < differentEmployeeIds.length; i++) {
                let employee = differentEmployeeIds[i]
                let employeeServerData = assignedHours.filter(o => o.EmployeeId == employee) //if assigned not null
                
                let workingDaysWithMarkedHours = this.GetWorkingDaysWithMarkedHours(employee,workingDays,employeeServerData)
                newDataSource.push({EmployeeId: employee, workingDaysWithMarkedHours})
              }

              for(let i =0; i< invertedDatasource.length; i++){
                let row = invertedDatasource[i]
                let assignedData = newDataSource.find(o => o.EmployeeId == row.EmployeeId)
                //for (let key of Object.keys(row)){
                for (let j=0; j<workingDays.length; j++){
                  let workDate = workingDays[j]
                  let assigned = assignedData.workingDaysWithMarkedHours.find(o => o.date.getTime() == workDate.getTime())
                  //let date = new Date(Date.parse(empData.Date))
                  let Year = workDate.getFullYear()
                  let Month = workDate.getMonth() + 1
                  let Day = workDate.getDate()
                  let fieldName = "date"+"-"+Year+"-"+Month+"-"+Day
                    row[fieldName+"-hint"] = assigned?assigned.markedHours:null
                    if(row.isNewRow){
                      row[fieldName+"-hint"]+=row[fieldName]?row[fieldName]:null
                    }
                }
              }
              
              

              
              graph.setNodeValue(cardClockComp.name,"useNumberCellsHint",true)
              graph.setNodeValue(cardClockComp.name,"useStringCellsHint",true)

             
            }
          }
        }
      }
      return true        
    },

    cancelCreateTabel(){
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Табель рабочего времени"){
          let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
          let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
          let ListBox1 = graph.findVertexByValue("ListBox1")
          if (tabelObjectComp && cardClockObjectComp ){
            graph.setNodeValue(tabelObjectComp.name,"importDataSource",[])
            graph.setNodeValue(cardClockObjectComp.name,"importDataSource",[])
          }
          if(ListBox1){
            graph.setNodeValue(ListBox1.name,"dataSets",[])
          }
        }
      }
    },

    GetOrdinalNumberOfDate(workingDays, date){
      let result = 1
      let curDate = (new Date(Date.parse(date))).getTime()
      console.log("curDate==",curDate)
      for(let i = 0; i < workingDays.length; i++) {
        let workDate = workingDays[i].getTime()

          if (workDate >= curDate){
            return i
          }
      }
      return  result
    },
    GetFreeHours(workData, markedHours){
      let result =0
      if (this.IsFriday(workData)){
          result = 7 - markedHours
      }
      else{
          result = 8 - markedHours
      }
      return result
    },
    IsFriday(dateValuee){

      let date = window.dt.parse(dateValuee)  //Заменить
      return date.getDay()==5?true:false
    },
    
    async createTabel(){
      let graph = store.getters.getGraph
      let workingDaysWithMarkedHours = []
      let rootComp = graph.findVertexByValue("laborCostContent")
      if (rootComp){
        let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
        if(selectedTabName=="Автоматическое распределение трудозатрат"){
          let tabelDataSource = []
          let cardClockDataSource =[]
          let tabelObjectComp = graph.findVertexByValue("tabelObjectComp")
          let cardClockObjectComp = graph.findVertexByValue("cardClockObjectComp")
          let ListBox2 = graph.findVertexByValue("ListBox2")
          if (ListBox2){
            let dataSource = graph.getNodeValue(ListBox2.name,"dataSource")
            let workingDays = graph.getNodeValue(ListBox2.name,"workingDays")
            let employeesData = graph.getNodeValue(ListBox2.name,"employeesData")
            let colPeriodForAllDep = graph.getNodeValue(ListBox2.name,"colPeriodForAllDep")
            if (!dataSource || !workingDays) return
            for(let i = 0; i < dataSource.length; i++) {
              let employee = dataSource[i]
              let employeeServerData = employeesData.filter(o => o.EmployeeId == employee.Id)
              
              let workingDaysWithMarkedHours1 = this.GetWorkingDaysWithMarkedHours(employee.Id,workingDays,employeeServerData)
              
              workingDaysWithMarkedHours1.EmployeeId = employee.Id
              workingDaysWithMarkedHours=[...workingDaysWithMarkedHours1]
              let departmentPeriod = workingDays.length
              let findedDep = colPeriodForAllDep.find(o => o.department == employee.department)
              if (findedDep){
                departmentPeriod = findedDep.endd
              }

              let assignedHoursForEmployee = employee.assigned
              //let unmarkedHoursForEmployee = employee.remains
              let numberOfWorkingDaysForDep = departmentPeriod
              let numberOfWorkingDays = numberOfWorkingDaysForDep
                
              let usedDays=1
              let stepDays = 0
              let workData
              let markedHours =0
              let freeHours =0
              usedDays = assignedHoursForEmployee / employee.hoursPerDay
              if (usedDays<1){usedDays=1}
              if (usedDays <= numberOfWorkingDays){
                stepDays = Math.floor(numberOfWorkingDays/usedDays)
              }
              else{
                stepDays = 1
              }
              let start 
              let endd
              //let direct
              start = this.GetOrdinalNumberOfDate(workingDays, employee.startPeriod)
              endd = this.GetOrdinalNumberOfDate(workingDays, employee.endPeriod)
              if (endd > workingDaysWithMarkedHours.length){
                endd = workingDaysWithMarkedHours.length-1
              }
              if (start > workingDaysWithMarkedHours.length){
                start = workingDaysWithMarkedHours.length-1
              }
              let distributedHours = 0
              let two = 0
              
              while (assignedHoursForEmployee > distributedHours){
                let restHours = assignedHoursForEmployee - distributedHours
                let setHours = restHours
                distributedHours = distributedHours + setHours
                let sumHours = setHours
                let origStart = start
                let origEnd = endd
                //for (let step = start > endd? stepDays * -1: stepDays; start != endd; start += step){
                do{
                  let step = start > endd? stepDays * -1: stepDays
                  workData = workingDaysWithMarkedHours[start].date
                  markedHours = workingDaysWithMarkedHours[start].markedHours
                  freeHours = this.GetFreeHours(workData, markedHours)
                  if (employee.hoursPerDay > freeHours){
                    if (sumHours >= freeHours){
                      sumHours = sumHours - freeHours
                      markedHours = freeHours
                    }
                    else{
                      markedHours = sumHours
                      sumHours = 0
                    }
                  }
                  else{
                    if (sumHours >= freeHours){
                      markedHours = employee.hoursPerDay 
                      sumHours = sumHours - employee.hoursPerDay
                    }
                    else{
                      if(employee.hoursPerDay>sumHours){
                        markedHours = sumHours
                        sumHours = 0
                      }
                      else{
                        markedHours = employee.hoursPerDay
                        sumHours = sumHours - employee.hoursPerDay
                      }
                      
                    }
                  }
                  if(!workingDaysWithMarkedHours[start].markedHours2){
                    workingDaysWithMarkedHours[start].markedHours2 =0
                    workingDaysWithMarkedHours[start].Watch = 0
                  }
                  workingDaysWithMarkedHours[start].markedHours2 = workingDaysWithMarkedHours[start].markedHours2 + markedHours
                  workingDaysWithMarkedHours[start].Watch = workingDaysWithMarkedHours[start].Watch + markedHours
                  workingDaysWithMarkedHours[start].markedHours = workingDaysWithMarkedHours[start].markedHours + markedHours

                  
                  if (sumHours <= 0){
                    sumHours =0
                    break
                  }
                  if(step>0 && start+step>endd){
                    while(step>0 && start+step>endd){
                      step-=1
                    }
                    if(step<1)
                      break
                  }
                  if(step<0 && start+step<endd){
                    while(step<0 && start+step<endd){
                      step+=1
                    }
                    if(step>=0)
                      break
                  }
                  start += step
                } while(start != endd)
                if (stepDays == 1 && sumHours > 0){
                  if (origStart <= origEnd){
                    
                    start = endd != workingDaysWithMarkedHours.length-1? endd + 1: endd
                    endd = origStart != 0? origStart - 1: origStart
                  }
                  else {
                    start = endd != 0? endd - 1: endd
                    endd = origStart != workingDaysWithMarkedHours.length-1? origStart + 1: origStart
                 }
                }

                distributedHours = distributedHours - sumHours
                two = two + 1
                if (two == 2){
                  if (stepDays > 1){
                    stepDays = stepDays - 1
                  }
                  two = 0
                }
                
                
              }

              cardClockDataSource = [...cardClockDataSource, ...workingDaysWithMarkedHours]
            }
            for(let k=0;k<cardClockDataSource.length;k++){
              let row = cardClockDataSource[k]
              row.isNewRow =true
              if(!this.isInt(row.Watch)){
                row.Watch = row.Watch.toFixed(1)
              }
            }
          }
          if(tabelObjectComp){
            let ContractId
            let GipId
            let TypeWork
            let StageNumber
            let ShifrAgr
            let startPeriod
            let endPeriod
            let beginDateComp = graph.findVertexByValue("beginDate")
            let endDateComp = graph.findVertexByValue("endDate")
            let typeOfWork = graph.findVertexByValue("typeOfWork")
            let stageKP = graph.findVertexByValue("stageKP")
            let shifrAgr = graph.findVertexByValue("contactShifr")
            if(shifrAgr){
              ShifrAgr = graph.getNodeValue(shifrAgr.name,"selectedObject")
            }
            if(typeOfWork){
              TypeWork = graph.getNodeValue(typeOfWork.name,"selectedObject")
            }
            if(stageKP){
              StageNumber = graph.getNodeValue(stageKP.name,"selectedObject")
            }
            if (beginDateComp && endDateComp){
              startPeriod = graph.getNodeValue(beginDateComp.name,"selected")
              endPeriod = graph.getNodeValue(endDateComp.name,"selected")
              if(startPeriod instanceof Date){
                startPeriod.setHours(0,0,0,0)
              }
              else{notify.defaultError("Ошибка! Начало периода"); return}
              if(endPeriod instanceof Date){
                endPeriod.setHours(0,0,0,0)
              }
              else{notify.defaultError("Ошибка! Конец периода"); return}
            }
            
            let mainTreeView = graph.findVertexByValue("mainTreeView")
            if(mainTreeView){
              let selectedContract = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
              
              //let tracedObj = this.traceMethodCalls(this.isValidObject)
              
              if(utils.isValidObject(notify.defaultInfo,{selectedContract},"Contract","string","guid")){
                ContractId = selectedContract.Contract
                let requestOptions = this.GetRequesOptionsTemplate()
                requestOptions.typeName = "Contract"
                requestOptions.nameSpace ="SapsanLib.Models"
                 let fullName = requestOptions.nameSpace+"."+requestOptions.typeName
                 let contracts = store.getters[requestOptions.getterName][fullName]
                 if(contracts){
                  if(contracts.length>0){
                    let contract = contracts.find(o => o.Id == ContractId)
                    if(contract){
                      GipId = contract.IdGip
                    }
                    
                  }
                    
                 }
                   
              }
              
            }
            // startPeriod = new Date(startPeriod)//.toISOString().split('T')[0]
            // endPeriod = new Date(endPeriod)//.toISOString().split('T')[0]
            let Title = "Табель_"+TypeWork+"_"+ShifrAgr+".xlsx"
            tabelDataSource.push({Id: this.uuidv4(), Title: Title, ContractId,GipId,StageNumber, ShifrAgr, TypeWork,startPeriod,endPeriod})
            graph.setNodeValue(tabelObjectComp.name,"importDataSource",tabelDataSource)  
            if(cardClockObjectComp){
              cardClockDataSource =cardClockDataSource.filter(o => o.Watch!=null && o.Watch!=undefined && o.Watch!=0)
              graph.setNodeValue(cardClockObjectComp.name,"importDataSource",cardClockDataSource)  
            }
            graph.setNodeValue(rootComp.name,"selectedTab","Табель рабочего времени")
           
          }
          
        }
      }
    },

    uuidv4() {
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
      )
  },

     isInt(n) {
      if(n==null || n==undefined){return true}
      if(typeof n === "string") {return true}
      return n % 1 === 0;
    },

    GetWorkingDaysWithMarkedHours(id, workingDays, employeeServerData){
      var collapseByDate = [];
     if(employeeServerData){
      employeeServerData.reduce(function(res, value) {
        if (!res[value.Date]) {
          res[value.Date] = { Date: value.Date, Watch: 0 }
          collapseByDate.push(res[value.Date])
        }
        res[value.Date].Watch += value.Watch;
        return res;
      }, {});
     }
      let result =[]
      for(let i = 0; i < workingDays.length; i++) {
        let data = {employeeId: id}
        let workingDay = workingDays[i]
        let watch = 0
        let serverData
        if(collapseByDate.length>0){
          serverData = collapseByDate.find(o => o.Date.getTime() == workingDay.getTime())
        }
        if(serverData){
          watch = serverData.Watch
        }
        data.markedHours = watch
        data.date = workingDay
        data.Date = data.date
        data.EmployeeId = id
        result.push(data)
      }
      return result
    },

    mGetObjectTypeByName(name) {
        const getterName = "getObjectTypes"
        const getter = store.getters[getterName]
        if(getter !== undefined) {
          return getter.find(o => o.Name == name)
        }
        return null
    },
    
    async loadUserBySubdivision() {
      let graph = store.getters.getGraph
      let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let comboBoxDepartment = graph.findVertexByValue("comboBoxDepartment")
            if (comboBoxDepartment){
              let selectedDepartment = graph.getNodeValue(comboBoxDepartment.name,"selectedObject")
              selectedDepartment = utils.isValidObject({selectedDepartment}, "Id", "string", "guid")
              if (!selectedDepartment) return
              let listBox1 = graph.findVertexByValue("ListBox1")
              if(!listBox1){alert("Не найден компонент listBox1"); return}
              let dataSets = graph.getNodeValue(listBox1.name,"dataSets")
              //let requestOptions = this.GetRequesOptionsTemplate()
              //requestOptions.typeName = "User"
              //requestOptions.nameSpace ="SapsanLib.Models"
              //requestOptions.condition = "IdSubdivision == \""+selectedDepartment.Id+"\""
              //await store.dispatch(requestOptions.actionName,requestOptions)
              let fullName = "SapsanLib.Models"+"."+"User"
              let geter = store.getters["getAnyObjects"][fullName]
              let dataSource = geter?geter.filter( function (item){
                  let childrens = store.getters["getAnyObjects"]["SapsanLib.Models.SprSubdivision"].filter(o => o.IdParent == selectedDepartment.Id || o.Id == selectedDepartment.Id)
                  let isExist = childrens.find(o => o.Id == item.IdSubdivision)
                  if (isExist){return true}
                  else{return false}
                  }):[]//o => o.IdSubdivision == selectedDepartment.Id):[]
              let geterPosition = store.getters["getAnyObjects"]["SapsanLib.Models.SprPositionEmployee"]
              if(Array.isArray(dataSource)){
                dataSource  = dataSource.map(function (item) {
                  let newItem = {...item}
                  let position = geterPosition.find(o => o.Id == newItem.IdPosition)
                  newItem.Position = position?position.Name:""
                  newItem.department = selectedDepartment.ShortName
                  newItem.assigned =0
                  newItem.remains='?'
                  newItem.hoursPerDay =1
                  let saveItem = dataSets.find(o=> o['Id'] == item['Id'])
                  if(saveItem){
                    newItem = saveItem
                  }
                  return newItem
                })
              }
              graph.setNodeValue(listBox1.name,"dataSource",dataSource)  
            }
          }    
        }  
      },
      
      async addDesiredHoursToListBox1(){
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){ 
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let TextBoxDesired = graph.findVertexByValue("TextBoxDesired")
            if (TextBoxDesired){
              let hoursPerDay = graph.getNodeValue(TextBoxDesired.name,"selectedObject")
              hoursPerDay = utils.isValidValue({hoursPerDay},"number",(x)=>{return x>0 && x<9})
              if (!hoursPerDay) return
              let listBox1 = graph.findVertexByValue("ListBox1")
              let dataSource = graph.getNodeValue(listBox1.name,"dataSource")
              dataSource  = dataSource.map(function (item) {
                  let newItem = {...item}
                  newItem.hoursPerDay = hoursPerDay
                  return newItem
              })
              graph.setNodeValue(listBox1.name,"dataSource",dataSource)  
            }
          }    
        }  
      },
      

      async recalculateAssigned(){
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let TZDep = graph.findVertexByValue("TZDep")
            if (TZDep){
              let hoursPerDep = graph.getNodeValue(TZDep.name,"selectedObject")
              //hoursPerDep = utils.isValidValue({hoursPerDep},"number",(x)=>{return x>0})
              
              if (!hoursPerDep) {hoursPerDep = 0}
              let listBox1 = graph.findVertexByValue("ListBox1")
              if(listBox1){
                let selectedUsers = graph.getNodeValue(listBox1.name,"selectedObject")
                //selectedUsers = this.isValidObject({selectedUsers},"Id","string","guid")
                if(!selectedUsers) {selectedUsers = []}
                let dataSource = graph.getNodeValue(listBox1.name,"dataSource")
                let countSelected = 1
                let curSetSelection  = selectedUsers.filter(function (item) {
                  let isSelected = dataSource.find(o=> o['Id'] === item['Id'])
                  if(isSelected)
                    return true
                  else
                    return false
                })
                if(curSetSelection) if(curSetSelection.length>0) countSelected = curSetSelection.length
                dataSource  = dataSource.map(function (item) {
                    let newItem = {...item}
                    let isSelected = selectedUsers.find(o=> o.Surname === item.Surname)
                    if(isSelected){
                      newItem.assigned = hoursPerDep/countSelected
                      newItem.assigned = parseFloat(newItem.assigned.toFixed(1))}
                    else{
                      newItem.assigned = 0}
                    return newItem
                 })
                graph.setNodeValue(listBox1.name,"dataSource",dataSource)  
              }
            }
          }    
        }  
      },
      async ListBox1Selection1(){
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let TZDep = graph.findVertexByValue("TZDep")
            let TextBoxDesired = graph.findVertexByValue("TextBoxDesired")
            let listBox1 = graph.findVertexByValue("ListBox1")
            if (TZDep && TextBoxDesired && listBox1){
              let hoursPerDep = graph.getNodeValue(TZDep.name,"selectedObject")
              if(hoursPerDep<=0){
                notify.defaultInfo("Количество часов на отдел должно быть положительным числом!")
                hoursPerDep = 0
              }
              //hoursPerDep = utils.isValidValue({hoursPerDep},"number",(x)=>{return x>0})
              if (!hoursPerDep) {hoursPerDep = 0}
              let hoursPerDay = graph.getNodeValue(TextBoxDesired.name,"selectedObject")
              //hoursPerDay = utils.isValidValue({hoursPerDay},"number",(x)=>{return x>0 && x<9})
              if(hoursPerDay<=0){
                notify.defaultInfo("Количество часов в день должно быть от 1 до 8!")
                hoursPerDay = 0
              }
              if(!hoursPerDay){hoursPerDay = 0}
              let Desired = 1
              if (hoursPerDay>0) {Desired = hoursPerDay}
              let dataSource = graph.getNodeValue(listBox1.name,"dataSource")
              let selectedUsers = graph.getNodeValue(listBox1.name,"selectedObject")
              //selectedUsers = utils.isValidObject({selectedUsers},"Id","string","guid")
              if(!selectedUsers) selectedUsers = []
              let dataSourceSelelected = selectedUsers.filter(function (item) {
                let isExist = dataSource.find(o=> o['Id'] === item['Id'])
                if(isExist)
                  return  true
                else       
                  return false
              })
              let countSelected = 1
              if(dataSourceSelelected) if(dataSourceSelelected.length>0) countSelected = dataSourceSelelected.length
              
              dataSource  = dataSource.map(function (item) {
                  let newItem = {...item}
                  let isSelected = selectedUsers.find(o=> o['Id'] === item['Id'])
                  if(isSelected){
                    newItem.assigned = parseFloat(hoursPerDep/countSelected)
                    newItem.hoursPerDay = parseInt(Desired)
                  }
                  else{
                    newItem.assigned = 0
                  }
                  return newItem
                })
              graph.setNodeValue(listBox1.name,"dataSource",dataSource)  
            }
          }    
        }  
      },
      async updateAddedDataSet(){
        let graph = store.getters.getGraph
        let startDate = new Date()
        let endDate = new Date()
        //let dataSets = []
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let ListBox1 = graph.findVertexByValue("ListBox1")
            //let maxHoursFromPeriodcomp = graph.findVertexByValue("maxHoursFromPeriod")
            let beginDateComp = graph.findVertexByValue("beginDate")
            let endDateComp = graph.findVertexByValue("endDate")
            if (beginDateComp && endDateComp){
              startDate = graph.getNodeValue(beginDateComp.name,"selected")
              endDate = graph.getNodeValue(endDateComp.name,"selected")
              if(startDate instanceof Date){
                startDate.setHours(0,0,0,0)
              }
              else{notify.defaultError("Ошибка! Начало периода"); return}
              if(endDate instanceof Date){
                endDate.setHours(0,0,0,0)
              }
              else{notify.defaultError("Ошибка! Конец периода"); return}
              if(startDate.getTime()>endDate.getTime()){
              notify.defaultInfo("Не верно задан период!")
              return
              }
            }
            if (ListBox1){
              let dataSets = graph.getNodeValue(ListBox1.name,"dataSets")
              if(dataSets.length>0){
                await this.makeDataSet(ListBox1,dataSets, startDate, endDate)
              }
              
            }
          }
        }
      },
      
      

      async addDataSet() {
        let graph = store.getters.getGraph
        let startDate = new Date()
        let endDate = new Date()
        //let dataSets = []
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let ListBox1 = graph.findVertexByValue("ListBox1")
            //let maxHoursFromPeriodcomp = graph.findVertexByValue("maxHoursFromPeriod")
            let beginDateComp = graph.findVertexByValue("beginDate")
            let endDateComp = graph.findVertexByValue("endDate")
            if (beginDateComp && endDateComp){
               startDate = graph.getNodeValue(beginDateComp.name,"selected")
               endDate = graph.getNodeValue(endDateComp.name,"selected")
               if(!(startDate instanceof Date)  || !(endDate instanceof Date) ){notify.defaultError("Не удалось получить общий период!"); return}
               startDate.setHours(0,0,0,0)
               endDate.setHours(0,0,0,0)
               if(startDate.getTime()>endDate.getTime()){
                notify.defaultInfo("Не верно задан период!")
                return
               }
            }
            if (ListBox1){
              let dataSets = graph.getNodeValue(ListBox1.name,"dataSets")
              let dataSource = graph.getNodeValue(ListBox1.name,"dataSource")
              let selectedSet = graph.getNodeValue(ListBox1.name,"selectedObject")
              if(utils.isValidObject(notify.defaultInfo,{selectedSet}) && Array.isArray(dataSource) && Array.isArray(dataSets)){
                graph.setNodeValue(ListBox1.name,"customButtons",[{name:"addSet", lable: "Добавить в табель", enable: true, disable: () =>false, 
                  progress: { loading: false, percentage: 0 },
                  buttonClick: () => { this.CommandButtons.bind(this)("addDataSet")}}])
                let updateSet  = dataSource.filter(function (item) {
                  let saveItem = selectedSet.find(o=> o['Id'] == item['Id'])
                  if(saveItem)
                    return true
                  else
                    return false
                })
                let newSet  = updateSet.filter(function (item) {
                  let saveItem = dataSets.find(o=> o['Id'] == item['Id'])
                  if(!saveItem)
                    return true
                  else
                    return false
                })
                dataSets = dataSets.map(function (item) {
                  let saveItem = updateSet.find(o=> o['Id'] == item['Id'])
                  if(saveItem)
                    return saveItem
                  else
                    return item
                })
                dataSets =[...dataSets, ...newSet]
                  dataSets  = dataSets.filter(function (item) {
                  let saveItem = selectedSet.find(o=> o['Id'] == item['Id'])
                  if(saveItem)
                    return true
                  else
                    return false
                })
                let depOrders = this.GetDepOrders()
                //let geterPosition = store.getters["getAnyObjects"]["SapsanLib.Models.SprPositionEmployee"]
                dataSets = dataSets.map(function (item) {
                  let newItem = {...item}
                  let depOrder = depOrders.find(o => o.department == item.department)
                  newItem["OrderNum"] = depOrder?depOrder.OrderNum:1
                  newItem.Surname += " ("+newItem.Position+")"
                  return newItem
                })
                dataSets.sort(function(a, b) {
                  let af = a.department;
                  let bf = b.department;
                  let as = a.OrderNum;
                  let bs = b.OrderNum;
                  if (af == bf) {
                      return  0;
                  } else {
                      return (as < bs) ? -1 : 1;
                  }
                });
                await this.makeDataSet(ListBox1,dataSets, startDate, endDate)
                 
              }
            }
          }    
        }  
      },

      async refreshRemainsHours(){
        let graph = store.getters.getGraph
        let startDate
        let endDate 
        //let dataSets = []
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){
            let ListBox2 = graph.findVertexByValue("ListBox2")
            //let maxHoursFromPeriodcomp = graph.findVertexByValue("maxHoursFromPeriod")
            let beginDateComp = graph.findVertexByValue("beginDate")
            let endDateComp = graph.findVertexByValue("endDate")
            if (beginDateComp && endDateComp){
               startDate = graph.getNodeValue(beginDateComp.name,"selected")
               endDate = graph.getNodeValue(endDateComp.name,"selected")
               if(!(startDate instanceof Date)  || !(endDate instanceof Date) ){notify.defaultError("Не удалось получить общий период!"); return}
               startDate.setHours(0,0,0,0)
               endDate.setHours(0,0,0,0)
               if(startDate.getTime()>endDate.getTime()){
                notify.defaultInfo("Не верно задан период!")
                return
               }
            }
            if (ListBox2){
              let dataSets = graph.getNodeValue(ListBox2.name,"dataSource")
              if(dataSets.length>0){
                await this.makeDataSet(ListBox2,dataSets, startDate, endDate)
              }
              
            }
          }
        }
      },
      modiButtonProgress(arr, buttonName, progressValue) {
        const f = () => {
          const obj = arr.find(o => o.name === buttonName);
          if (obj) {
            obj.progress.loading = progressValue.loading;
            obj.progress.percentage = progressValue.percentage;
          }
        }
        if(Array.isArray(buttonName)){
          buttonName.forEach(f)
        }else{
          f()
        }
        
      },
      async makeDataSet(progressComp,dataSets, startDate, endDate){
        let graph = store.getters.getGraph
        //remains
        //graph.setNodeValue(comp.name,"dataSets",dataSets)  
        
        let calendarPeriod = this.GetCalendarPeriod(startDate, endDate)
        let maxHoursFromPeriod = this.GetMaxHoursFromPeriod(calendarPeriod)
        if(maxHoursFromPeriod==0){notify.defaultInfo("В заданным периоде нет рабочих дней!");
          let customButtons = graph.getNodeValue(progressComp.name,"customButtons")
          this.modiButtonProgress(customButtons,["recalc","addSet"],{ loading: false, percentage: 0 })
          //graph.setNodeValue(progressComp.name,"customButtonProgress",{ loading: false, percentage: 0 })
          return}
        let customButtons = graph.getNodeValue(progressComp.name,"customButtons")
        this.modiButtonProgress(customButtons,["recalc","addSet"],{ loading: true, percentage: 10 })
        //graph.setNodeValue(progressComp.name,"customButtonProgress",{ loading: true, percentage: 10 })
        let maxHoursFromPeriodcomp = graph.findVertexByValue("maxHoursFromPeriod")
        graph.setNodeValue(maxHoursFromPeriodcomp.name,"text",maxHoursFromPeriod)
        let assignedHours = await this.GetAssignedHours(calendarPeriod, dataSets)
        this.modiButtonProgress(customButtons,["recalc","addSet"],{ loading: true, percentage: 50 })
        //graph.setNodeValue(progressComp.name,"customButtonProgress",{ loading: true, percentage: 50 })
        let workingDays = this.GetWorkingDays(calendarPeriod)

        let ListBox2 = graph.findVertexByValue("ListBox2")
        if(ListBox2)
          graph.setNodeValue(ListBox2.name,"workingDays",workingDays)  
        let colPeriodForAllDep = []
        let department = ""
        let depOrder = 0
        let departmentPeriod = 1
        let startDepPeriod = 1
        let asDate = true
        if(workingDays.length > 0){ 
          for(let i = 0; i < dataSets.length; i++) {
            let row = dataSets[i]
            if(department != row.department){
              department = row.department
              let nextDepOrder = row.OrderNum
              if(depOrder != nextDepOrder){
                startDepPeriod = (startDepPeriod + departmentPeriod -1) > workingDays.length? workingDays.length: startDepPeriod + departmentPeriod -1
                depOrder = nextDepOrder
              }
              let depOrders = this.GetDepOrders()
              departmentPeriod = this.GetDepartmentPeriod(department, workingDays, depOrders, dataSets.slice())
              let numberOfWorkingDaysForDep = departmentPeriod
              let numberOfWorkingDays = numberOfWorkingDaysForDep
              let start = startDepPeriod
              let end1 = startDepPeriod + numberOfWorkingDays-1 > workingDays.length? workingDays.length: startDepPeriod + numberOfWorkingDays-1
              let endd = end1
              colPeriodForAllDep.push({start, endd, department})

            }
          }
          graph.setNodeValue(ListBox2.name,"colPeriodForAllDep",colPeriodForAllDep)  
          if (asDate) {
            let resultAsDate = []
            for(let i = 0; i < colPeriodForAllDep.length; i++) {
              let item = colPeriodForAllDep[i]
              let startDate = workingDays[item.start-1]
              let endDate = workingDays[item.endd-1]
              resultAsDate.push({startDate, endDate, dep: item.department})
            }
            colPeriodForAllDep = resultAsDate

          }
        }
        dataSets = dataSets.map( (row) => {
        let depPeriod = colPeriodForAllDep.find(o => o.dep == row.department)
        if(depPeriod){
          if (depPeriod.startDate)
            row.startPeriod = depPeriod.startDate
          else
            row.startPeriod = startDate
          if (depPeriod.endDate)
            row.endPeriod = depPeriod.endDate
          else
            row.endPeriod = endDate
        }
        else{
          row.startPeriod = startDate
          row.endPeriod = endDate
        }
        return row
        })

        dataSets = dataSets.map( (row) => {
          let assignedHoursFromEmp = assignedHours.collapse.find(o => o.Id == row.Id)
          if(assignedHoursFromEmp){
            row.remains = parseFloat(maxHoursFromPeriod - assignedHoursFromEmp.Watch)
          }
          else{
            row.remains = parseFloat(maxHoursFromPeriod)
          }
          return row
        })
        let err=false
        for(let i=0;i<dataSets.length;i++){
          if(dataSets[i].remains<dataSets[i].assigned){
            notify.defaultError("Остаток часов для "+ dataSets[i].Surname+" меньше назначенных!")
            err=true
          }
        }
        this.modiButtonProgress(customButtons,["recalc","addSet"],{ loading: false, percentage: 0 })
        //graph.setNodeValue(progressComp.name,"customButtonProgress",{ loading: false, percentage: 0 })
        if(err)
          return
        graph.setNodeValue(progressComp.name,"dataSets",dataSets)
      },

      async GetAssignedHours(calendarPeriod, employees){
        let graph = store.getters.getGraph
        let requestOptions = this.GetRequesOptionsTemplate()
        requestOptions.typeName = "CardClock"
        requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
        requestOptions.idPropName = "EmployeeId"
        requestOptions.idPropTypeName = "System.Guid"
        requestOptions.useFilterIds = true
        const fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
        let yearNumber = calendarPeriod[0]["0"]
        let monthNumber = calendarPeriod[0]["1"]
        let day = calendarPeriod[0]["2"]
        let startData = new Date(yearNumber,monthNumber-1,day)
        //startData = new Date(Date.UTC(startData.getFullYear(), startData.getMonth(), startData.getDate(), startData.getHours(), startData.getMinutes(), startData.getSeconds(), startData.getMilliseconds()))
        startData = utils.prepareDate(startData)
        let lastIndex = calendarPeriod.length-1
        yearNumber = calendarPeriod[lastIndex]["0"]
        monthNumber = calendarPeriod[lastIndex]["1"]
        day = calendarPeriod[lastIndex]["3"]
        let endData = new Date(yearNumber,monthNumber-1,day)
        //endData = new Date(Date.UTC(endData.getFullYear(), endData.getMonth(), endData.getDate(), endData.getHours(), endData.getMinutes(), endData.getSeconds(), endData.getMilliseconds()))
        endData = utils.prepareDate(endData)
        for(let i = 0; i < employees.length; i++) {
          let employee = employees[i]
          requestOptions.ids.push(employee.Id)
        }

        requestOptions.condition = "Date >= \""+startData+"\" && Date <= \""+endData+"\""
        await store.dispatch(requestOptions.actionName, requestOptions)
        //if(this.$store.getters["getAnyObjects"][fullTypeName]!== undefined)
        let epmp = store.getters[requestOptions.getterName][fullTypeName]
        const copyEmp = epmp.map(a => Object.assign({}, a));
        let ListBox2 = graph.findVertexByValue("ListBox2")
        if(ListBox2)
          graph.setNodeValue(ListBox2.name,"employeesData", copyEmp)  
        var result = [];
        copyEmp.reduce(function(res, value) {
          if (!res[value.EmployeeId]) {
            res[value.EmployeeId] = { Id: value.EmployeeId, Watch: 0 };
            result.push(res[value.EmployeeId])
          }
          res[value.EmployeeId].Watch += value.Watch;
          return res;
        }, {});

        return {collapse:result, raw: copyEmp}
      },
      GetDepartmentPeriod(department, workingDays, depOrders, dataSets){
        let result = 0
        let coefficients = []
        let departments = this.GetSelectedDepartments(dataSets)
        if(departments.length>0){
            let differentLevelsDep = []
            let sumCoef = 0
            for(let i = 0; i < departments.length; i++) {
              let dep = departments[i]
              let order = 0
              for(let j = 0; j < depOrders.length; j++) {
                if(depOrders[j].department == dep){
                  order = depOrders[j].OrderNum
                }
              }
              let num = dataSets.filter(o => o.department == dep).length
              let tz = dataSets.reduce(function (currentSum, currentUser) 
                      {return currentUser.department==dep?currentSum + currentUser.assigned:currentSum}, 0)
              let coef = (1 / num) * (tz / 100)
              differentLevelsDep.push({dep,coef,order})
              let tempCol = []
              for(let k = 0; k < differentLevelsDep.length; k++) {
                let difdep = differentLevelsDep[k]
                tempCol.push({...difdep})
              }
              for(let k = 0; k < tempCol.length; k++) {
                let tempdep = tempCol[k]
                if(tempdep.order == order && tempdep.dep != dep){
                  if(tempdep.coef <= coef)
                    differentLevelsDep = differentLevelsDep.filter(o => o.dep != tempdep.dep)
                  else
                    differentLevelsDep = differentLevelsDep.filter(o => o.dep != dep)
                }
              }
            }
            for(let i = 0; i < differentLevelsDep.length; i++) {
              let dep = differentLevelsDep[i]
              sumCoef = sumCoef + dep.coef
              coefficients.push({dep:dep.dep,coef:dep.coef})
            }
            let x = 0
            if(sumCoef > 0){
                x = workingDays.length / sumCoef
            }
            let coefDep = coefficients.find(o => o.dep == department)
            if(coefDep){
              result = coefDep.coef*x
            }
            else{
                let depDep = departments.find(o => o == department)
                if(depDep){

                    let order = 0
                    for(let i = 0; i < depOrders.length; i++) {
                      if(depOrders[i].department == department){
                        order = depOrders[i].OrderNum
                      }
                    }
                    for(let i = 0; i < differentLevelsDep.length; i++) {
                      let dep = differentLevelsDep[i]
                      if(dep.order == order){
                        result = dep.coef * x
                      }
                    }
                }
            }
          }
        result = Math.ceil(result)
        

        return result
      },

      GetSelectedDepartments(sets){
        let result = []
        let dep  = ""
        for (let row = 0; row < sets.length; row++) {
            if(sets[row].department != dep){
                result.push(sets[row].department)
                dep = sets[row].department
            }
        }
        return result
      },
       GetWorkingDays(calendarPeriod){
        let result = []
        const countMonthInPeriod = calendarPeriod.length
        for (let i = 0; i < countMonthInPeriod; i++) {
            
            //let monthName = GetMonthName(calendarPeriod[i]["1"])
            let yearNumber = calendarPeriod[i]["0"]
            let monthNumber = calendarPeriod[i]["1"]
            let startDay = calendarPeriod[i]["2"]
            let endDay = calendarPeriod[i]["3"]
           
            for (let day = startDay; day <= endDay; day++) {
              let workData = new Date(yearNumber,monthNumber-1,day)

              let isHoliday =  this.IsHolidayOrWeekend(workData)
              
              if(isHoliday==0)
                result.push(workData)
                
            }
        }
        return result
      },
      
      GetCalendarPeriod(startDate, endDate){
          if (!startDate||!endDate) return
          let calendarPeriod =[]
          if(!(startDate instanceof Date)){
            startDate = window.dt.parse(startDate)
          }
          if(!(endDate instanceof Date)){
            endDate = window.dt.parse(endDate)
          }
          let startYear = startDate.getFullYear();
          let endYear = endDate.getFullYear();
          let startMonth = startDate.getMonth() + 1;
          let endMonth = endDate.getMonth() + 1;
          let startDay = startDate.getDate();
          let endDay = endDate.getDate();
          //let monthCount = (endYear - startYear) * 12 + endMonth - startMonth //Плюс 1 делать не надо

          
          let index = 0
          for (let y = startYear; y <= endYear; y++) { 
            let lastMonthOfYear  = y == endYear? endMonth: 12
          
            for (let m = startMonth; m <= lastMonthOfYear; m++) { 
              let daysOfMonth = new Date(y, m, 0).getDate()

              let startD = m == startMonth && y == startYear? startDay: 1
              let endD = m == endMonth && y == endYear? endDay: daysOfMonth
              calendarPeriod[index] = {0:y,1:m,2:startD,3:endD}
              index = index + 1
            }
            startMonth = 1
          }
        return calendarPeriod
      },

      GetFridaysFromPeriod(calendarPeriod){
        //let result = []
        let summ = 0
        const countMonthInPeriod = calendarPeriod.length
        for (let i = 0; i < countMonthInPeriod; i++) {
            
            //let monthName = GetMonthName(calendarPeriod[i]["1"])
            let yearNumber = calendarPeriod[i]["0"]
            let monthNumber = calendarPeriod[i]["1"]
            let startDay = calendarPeriod[i]["2"]
            let endDay = calendarPeriod[i]["3"]
            
            for (let day = startDay; day <= endDay; day++) {
              let workData = new Date(yearNumber,monthNumber-1,day)
              
              let isHoliday =  this.IsHolidayOrWeekend(workData)
              
              if(isHoliday==0){
                let isFriday = workData.getDay()==5?true:false
                if(isFriday) summ++
              }
            }
        }
        return summ
      },
      
      GetMaxHoursFromPeriod(calendarPeriod){
        let workDays = this.GetWorkingDays(calendarPeriod)
        let fridaysNum = this.GetFridaysFromPeriod(calendarPeriod)
        let notFridayNum = workDays.length - fridaysNum
        let result = notFridayNum*8 + fridaysNum*7
        return result
      },

      async HolidaysFromPeriod(startDate, endDate){
        //let graph = store.getters.getGraph
        let requestOptions = this.GetRequesOptionsTemplate()
        requestOptions.typeName = "HolidayOrWeekend"
        requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
        const fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
        let startYear = startDate.getFullYear();
        let endYear = endDate.getFullYear();
        let startMonth = startDate.getMonth() + 1;
        let endMonth = endDate.getMonth() + 1;
        requestOptions.condition = "Year >= \""+startYear+"\" && Year <= \""+endYear+"\" && Month >= \""+startMonth+"\" && Month <= \""+endMonth+"\""
        await store.dispatch(requestOptions.actionName, requestOptions)
        //if(this.$store.getters["getAnyObjects"][fullTypeName]!== undefined)
        return store.getters[requestOptions.getterName][fullTypeName] 
      },

       IsHolidayOrWeekend(date){
        let result = -1
        const typeName = "HolidayOrWeekend"
        const nameSpace = "PirAppBp.Models.Sapsan"
        let requestOptions = this.GetRequesOptionsTemplate()
        let getterName = requestOptions.getterName
        const fullTypeName = nameSpace+"."+typeName
        let Year = date.getFullYear();
        let Month = date.getMonth() + 1;
        let Day = date.getDate();
        
        let calendar = store.getters[getterName][fullTypeName]
        let holidaysPerMonth = calendar.filter( (row) => {
          if(row.Year==Year && row.Month==Month)
            return true
          else
            return false
        })
        
        if(holidaysPerMonth && holidaysPerMonth.length>0){
          let days = holidaysPerMonth[0].Days.split(",")
          if(!days || days.length==0) return -1
          days = days.map( (day) => {return Number(day)})
          let isExist = days.find(o=> o==Day)
          if(isExist){
            result = 1
          }
          else
            result = 0
        }
        return result
      },
      async loadCalendar(){
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
            
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат" || selectedTabName=="Табель рабочего времени"){
            let requestOptions = this.GetRequesOptionsTemplate()
            requestOptions.typeName = "HolidayOrWeekend"
            requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
           // const fullTypeName = nameSpace+"."+typeName
            // let Year = date.getFullYear();
            // let Month = date.getMonth() + 1;
            // let Day = date.getDate();
            // let condition = "Year == "+Year+" and Month == "+Month
            await store.dispatch(requestOptions.actionName,requestOptions)
          }    
        }  
      },
      GetCurrentDateWithautTime(){
        let date = new Date()
        date.setHours(0,0,0,0)
        return date
      },
      GetArrayMonthName(){
        let data =[]
        data[1] = "январь"
        data[2] = "февраль"
        data[3] = "март"
        data[4] = "апрель"
        data[5] = "май"
        data[6] = "июнь"
        data[7] = "июль"
        data[8] = "август"
        data[9] = "сентябрь"
        data[10] = "октябрь"
        data[11] = "ноябрь"
        data[12] = "декабрь"
        return data
      },
      GetMonthName(monthNumber){
        let result  
        let arrayMonthName = this.GetArrayMonthName()
        for (let i = 1; i <= arrayMonthName.length; i++) {
          if(i==monthNumber){
            result = arrayMonthName[i-1]
          }
        }
        return result
      },
      GetDepOrders(){
        let result = []
        let requestOptions = this.GetRequesOptionsTemplate()
        let typeName = "SprDepOrder"
        let nameSpace = "PirAppBp.Models.Sapsan"
        let fullTypeName = nameSpace+"."+typeName
        result = [...store.getters[requestOptions.getterName][fullTypeName]]
        typeName = "SprSubdivision"
        nameSpace = "SapsanLib.Models"
        fullTypeName = nameSpace+"."+typeName
        let subDiv = [...store.getters[requestOptions.getterName][fullTypeName]]
        result = result.map(function (item) {
          let newItem = {...item}
          let depObj = subDiv.find(o=> o.Id == item.SprSubdivisionId)
          newItem.department = depObj?depObj.ShortName:"Не определен"
          return newItem
       })
       return result
      },
      async LoadDepOrders() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Автоматическое распределение трудозатрат"){

            let requestOptions = this.GetRequesOptionsTemplate()
            requestOptions.typeName = "SprDepOrder"
            requestOptions.nameSpace = "PirAppBp.Models.Sapsan"
            //let fullTypeName = requestOptions.nameSpace+"."+requestOptions.typeName
            await store.dispatch(requestOptions.actionName, requestOptions)
          }
          
        }
      },
       loadDefaultCalendar() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("laborCostContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Календарь нерабочих дней"){

            let calendarWeekends = graph.findVertexByValue("calendarWeekends")
            if (calendarWeekends){

              let dataSource =[]
                let instance = graph.getNodeValue(calendarWeekends.name,"instance")
                if(!instance) return
                let addedRows = instance.data.addedRows

                for (let i = 0; i < weekeds.weekend2024.length; ++i) {
                  const row = weekeds.weekend2024[i]
                  row['Id'] = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16))
                  row.CreatedAt= new Date ()
                  dataSource.push(row)
                  
                }
                [].push.apply(addedRows,dataSource)
                graph.setNodeValue(calendarWeekends.name,"importDataSource",dataSource)
            }
          }
        }
      },
      
      calculateWeekendDays(toDate1){
        let weekendDayCount = 0,
            fromDate = new Date(),
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + toDate1);
     
        while(fromDate <= toDate){
            
            if(fromDate.getDay() === 0 || fromDate.getDay() == 6){

                ++weekendDayCount ;
            }
            fromDate.setDate(fromDate.getDate() + 1);
        }
     
        return weekendDayCount ;
      },
      async loadLetterProtocolsByContract() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Накладные"){

            let mainTreeView = graph.findVertexByValue("mainTreeView")
            if (mainTreeView){
              let selectedTreeData = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
              if(Object.keys(selectedTreeData).length != 0){
                let actionName = "loadLetterProtocols"
                await store.dispatch(actionName, selectedTreeData.Contract)
              }
            }
          }
        }
      },
      async loadContractPropsByContract() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Свойства проекта"){

            let mainTreeView = graph.findVertexByValue("mainTreeView")
            if (mainTreeView){
              let selectedTreeData = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
              if(Object.keys(selectedTreeData).length != 0){
                let actionName = "loadContractProps"
                await store.dispatch(actionName, selectedTreeData.Contract)
              }
            }
          }
        }
      },
      async updateCaseTreeViewItems() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Дело проекта"){
            let thisComp = graph.findVertexByValue("caseTreeView")
            if (thisComp){
              let treeViewInstanceNode = graph.getNodeValue(thisComp.name,"thisInstance")
              if(treeViewInstanceNode){
                let newItems = await treeViewInstanceNode.obj.mCreateChildren(null)
                let treeViewInstance = treeViewInstanceNode.obj.$refs["treeView2"].instance;
                treeViewInstance.option('items', newItems)
              }
            }
          }
        }
      },
      async loadPshPlansByContract() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")

          if(selectedTabName=="План-график"){

            let mainTreeView = graph.findVertexByValue("mainTreeView")
            if (mainTreeView){
              let selectedTreeData = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
              if(Object.keys(selectedTreeData).length != 0){
                let actionName = "loadPshPlans"
                await store.dispatch(actionName, selectedTreeData.Contract)
              }
            }
          }
        }
      },
      async updateOpTreeViewItems() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Генпланы и трассы"){
            let thisComp = graph.findVertexByValue("opTreeView")
            if (thisComp){
              let treeViewInstanceNode = graph.getNodeValue(thisComp.name,"thisInstance")
              if(treeViewInstanceNode){
                let newItems = await treeViewInstanceNode.mCreateChildren(null)
                let treeViewInstance = treeViewInstanceNode.$refs["treeViewOp"].instance;
                treeViewInstance.option('items', newItems)
              }
            }
          }
        }
      }, 
      async updateGlobalOpTreeViewItems() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Генпланы и трассы"){
            let thisComp = graph.findVertexByValue("globalOpTreeView")
            if (thisComp){
              let treeViewInstanceNode = graph.getNodeValue(thisComp.name,"thisInstance")
              if(treeViewInstanceNode){
                let newItems = await treeViewInstanceNode.mCreateChildren(null)
                let treeViewInstance = treeViewInstanceNode.$refs["treeViewGlobalOp"].instance;
                treeViewInstance.option('items', newItems)
              }
            }
          }
        }
      }, 
      async loadTransferTaskViewsByContract() {
        let graph = store.getters.getGraph
        let rootComp = graph.findVertexByValue("complectContent")
        if (rootComp){
          let selectedTabName = graph.getNodeValue(rootComp.name,"selectedTab")
          if(selectedTabName=="Передача заданий"){
            let mainTreeView = graph.findVertexByValue("mainTreeView")
            if (mainTreeView){
              let selectedTreeData = graph.getNodeValue(mainTreeView.name,"selectedTreeData")
              if(Object.keys(selectedTreeData).length != 0){
                let actionName = "loadTransferTaskViews"
                await store.dispatch(actionName, selectedTreeData.Contract)
              }
            }
          }
        }
      },
      
      
}