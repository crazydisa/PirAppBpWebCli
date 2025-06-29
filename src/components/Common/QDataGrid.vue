<template v-if="!!dataSource && !!columns">
    <div class="q-pa-md">
        <q-table
        
        flat bordered
        :ref="myId"
        :title="title"
        :rows="dataSource"
        :columns="columns"
        :row-key="keyExpr"
        :selection="selection"
        :separator="separator"
        :class="myclass"
        :filter="filter"
        :filter-method="filterMethod"
        table-header-style='background-color: #32221a; color: #ffffff'
        autoWidth
        dense
        binary-state-sort

        v-model:selected="dselected"
        @update:selected="onSelection"
        >
<!-- Импровизированные трех-уровневые заголовки таблицы Не красиво, но пока пойдет -->
        <template v-if = "!!use3Dheader" v-slot:header="props" >
        <q-tr :props="props" >
            <q-th  v-if="selection != 'none'"/>
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-black">
                <div v-if="col.h1 != ''" class="text-h6 text-center bg-amber" style="position: relative; margin: 0px; padding: 0px; max-width: 100%; min-height: 200%; max-height: 200%; overflow: hidden;">
                   {{ col.h1 }}
                </div>
            </q-th>
        </q-tr>
        <q-tr :props="props" >
            <q-th  v-if="selection != 'none'"/>
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-black">
                <div v-if="col.h2 != ''" class="text-h6 text-center bg-amber " >
                    {{ col.h2 }}
                </div>
            </q-th>
        </q-tr>
        <q-tr :props="props" >
            <q-th class="text-black bg-amber"  v-if="selection != 'none'"/>
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-black bg-amber">
                <div class="text-h6 text-center">
                    {{ col.label }}
                </div>
                    

                
            </q-th>
        </q-tr>
        </template>
<!-- Шаблоны ячеек в зависимости от типа ячейки (date, string, number, list (это q-select)) -->
        <template v-slot:body-cell="props">
            <q-td 
            :props="props"
            >
<!-- Шаблон для вывода да-нет -->
                <div v-if="!!(props.colsMap[props.col.name].dataType==='boolean')">
                    <div class="q-pa-md">
                        <q-checkbox 
                        dense 
                        v-model="props.row[ props.col.name ]" />
                    </div>
                </div>
<!-- Шаблон для вывода даты -->
                <div style="min-width: 200px" v-if="!!(props.colsMap[props.col.name].dataType==='date')">
                    <div   style="max-width: 300px">
                        <q-input v-if="!!cDataFieldsList"  
                        hide-bottom-space
                        :readonly="true" 
                        :error="props.colsMap[props.col.name].rule? props.colsMap[props.col.name].rule(props): false"
                        label="дата" 
                        dense 
                        filled >
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="cDataFieldsList[props.row.Id][ props.col.name ]" 
                                    first-day-of-week="1"
                                    mask='DD.MM.YYYY'
                                    @update:model-value="(a) => onDateChanged(a,props)" >
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                            <template v-if="!!cDataFieldsList" v-slot:label>
                                {{cDataFieldsList[props.row.Id]?cDataFieldsList[props.row.Id][ props.col.name ]:""}}
                                <!-- {{formatter.format(props.row[ props.col.name ])}} -->
                            </template>
                        </q-input>
                    </div>
                </div>
<!-- Шаблон для строкового типа -->
                <div v-if="!!(props.colsMap[props.col.name].dataType==='string')">
                        <q-input 
                        
                        :bottom-slots="true"
                        v-model="props.row[ props.col.name ]" 
                        
                        :readonly="props.colsMap[props.col.name].readonly? props.colsMap[props.col.name].readonly: false"
                        dense 
                        borderless >
                        <template v-slot:append v-if="!!props.colsMap[props.col.name].append">
                            ({{ props.colsMap[props.col.name].append(props) }})
                        </template>
                        <template v-slot:hint v-if="!!useStringCellsHint">
                            {{props.row[ props.col.name+"-hint"]}}
                        </template>
                        </q-input> 
                    <!-- {{props.row[ props.col.name ]}} -->
                </div>
<!-- Шаблон для числового типа -->
                <div v-if="!!(props.colsMap[props.col.name].dataType==='number')">
                        <q-input 
                        
                        :no-error-icon="noErrorIcon"
                        v-model.number="props.row[ props.col.name ]" 
                        @update:model-value="props.colsMap[props.col.name].onUpdate? props.colsMap[props.col.name].onUpdate(props): ()=>null"
                        :error="props.colsMap[props.col.name].rule? props.colsMap[props.col.name].rule(props): false"
                        
                        :readonly="props.colsMap[props.col.name].readonly? props.colsMap[props.col.name].readonly: false"
                        dense 
                        borderless >
                        
                        <template v-slot:hint v-if="!!useNumberCellsHint">
                            {{props.row[ props.col.name+"-hint" ]}}
                        </template>
                        <template v-slot:error v-if="!!useNumberCellsHint">
                            <span style="background-color:crimson; color: black;">{{props.row[ props.col.name+"-hint" ]}} !!!</span>
                            
                        </template>
                        </q-input> 
                    <!-- {{props.row[ props.col.name ]}} -->
                </div>
<!-- Шаблон для списка -->
                <div v-if="!!(props.colsMap[props.col.name].dataType==='list')">
                    <div >
                        <q-select 
                            v-model="props.row[props.col.name]" 
                            :options="props.colsMap[props.col.name].lookup.dataSource.filter(v => v[props.colsMap[props.col.name].lookup.valueExpr].toLowerCase().indexOf(cGridColumns[props.col.name]?cGridColumns[props.col.name].filterStr: '') > -1)" 
                            use-input
                            hide-selected
                            fill-input
                            input-debounce="0"
                            dense
                            emit-value
                            map-options
                            option-value="Id" 
                            :option-label="props.colsMap[props.col.name].lookup.valueExpr"
                            v-on:filter="(a,b,c) => filterFn(a,b,c,props)"
                        />
                        <!-- {{props.row[ props.col.name ]}} -->
                    </div>
                </div>
            </q-td>
        </template>
           
<!-- В шапке таблице поместим кнопки add, remove, save -->
        <template v-slot:top-left>
            <div class="q-pa-md q-gutter-sm">
                <h3>{{ title }}</h3><br>
                <div  v-for="(item, index) in buttons" v-bind:key="index">  
                <q-btn v-if="!item.disable"
                    class="bg-amber text-black"
                    :label="item.label"
                    :icon="item.icon"
                    @click="click"/>
                </div>
                <!-- Кнопка добавления строк -->
                <q-btn v-if="!disableButtons.addRow" class="bg-amber text-black"  :disable="loading" label="Добавить строку" icon="add" @click="addRow" />
                <!-- Кнопка сохранения -->
                <q-btn v-if="!disableButtons.save" class="bg-amber text-black" :disable="emptyToSave" label="Сохранить в базу" icon="save" @click="save" />
                <!-- Кнопка удаления строк (всех выделенных) -->
                <q-btn v-if="dselected.length>0 && !disableButtons.removeRow" class="bg-amber text-black" :disable="loading" label="Удалить строку" @click="removeRow" />
                <!-- Произвольные кнопки -->
                <div  v-for="(item, index) in customButtons" v-bind:key="index">  
                    <q-btn v-if="!!item.disable" 
                        :loading="item.progress.loading" 
                        :percentage="item.progress.percentage" 
                        class="bg-amber text-black" color="text-black bg-amber" 
                        :disable="item.disable('editSave')" 
                        :label="item.lable" 
                        @click="() => item.buttonClick(item.lable)">
                        <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                                Выполняю...
                        </template>
                    </q-btn>
                </div>
            
            </div>
        </template> 
        <template v-slot:no-data="{ }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          
          <!-- <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" /> -->
        </div>
      </template>
        <template v-slot:top-right>
        <q-input 
            borderless 
            dense 
            debounce="300" 
            v-model="filter" 
            placeholder="Поиск" 
            
            :autofocus="true">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
        </q-input>
      </template>
            
        </q-table>
    </div>
</template>
<script>
// const dateOptions = {
//             year: 'numeric', month: 'numeric', day: 'numeric',
//             hour: 'numeric', minute: 'numeric', second: 'numeric',
//             //timeZoneName: 'long',
//             //timeZone: 'UTC'
//         }

function withoutRows(item){
    let removed = this.rows.find(o=> o['Id'] == item['Id'])
    if(removed)
        return false
    else
        return true
}

import {  ref, toRef, toRaw,  } from 'vue';
//getCurrentInstance
export default {
 props: {
    
    userStateKey: {
        type: String,
        default: () => null
    },
    myId: {
        type: String,
        default: () => "myDataGrid"
    },
    sortBy: {
        type: String,
        default: () => null
    },
    
    myclass: {
        type: String,
        default: () => ""
    },
    objectType: {
      type: Object,
      default: () => null
    },
    buttons:{
      type: Array,
      default: () => []
    },
    customButtonProgress: {
      type: Object,
      default: () => {return { loading: false, percentage: 0 }}
    },
    disableButtons: {
      type: Function,
      default: () => function() {return {addRow: false, save: false, removeRow: false}}
    },
    customButtons: {
      type: Function,
      default: () => function() {return [{name:"customButtons", lable: "кнопка", enable: false}]}
    },
    selection: {
        type: String,
        default: () => "none"
    },
    requestOptions: {
      type: Object,
      default: () => null
    },
    title: {
        type: String,
        default: () => ""
    },
    logMenuEnabled: {
        type: Boolean,
        default: () => false
    },
    logTypeName: {
        type: String,
        default: () => null
    },
    logTypeFieldName: {
        type: String,
        default: () => "LogTypeName"
    },
    logKeyExpr: {
        type: String,
        default: () => "Id"
    },

    width: {
        type: String,
        default: () => null
    },
    height: {
        type: String,
        default: () => null
    },

    showColumnChooser: {
        type: Boolean,
        default: () => false
    },
    use3Dheader: {
        type: Boolean,
        default: () => false
    },
    
    showReorderButton: {
        type: Boolean,
        default: () => false
    },
    showWordWrapButton: {
        type: Boolean,
        default: () => false
    },
    showRefreshButton: {
        type: Boolean,
        default: () => false
    },
    showResetFiltersButton: {
        type: Boolean,
        default: () => false
    },
    showSearchPanel: {
        type: Boolean,
        default: () => false
    },
    showFilterRow: {
        type: Boolean,
        default: () => false
    },
    showPageSelector: {
        type: Boolean,
        default: () => false
    },
    showEditorByRowClick: {
        type: Boolean,
        default: () => false
    },

    allowColumnResizing: {
        type: Boolean,
        default: () => false
    },
    allowColumnFixing: {
        type: Boolean,
        default: () => false
    },
    allowPaging: {
        type: Boolean,
        default: () => true
    },
    
    allowAdding: {
        type: Boolean,
        default: () => false
    },
    allowUpdating: {
        default: () => false
    },
    allowDeleting: {
        default: () => false
    },
    allowGrouping: {
        type: Boolean,
        default: () => false
    },
    allowMasterDetail: {
        type: Boolean,
        default: () => false
    },
    useNumberCellsHint: {
        type: Boolean,
        default: () => false
    },
    useStringCellsHint: {
        type: Boolean,
        default: () => false
    },
    noErrorIcon: {
        type: Boolean,
        default: () => false
    },
    
    parentData: {
        type: Object,
        default: () => null
    },
    columns: {
        type: Array,
        default: () => []
    },
    summary: {
        type: Object,
        default: () => null
    },
    dataSource: {
        default: () => null
    },
    selectedRowKeys: {
        type: Array,
        default: () => null
    },
    
    keyExpr: {
        type: String,
        default: () => "Id"
    },

    editingMode: {
        type: String,
        default: () => "none"
    },
    editingFormTitle: {
        type: String,
        default: () => null
    },
    
    separator: {
        type: String,
        default: () => "horizontal"
    },
    editingFormWidth: {
        type: String,
        default: () => null
    },
    editingFormHeight: {
        type: String,
        default: () => null
    },
    editingFormItems: {
        type: Array,
        default: () => null
    },
    editingFormColCount: {
        type: Number,
        default: () => 2
    },

    selectionMode: {
        type: String,
        default: () => "single"
    },
    selectFirstRow: {
        type: Boolean,
        default: () => false
    },

    exportEnabled: {
        type: Boolean,
        default: () => false
    },
    exportFileName: {
        type: String,
        default: () => null
    },

    wordWrapEnabled: {
        type: Boolean,
        default: () => true
    },
    pageSize: {
        type: Number,
        default: () => 20
    },


    fileDownloadNameExpr: {
        type: String,
        default: () => null
    },

    fileDownloadUrl: {
        type: Function,
        default: () => null
    },

    fileUploadUrl: {
        type: Function,
        default: () => null
    },

    onFileUploaded: {
        type: Function,
        default: () => function() {}
    },


    onToolbarPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContextMenuPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContentReady: {
        type: Function,
        default: () => function() {}
    },

    onRowPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellClick: {
        type: Function,
        default: () => function() {
        
        }
    },

    onInitNewRow: {
        type: Function,
        default: () => function() {}
    },
    onEditingStart: {
        type: Function,
        default: () => function() {}
    },
    onOptionChanged: {
        type: Function,
        default: () => function() {}
    },

    onEditorPreparing: {
        type: Function,
        default: () => function() {}
    },
    onRowValidating: {
        type: Function,
        default: () => function() {}
    },

    onRowExpanded: {
        type: Function,
        default: () => function() {}
    },
    onRowCollapsed: {
        type: Function,
        default: () => function() {}
    },

    onRowInserting: {
        type: Function,
        default: () => function() {}
    },
    onRowInserted: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdating: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdated: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoving: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoved: {
        type: Function,
        default: () => function() {}
    },
    onReordering: {
        type: Function,
        default: () => function() {}
    },
    onRefreshing: {
        type: Function,
        default: () => function() {}
    },
    onSelectionChanged: {
        type: Function,
        default: () => function() {
        
        }
    },
    onResetFiltersButton: {
        type: Function,
        default: () => null
    },
    onExported: {
        type: Function,
        default: () => function() {}
    },
    getAddedRows: {
        type: Function,
        default: () => null
    },
    getDeletedRows: {
        type: Function,
        default: () => null
    },
    getChangedRows: {
        type: Function,
        default: () => null
    },
    selected: {
        type: Array,
        default: () => []
    },
    addedRows: {
        type: Array,
        default: () => []
    },
    deletedRows: {
        type: Array,
        default: () => []
    },
    changedRows: {
        type: Array,
        default: () => []
    },
  },

  methods:{
    //Фильтр и загрузка в ячейку q-select таблицы. props - параметр добавленный вручную, в нем хранятся данные типа для загрузки
     async filterFn(val, update, abort,props){ //val - введенный символ, update - функция тригер запускает обновление q-select
        // Условие - если данные еще не загружались с бэкэнда, то загружаем, иначе даные в store уже есть и загружать не нужно
        console.log("props.colsMap[props.col.name]",props.colsMap[props.col.name])
        console.log("props.colsMap",props.colsMap)
        if(!this.gridColumns[props.col.name].isLoaded) { 
            let requestOptions = this.cRequestOptions
            const actionName = requestOptions.actionName
            requestOptions.typeName = props.colsMap[props.col.name].prop.TypeName
            requestOptions.nameSpace = props.colsMap[props.col.name].prop.NameSpace
            //Загружаем данные в store
            await this.$store.dispatch(actionName,requestOptions)
            //Ставим пометку что данные для этой ячейки q-select загружены, что бы в следующий раз не загружать сова
            this.gridColumns[props.col.name].isLoaded = true
        }
        update(() => {
            this.gridColumns[props.col.name].filterStr = val.toLowerCase()
        })
    },
    filterMethod(rows, terms, cols){
        let result = []
        let addedRows = {}
        for(let i =0;i<cols.length; i++){
            let field = cols[i].field
            let colType = cols[i].dataType
            let displayExprForList = null
            let typeNameForList = null
            let nameSpaceForList = null
            if(cols[i].prop){
                if(cols[i].prop.DisplayExpr){
                    displayExprForList = cols[i].prop.DisplayExpr
                }
                if(cols[i].prop.TypeName){
                    typeNameForList = cols[i].prop.TypeName
                }
                if(cols[i].prop.NameSpace){
                    nameSpaceForList = cols[i].prop.NameSpace
                }
            }
            for(let j = 0; j< rows.length; j++){
                let row = rows[j]
                if(!addedRows[row.Id]){
                    for (let key of Object.keys(row)) {
                        let propValue = row[key]
                        if(propValue){
                            if(key == field){
                                if(colType == "string"){
                                    if(propValue.toLowerCase().includes(terms.toLowerCase())){
                                        addedRows[row.Id]=true
                                        result.push(row)
                                    }
                                }
                                else if(colType == "number"){
                                    if(propValue.toString().includes(terms.toLowerCase())){
                                        addedRows[row.Id]=true
                                        result.push(row)
                                    }
                                }
                                else if(colType == "list"){
                                    if(displayExprForList && typeNameForList && nameSpaceForList){
                                        const getterName = this.requestOptions.getterName
                                        const typeName = typeNameForList
                                        const nameSpace = nameSpaceForList
                                        const fullTypeName = nameSpace+"."+typeName
                                        let getter = this.$store.getters[getterName]
                                        if(getter){
                                            if(getter[fullTypeName]){
                                                let item = getter[fullTypeName].find(o => o.Id == propValue)
                                                if(item){
                                                    let dispVal = item[displayExprForList]
                                                    if(dispVal){
                                                        if(dispVal.toLowerCase().includes(terms.toLowerCase())){
                                                            addedRows[row.Id]=true
                                                            result.push(row)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return result;
    },

    

    getCellValue(col, row){
        if(row)
            return row.Id
        else
            return null
    },
    onDateChanged(date, props){
      let asDate = window.dt.parse(date)
      props.row[ props.col.name ] = asDate
    },
    onSelection(){
        this.anySelect=this.dselected.length==0? false:true
        console.log("this.anySelect = ", this.anySelect)
        //Отправляем событие вверх что в таблице есть или нет выделенных строк. В параметрах id -этого компонента и сам признак выделения
        //Это событие в основном нужно для того чтобы сделать кнопки активными в зависимости от выделения или нет, строк
        this.$emit('q-data-grid-selection', {selected: this.dselected, senderProps: this.$props, type: this.objectType, state: this.anySelect})
    },

    addRow () { //Обработчик кнопки добавления строки в таблицу
        let row = {}
        //Генерируем какой нибудь id строки, при сохранении в базу этот поддельный id удалим
        row['Id'] = this.uuidv4()
        //Т.к используется один контроллер для добавления изменения и удаления, то в поле самой строки указываем что она добавлена
        row.CreatedAt= new Date ();
        //Добавляем новую строку в список добавленных
        [].push.apply(this.daddedRows, [row])
        //Добавляем новую строку в табличные данные
        this.tableData.push(row)
        //Вешаем на новую строку наблюдатель изменения
        this.$watch(()=>toRef(row), this.handleChange, {deep: true})
        this.$emit('q-data-grid-added-row',{myId: this.myId, addedRows:this.daddedRows})
    },

   

   
    removeRow(){
       
        let newDeletedRows = this.dselected.map((row) =>{
            let newRow = {...row}
            newRow.DeletedAt = new Date ()
            return newRow
        });
           
        //---Заносим выбранные в список удаляемых
        [].push.apply( this.ddeletedRows, newDeletedRows)
        //---удаляем строки из общих данных
        let copyDataRows=this.tableData.slice(); //copy
        this.tableData.length=0;
        //this.tableData.push(...copyDataRows.filter(this.withoutDeleted, this.ddeletedRows))
        [].push.apply( this.tableData, copyDataRows.filter(withoutRows, {rows: newDeletedRows}))
        //---удаляем из списка добавленных по кнопке
        let copyAddedDataRows=this.daddedRows.slice(); //copy
        this.daddedRows.length=0;
        [].push.apply( this.daddedRows, copyAddedDataRows.filter(withoutRows,  {rows:this.ddeletedRows}))
        //---удаляем из списка измененных
        let copyChangedRows=this.dchangedRows.slice(); //copy
        this.dchangedRows.length=0;
        [].push.apply( this.dchangedRows, copyChangedRows.filter(withoutRows, {rows:this.ddeletedRows}))
        //очищаем селектер
        this.dselected.length=0;
        this.$emit('q-data-grid-change-state',{ myId:this.myId, addedRows:this.daddedRows, 
        changedRows:this.dchangedRows, deletedRows:this.ddeletedRows})
        //--включаем кнопку сохранения
        this.emptyToSave = false
    },
    //Генератор временных id
    uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        )
    },
    //Событие для какой нибудь кнопки
    customButtonHandler(e){
        this.$emit('q-data-grid-custom-button-handler', {item: this.dselected, senderProps: this.$props, type: this.objectType, name: e})
    },

    save(){
        //==========Обработка измененных строк==================
        //Убираем из измененных строк удаленные и добавленные (новые не сохраненные)
        let changedRows = this.tableData.filter( (row)=> {
                let changedRow = this.dchangedRows.find(o=> o['Id'] == row['Id'])
                let deletedRow = this.ddeletedRows.find(o=> o['Id'] == row['Id'])
                let addedRow = this.daddedRows.find(o=> o['Id'] == row['Id'])
                if(changedRow && !deletedRow && !addedRow)
                  return true
                else
                  return false
              })
        //Отправляем в базу через QObjectDataGrid измененные строки
        for (let i = 0; i < changedRows.length; ++i) {
            const row = changedRows[i]
            this.onRowUpdating({oldData: row, newData: row, requestOptions:this.cRequestOptions})
        }
        //======================================================

        //=========Обработка удаляемых строк====================
        //Убираем из удаляемых (новые) добавленные вручную строки
        let deletedRows = this.ddeletedRows.filter( (row) => {
                let addedRow = this.daddedRows.find(o=> o['Id'] == row['Id'])
                if(!addedRow)
                  return true
                else
                  return false
              })
        //Отправляем в базу через QObjectDataGrid удаляемые строки
        for (let i = 0; i < deletedRows.length; ++i) {
            const row = deletedRows[i]
            
            this.onRowUpdating({oldData: row, newData: row, requestOptions:this.cRequestOptions})
        }
        //======================================================

        //===========Обработка добавленных строк================
        //Для верности проверяем что бы добавленных небыло среди удаленных строк
        let addedRows = this.tableData.filter( (row) => {
                let deletedRow = this.ddeletedRows.find(o=> o['Id'] == row['Id'])
                let addedRow = this.daddedRows.find(o=> o['Id'] == row['Id'])
                if(addedRow && !deletedRow)
                  return true
                else
                  return false
              })
        this.daddedRows = addedRows
        //Убираем из таблицы строки с поддельными id, т.к. после сохранения вернуться строки с настоящими id
        let copyDataRows=this.tableData.slice(); //copy
        this.tableData.length=0;
        [].push.apply( this.tableData, copyDataRows.filter(withoutRows, {rows:addedRows}));
        //Сохраняем в базу добавленные (новые) строки
        for (let i = 0; i < addedRows.length; ++i) {
            const row = addedRows[i]
            row.Id = 0
            this.onRowUpdating({oldData: row, newData: row, requestOptions:this.cRequestOptions})
        }
        //======================================================
        //Обнуляем все доп. списки
        this.dchangedRows.length=0;
        this.ddeletedRows.length=0;
        this.daddedRows.length=0;
        this.dselected.length=0;
        this.$emit('q-data-grid-change-state',{ myId:this.myId, addedRows:this.daddedRows, 
        changedRows:this.dchangedRows, deletedRows:this.ddeletedRows})
        //Отключаем кнопку сохранения
        this.emptyToSave = true
    },
     handleChange (newVal) { //Обработчик изменения строки
    //Включаем кнопку сохранения
      this.emptyToSave = false
      const row = toRaw(newVal.value)
      //Если в списке измененных нет такой строки, то добавляем , иначе заменяем
      const hasRow = this.dchangedRows.find(r => r.Id === row.Id)
      if (hasRow==undefined){
        [].push.apply(this.dchangedRows, [row])
      }
      else{
        this.dchangedRows.map(r => r.Id===row.Id?row:r)
      }
        
      
    },
    collectDataField(){
        let dateColumns = this.columns.filter((col) => col.dataType == "date")
        
        for(let j=0; j< this.tableData.length; j++){
            let row = this.tableData[j]
            if(!row["Id"] || row["Id"]==0){
                row["Id"] = this.uuidv4()
            }
            for (let i = 0; i < dateColumns.length; ++i) {
                let dateCol = dateColumns[i]
                let key = dateCol.field
                
                if(key in row){
                   

                    if(row[key] instanceof Date) {
                        let formattedDateStr = row[key].toLocaleDateString('ru-RU', {day: "numeric",month: "numeric",year: "numeric",}).split(',')[0]
                        if(this.dataFieldsList[row.Id]){
                            this.dataFieldsList[row.Id][key] = formattedDateStr
                        }
                        else{
                            this.dataFieldsList[row.Id] = {[key]:formattedDateStr}
                        }
                    }

                }
                else
                {
                    let date = new Date()
                    date.setHours(0,0,0,0)
                    let formattedDateStr = date.toLocaleDateString('ru-RU', {day: "numeric",month: "numeric",year: "numeric",}).split(',')[0]
                    this.dataFieldsList[row.Id] = {[key]:formattedDateStr}
                    row[key] = date
                }
            }
        }
        
        for (let key of Object.keys(this.dataFieldsList)) {
            let isExsist = this.tableData.find(o => o.Id == key)
            if(!isExsist){
                delete this.dataFieldsList[key]
            }
        }
        console.log("dataFieldsList",this.dataFieldsList)
    }
 },
 computed: {
    
        cDataFieldsList(){
            if (Object.keys(this.dataFieldsList).length == 0) {
                return null
            }
            else{
                return this.dataFieldsList
            }
            
        },
        formattedDate(){
            return this.formatter.format(new Date())
        },
        cGridColumns(){
            return this.gridColumns
        },
        mDataSource(){
            return this.rows
        },
        cRequestOptions(){
            let requestOptions = {...this.requestOptions}
            if(this.objectType){
                requestOptions.typeName = this.objectType.Name
                requestOptions.nameSpace = this.objectType.NameSpace
            }
            if ('actionName' in requestOptions) {
                if(!requestOptions.actionName)
                    requestOptions.actionName = "loadAnyObjects"
            }
            else{
                requestOptions.actionName = "loadAnyObjects"
            }
            return requestOptions
        },
        cGetAddedRows(){
            if(!this.getAddedRows()){
                return this.daddedRows
            }
            else{
                return this.getAddedRows()
            }
        },
        cGetDeletedRows(){
            if(!this.getDeletedRows()){
                return this.ddeletedRows
            }
            else{
                return this.getDeletedRows()
            }
        },
        cGetChangedRows(){
            if(!this.getChangedRows()){
                return this.dchangedRows
            }
            else{
                return this.getChangedRows()
            }
        },
    },

 data() {
    return {
        //Включение\Отключение кнопки Сохранить в базу
        emptyToSave: true,
        //Что то выбрано отправляем в событии select
        anySelect: true,
        daddedRows: [],
        dchangedRows: [],
        ddeletedRows: [],
        gridColumns: {},
        tableData: [],
        dataFieldsList: ref({}),
        dselected: [],
        filter: ref(''),
        isEmpty: true,
    }},

  watch: {
      columns: {
        handler() {
            for (let i = 0; i < this.columns.length; ++i) {
                const column = this.columns[i]
                this.gridColumns[column.name]={filterStr: "",isLoaded: this.gridColumns[column.name]? this.gridColumns[column.name].isLoaded: false}
            }
        } 
    },
     
      tableData: {
        handler() {
            
            if( this.$refs[this.myId]){
                let rows = this.$refs[this.myId].rows
                if(rows.length!=0 && this.isEmpty==true){
                    this.$emit('q-tabledata-changed-handler', {myId:this.myId, isEmpty: false})
                    this.isEmpty = false
                }
                if(rows.length == 0 && this.isEmpty==false){
                    this.$emit('q-tabledata-changed-handler', {myId:this.myId, isEmpty: true})
                    this.isEmpty = true
                }
                for (let i = 0; i < rows.length; ++i) {
                    let row = toRef(rows[i])
                    this.$watch(()=>row, this.handleChange, {deep: true})
                }
            }
            
            if(this.daddedRows.length!=0){

                let filteredAdded = this.daddedRows.filter( (row) => {
                let actualRow = this.tableData.find(o => o[this.keyExpr] == row[this.keyExpr])
                if(actualRow)
                  return true
                else
                  return false
                })
                this.daddedRows.length = 0
                for (let i = 0; i < filteredAdded.length; ++i) {
                    this.daddedRows.push(filteredAdded[i])
                }
                this.$emit('q-data-grid-change-state',{ myId:this.myId, addedRows:this.daddedRows, 
                            changedRows:this.dchangedRows, deletedRows:this.ddeletedRows})
            }
            this.collectDataField()
            console.log("this.tableData",this.tableData)
            console.log("this.columns",this.columns)
            console.log("dataFieldsList",this.dataFieldsList)
            console.log("this.addedRows",this.daddedRows)
        },
        deep: true
      }
  },
  renderTracked(){
    //  this.anySelect=this.dselected.length==0? false:true
    // //     //Отправляем событие вверх что в таблице есть или нет выделенных строк. В параметрах id -этого компонента и сам признак выделения
    // //     //Это событие в основном нужно для того чтобы сделать кнопки активными в зависимости от выделения или нет, строк
    //      this.$emit('q-data-grid-selection', {item: this.dselected, senderProps: this.$props, type: this.objectType, state: this.anySelect})
  },
  mounted() {
    console.log("this.dataSource grid",this.dataSource)
    console.log("this.columns grid",this.columns)
    for (let i = 0; i < this.columns.length; ++i) {
        const column = this.columns[i]
        this.gridColumns[column.name]={filterStr: "",isLoaded: false}
    }
    this.tableData = toRef(this.$refs[this.myId],'rows')
    
    this.collectDataField()
    
    this.$emit('q-data-grid-mounted', { myId:this.myId})
  },
  
//   onUpdated() {
//       let instance = getCurrentInstance()
//       console.log(instance)
//       console.log("updated!")
//     },

//     onUnmounted() {
//       let instance = getCurrentInstance()
//       console.log(instance)
//       console.log("unmounted!")
//     }
}

</script>
<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  td:first-child
    background-color: #00b4ff

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1

    
</style>