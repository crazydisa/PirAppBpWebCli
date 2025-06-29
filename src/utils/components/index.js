import store from '@/store';
import localizeFilter from '@/localize';
import utils from "@/utils";

export default {
    toolbarInsertItem(e, item) {
        item.locateInMenu = "auto";
        e.toolbarOptions.items.unshift(item);
    },
    toolbarInsertButton(e, options) {
        if("text" in options) options.text = localizeFilter(options.text);
        if("hint" in options) options.hint = localizeFilter(options.hint);
        this.toolbarInsertItem(e, {
            location: "after",
            widget: "dxButton",
            options
        });
    },
    toolbarAddItem(e, item) {
        item.locateInMenu = "auto";
        let itemPosition;
        if(e.toolbarOptions.items.find(item => item.name == "searchPanel")) {
            itemPosition = e.toolbarOptions.items.length - 1;
        }
        else {
            itemPosition = e.toolbarOptions.items.length;
        }
        e.toolbarOptions.items.splice(itemPosition, 0, item);
    },
    toolbarAddButton(e, options) {
        if("text" in options) options.text = localizeFilter(options.text);
        if("hint" in options) options.hint = localizeFilter(options.hint);
        this.toolbarAddItem(e, {
            location: "after",
            widget: "dxButton",
            options
        });
    },
    toolbarAddRefreshButton(e, callback) {
        this.toolbarAddButton(e, {
            icon: "refresh",
            hint: "Refresh",
            onClick: () => {
              if(callback) callback();
            }
        });
    },
    toolbarAddResetFiltersButton(e, callback) {
        this.toolbarAddButton(e, {
            icon: "clear",
            hint: "ClearFilters",
            onClick: async () => {
                e.component.state(null);
                if(callback) callback();
            }
        });
    },

    hideSaveButton() {
        const btnLabel = localizeFilter("Save");
        setTimeout(function() {
            var elems = document.getElementsByClassName("dx-button");
            if(elems) {
                for(let i in elems){  
                    const elem = elems[i];
                    if(elem instanceof HTMLDivElement) {
                        const label = elem.getAttribute("aria-label");
                        if(label == btnLabel) {
                            elem.setAttribute("style", "visibility: hidden"); 
                        }
                    }
                }
            }
        }, 0);
    },

   

    getObjectTypeFormItems(objectType, customFormItems, autoFormData) {
        let formItems = [];
        const columns = this.getObjectTypeColumns(objectType, customFormItems, autoFormData);
        const isGroupExists = columns.filter(column => column.prop && column.prop.GroupTitle).length > 0;
        let groupItem;
        let subGroupItem;
        for(let i in columns) {
            const column = columns[i];
            const visible = column.formItem ? column.formItem.visible : column.visible === undefined ? true : column.visible;
            if(visible) {
                if(isGroupExists) {
                    const groupCaption = (column.prop && column.prop.GroupTitle) ? column.prop.GroupTitle : "";
                    const subGroupCaption = (column.prop && column.prop.SubGroupTitle) ? column.prop.SubGroupTitle : "";

                    if(!groupItem || groupItem.caption != groupCaption) {
                        groupItem = {
                            itemType: 'group',
                            caption: groupCaption,
                            items: []
                        };
                        formItems.push(groupItem);
                        subGroupItem = null;
                    }
                    
                    if(subGroupCaption) {
                        if(!subGroupItem || subGroupItem.caption != subGroupCaption) {
                            subGroupItem = {
                                itemType: 'group',
                                caption: subGroupCaption,
                                items: []
                            };
                            groupItem.items.push(subGroupItem);
                        }
                        subGroupItem.items.push(column);
                    }
                    else {
                        groupItem.items.push(column);
                    }
                } 
                else {
                    formItems.push(column);
                }
            }
        }
        // console.log("KitCollection formItems", formItems);
        return formItems;
    },
    getObjectTypeDataGridColumns(objectType, customColumns, autoColumns) {
        let objectTypeColumns = [];
        let columns = this.getObjectTypeColumns(objectType, customColumns, autoColumns);
        let groupColumn;
        let subGroupColumn;
        for(let i in columns) {
            const column = columns[i];
            let isGroup = false;
            let isSubGroup = false;
            if(column.prop) {
                if(column.prop.GroupTitle) {
                    if(!groupColumn || groupColumn.caption != column.prop.GroupTitle) {
                        groupColumn = {
                            caption: column.prop.GroupTitle,
                            alignment: "center",
                            columns: []
                        };
                        objectTypeColumns.push(groupColumn);
                        subGroupColumn = null;
                    }
                    isGroup = true;
                }
                if(groupColumn && column.prop.SubGroupTitle) {
                    if(!subGroupColumn || subGroupColumn.caption != column.prop.SubGroupTitle) {
                        subGroupColumn = {
                            caption: column.prop.SubGroupTitle,
                            alignment: "center",
                            columns: []
                        };
                        groupColumn.columns.push(subGroupColumn);
                    }
                    isSubGroup = true;
                }
            }
            if(isSubGroup && subGroupColumn) {
                subGroupColumn.columns.push(column);
            }
            else if(isGroup && groupColumn) {
                groupColumn.columns.push(column);
            }
            else {
                objectTypeColumns.push(column);
                groupColumn = null;
                subGroupColumn = null;
            }
        }

        return objectTypeColumns;
    },
    getObjectTypeColumns(objectType, columns, autoColumns) {
        // objectType   - тип объекта
        // columns      - заданные столбцы вывода в таблицу/форму 
        // autoColumns  - Да - автоматически добавляются все столбцы из свойств объекта с заменой значений атрибутов указанных в columns
        //                Нет - добавляются только столбцы перечисленные в columns, дополнительно заполенные атрибутами из соответствующих свойств объекта            
        
        let typeColumns = [];

        let typeProperties = [];
        for(let i in objectType.Properties) {
            const typeProp = { ...objectType.Properties[i]};
            const column = (columns != null ? columns.find(col => col.dataField == typeProp.Name) : null);
            let isAdd = !!column || autoColumns;
            if(typeProp.IsIdentifier) {
                let objPropName
                
                objPropName = typeProp.RelatedField!=null ? typeProp.RelatedField: null;
                
                if (objPropName==null){
                    objPropName = typeProp.Name.endsWith("Id") ? typeProp.Name.substring(0, typeProp.Name.length - 2) : null;
                }
                if (objPropName==null){
                    objPropName = typeProp.Name.startsWith("Id") && !typeProp.Name.endsWith("Navigation") ? typeProp.Name + "Navigation" : null;
                }
                const objProp =  objectType.Properties.find(prop => prop.Name == objPropName);
                const objColumn = (columns != null ? columns.find(col => col.dataField == objPropName) : null);
                if(objProp) {
                    typeProp.Title = objProp.Title;
                    if(objColumn || autoColumns) {
                        isAdd = !objProp.IsInclude;
                    }
                }
            }
            else if(typeProp.IsObject) {
                let idPropName
                
                idPropName = typeProp.RelatedField!=null ? typeProp.RelatedField: null;
                
                if (idPropName==null){
                    idPropName = !typeProp.Name.startsWith("Id") && !typeProp.Name.endsWith("Navigation") ? typeProp.Name + "Id" : null;
                }
                if (idPropName==null){
                    idPropName = typeProp.Name.startsWith("Id") && typeProp.Name.endsWith("Navigation") ? typeProp.Name.substring(0, typeProp.Name.length - 10) : null;
                }
                const idProp =  objectType.Properties.find(prop => prop.Name == idPropName);
                const idColumn = (columns != null ? columns.find(col => col.dataField == idPropName) : null);
                if(idProp) {
                    if(idColumn || autoColumns) {
                        isAdd = typeProp.IsInclude;
                    }
                }
            }

            if(isAdd) {
                typeProperties.push(typeProp);
            }
        }

        // console.log("typeProperties", typeProperties)

        if(objectType && typeProperties) {
            if(columns && !autoColumns) {
                for(let i in columns) {
                    const column = columns[i];
                    const typeProp = typeProperties.find(prop => prop.Name == column.dataField);
                    const objTypeColumn = this.getObjectTypeColumn(typeProp);
                    if(objTypeColumn) {
                        let typeColumn = {...objTypeColumn};
                        for(let prop in column) {
                            if(prop != "dataField") {
                                typeColumn[prop] = column[prop];
                            }
                        }
                        typeColumns.push(typeColumn);
                    }
                    else {
                        column.allowEditing = false;
                        typeColumns.push(column);
                    }
                }
            }
            else {
                for(let i in typeProperties) {
                    const typeProp = typeProperties[i];
                    const objTypeColumn = this.getObjectTypeColumn(typeProp);
                    if(objTypeColumn) {
                        let isFieldColumn = false;
                        if(columns && autoColumns) {
                            const fieldColumns = columns.filter(col => col.dataField == typeProp.Name);
                            isFieldColumn = (fieldColumns.length > 0);
                            if(isFieldColumn) {
                                for(let j in fieldColumns) {
                                    const typeColumn = {...objTypeColumn};
                                    const column = fieldColumns[j];
                                    if(column) {
                                        for(let prop in column) {
                                            if(prop != "dataField") {
                                                typeColumn[prop] = column[prop];
                                            }
                                        }
                                    }
                                    typeColumns.push(typeColumn);
                                }
                            }
                        }
                        if(!isFieldColumn) {
                            const typeColumn = {...objTypeColumn};
                            typeColumns.push(typeColumn);
                        }
                    }
                }
            }
        }
        // console.log("typeColumns", objectType.Name, {objectType, columns, typeColumns})
        return typeColumns;
    },
    qGetObjectTypeColumns(objectType, columns, autoColumns) {
        // objectType   - тип объекта
        // columns      - заданные столбцы вывода в таблицу/форму 
        // autoColumns  - Да - автоматически добавляются все столбцы из свойств объекта с заменой значений атрибутов указанных в columns
        //                Нет - добавляются только столбцы перечисленные в columns, дополнительно заполенные атрибутами из соответствующих свойств объекта            
        
        let typeColumns = [];

        let typeProperties = [];
        for(let i in objectType.Properties) {
            const typeProp = { ...objectType.Properties[i]};
            const column = (columns != null ? columns.find(col => col.dataField == typeProp.Name) : null);
            let isAdd = !!column || autoColumns;
            if(typeProp.IsIdentifier) {
                let objPropName
                
                objPropName = typeProp.RelatedField!=null ? typeProp.RelatedField: null;
                
                if (objPropName==null){
                    objPropName = typeProp.Name.endsWith("Id") ? typeProp.Name.substring(0, typeProp.Name.length - 2) : null;
                }
                if (objPropName==null){
                    objPropName = typeProp.Name.startsWith("Id") && !typeProp.Name.endsWith("Navigation") ? typeProp.Name + "Navigation" : null;
                }
                const objProp =  objectType.Properties.find(prop => prop.Name == objPropName);
                const objColumn = (columns != null ? columns.find(col => col.dataField == objPropName) : null);
                if(objProp) {
                    //typeProp.Title = objProp.Title;
                    if(objColumn || autoColumns) {
                        isAdd = !objProp.IsInclude;
                    }
                }
            }
            else if(typeProp.IsObject) {
                let idPropName
                
                idPropName = typeProp.RelatedField!=null ? typeProp.RelatedField: null;
                
                if (idPropName==null){
                    idPropName = !typeProp.Name.startsWith("Id") && !typeProp.Name.endsWith("Navigation") ? typeProp.Name + "Id" : null;
                }
                if (idPropName==null){
                    idPropName = typeProp.Name.startsWith("Id") && typeProp.Name.endsWith("Navigation") ? typeProp.Name.substring(0, typeProp.Name.length - 10) : null;
                }
                const idProp =  objectType.Properties.find(prop => prop.Name == idPropName);
                const idColumn = (columns != null ? columns.find(col => col.dataField == idPropName) : null);
                if(idProp) {
                    if(idColumn || autoColumns) {
                        isAdd = typeProp.IsInclude;
                    }
                }
            }

            if(isAdd) {
                typeProperties.push(typeProp);
            }
        }

        // console.log("typeProperties", typeProperties)
        const nameSpace = objectType.NameSpace
        if(objectType && typeProperties) {
            if(columns && !autoColumns) {
                for(let i in columns) {
                    const column = columns[i];
                    const typeProp = typeProperties.find(prop => prop.Name == column.dataField);

                    const objTypeColumn = this.qGetObjectTypeColumn(typeProp,nameSpace);

                    if(objTypeColumn) {
                        let typeColumn = {...objTypeColumn};
                        for(let prop in column) {
                            if(prop != "dataField") {
                                typeColumn[prop] = column[prop];
                            }
                        }
                        typeColumns.push(typeColumn);
                    }
                    else {
                        column.allowEditing = false;
                        typeColumns.push(column);
                    }
                }
            }
            else {
                for(let i in typeProperties) {
                    const typeProp = typeProperties[i];
                    const objTypeColumn = this.qGetObjectTypeColumn(typeProp,nameSpace);
                    if(objTypeColumn) {
                        let isFieldColumn = false;
                        if(columns && autoColumns) {
                            const fieldColumns = columns.filter(col => col.dataField == typeProp.Name);
                            isFieldColumn = (fieldColumns.length > 0);
                            if(isFieldColumn) {
                                for(let j in fieldColumns) {
                                    const typeColumn = {...objTypeColumn};
                                    const column = fieldColumns[j];
                                    if(column) {
                                        for(let prop in column) {
                                            if(prop != "dataField") {
                                                typeColumn[prop] = column[prop];
                                            }
                                        }
                                    }
                                    typeColumns.push(typeColumn);
                                }
                            }
                        }
                        if(!isFieldColumn) {
                            const typeColumn = {...objTypeColumn};
                            typeColumns.push(typeColumn);
                        }
                    }
                }
            }
        }
        // console.log("typeColumns", objectType.Name, {objectType, columns, typeColumns})
        return typeColumns;
    },
    qGetObjectTypeColumn(prop,nameSpace) {
        let typeColumn;
        //console.log("!!!!prop.TypeName ==",prop.TypeName)
        if(prop && !prop.IsNotAvailable) {
            let dataField = prop.Name
            const allowEditing = !prop.IsReadOnly
            const visible = !prop.IsHiddenByDefault
            let dataType = null
            let lookup={dataSource:[]}
            let cellTemplate=null
            let dictionaryType
            let editorType
            let editorOptions
            let formItem = !allowEditing ? { visible: false } : null;
            let width = prop.Name == "Title" ? 200 : 100
            let headerFilter
            
            if(!prop.NameSpace)
                prop.NameSpace = nameSpace
            else
                nameSpace =prop.NameSpace

            let name = prop.Name
            let required = !prop.IsNullable && !prop.IsReadOnly && !prop.IsBoolean;
            let label = prop.Name
            let align = 'left'
            let field = prop.Name
            let format = val => `${val}`
            let sortable = true
            //if(prop.IsIdentifier){
            //    dataType = "string";
            //    cellTemplate = "mySuperTemplate";
            //}
           

            if(prop.IsIdentifier || prop.IsObject || prop.IsArray) {
                if(prop.TypeName) {
                    const getterName = "getAnyObjects"// + utils.getPluralName(prop.TypeName);
                    const getter = store.getters[getterName]

                    
                    if(getter !== undefined) {
                        //dictionaryType = store.getters.getDictionaryTypes.find(o => o.Name == prop.DictionaryTypeName);
                       
                        lookup = {
                            dataSource:  getter[prop.NameSpace+"."+prop.TypeName]?getter[prop.NameSpace+"."+prop.TypeName]:[],
                            displayExpr: prop.DisplayExpr ? prop.DisplayExpr : "Id",
                            keyExpr: "Id",
                            valueExpr: prop.DisplayExpr ? prop.DisplayExpr : "Id",
                            filterStr: ""
                        };
                        //console.log("!!!!prop.DisplayExpr ==",prop.DisplayExpr)
                    }
                }

                if(prop.IsIdentifier) {
                    if(lookup) {
                        dataField = prop.Name;
                    }
                    dataType = "list"
                }
                else if(prop.IsObject) {
                    if(prop.IsInclude) {
                        dataField = prop.Name + "." + (prop.DisplayExpr ? prop.DisplayExpr : "Id");
                        dataType = "string";
                        lookup = null;
                    }
                    else if(lookup) {
                        dataField = prop.Name + "Id";
                    }
                }
                else if(prop.IsArray) {
                    if(lookup) {
                        lookup.valueExpr = prop.DisplayExpr ? prop.DisplayExpr : "Id";
                    }
                    cellTemplate = "numericTitlesTemplate";
                    dataType = "list"
                }
                headerFilter = {allowSearch: true };
            }
            else if(prop.IsString) {
                dataType = "string";
                headerFilter = {allowSearch: true };
                if(prop.IsMultiline) {
                    cellTemplate = "multilineTextTemplate";
                    editorType = "dxTextArea";
                    editorOptions = {
                        inputAttr: {
                            rows: 4
                        },
                    };
                    width = 220;
                }
            }
            else if(prop.IsBoolean) {
                dataType = "boolean";
            }
            else if(prop.IsNumeric) {
                dataType = "number";
            }
            else if(prop.IsDate) {
                dataType = "date";
                width = 90;
            }

            typeColumn = {
                dataField,
                allowEditing,
                visible,
                dataType,
                lookup,
                cellTemplate,
                dictionaryType,
                editorType,
                editorOptions,
                formItem,
                headerFilter,
                width,
                name,
                required,
                label,
                align,
                field,
                format,
                sortable,
                nameSpace,
                prop
            }
        }
        return typeColumn;
    },
    getObjectTypeColumn(prop) {
        let typeColumn;
        if(prop && !prop.IsNotAvailable) {
            let dataField = prop.Name;
            const caption = prop.Title;
            const format = prop.DataFormat;
            const isRequired = !prop.IsNullable && !prop.IsReadOnly && !prop.IsBoolean;
            const allowEditing = !prop.IsReadOnly;
            const visible = !prop.IsHiddenByDefault;
            const showInColumnChooser = true;
            
            let width = prop.Name == "Title" ? 200 : 100;
            let dataType;
            let lookup;
            let headerFilter;
            let cellTemplate;
            let formItem = !allowEditing ? { visible: false } : null;
            let dictionaryType;
            let editorType;
            let editorOptions;

            
            if(prop.IsObject || prop.IsArray) {
                if(prop.TypeName) {
                    const getterName = "get" + utils.getPluralName(prop.TypeName);
                    //console.log("getterName--",getterName)
                    const getter = store.getters[getterName];
                    if(getter !== undefined) {
                        dictionaryType = store.getters.getDictionaryTypes.find(o => o.Name == prop.DictionaryTypeName);
                        lookup = {
                            dataSource: dictionaryType ? getter.filter(o => o.DictionaryTypeId == dictionaryType.Id) : getter,
                            
                            displayExpr: prop.DisplayExpr ? prop.DisplayExpr : "Title",
                            keyExpr: "Id",
                            valueExpr: "Id"
                        };
                        
                    }
                }

                
                 if(prop.IsObject) {
                    if(prop.IsInclude) {
                        dataField = prop.Name + "." + (prop.DisplayExpr ? prop.DisplayExpr : "Title");
                        dataType = "string";
                        lookup = null;
                    }
                    else if(lookup) {
                        dataField = prop.Name + "Id";
                    }
                }
                else if(prop.IsArray) {
                    if(lookup) {
                        lookup.valueExpr = prop.DisplayExpr ? prop.DisplayExpr : "Title";
                    }
                    cellTemplate = "numericTitlesTemplate";
                }
                headerFilter = {allowSearch: true };
            }
            else if(prop.IsIdentifier){
                dataType = "string";
                cellTemplate = "mySuperTemplate";
            }
            else if(prop.IsString) {
                dataType = "string";
                headerFilter = {allowSearch: true };
                if(prop.IsMultiline) {
                    cellTemplate = "multilineTextTemplate";
                    //cellTemplate = "mySuperTemplate";
                    editorType = "dxTextArea";
                    editorOptions = {
                        inputAttr: {
                            rows: 4
                        },
                    };
                    width = 220;
                }
            }
            else if(prop.IsBoolean) {
                dataType = "boolean";
            }
            else if(prop.IsNumeric) {
                dataType = "number";
            }
            else if(prop.IsDate) {
                dataType = "date";    
                //cellTemplate = "mySuperTemplate";            
                width = 90;
            }

            typeColumn = {
                prop,
                dataField,
                dataType,
                caption,
                visible,
                format,
                width,
                allowEditing,
                showInColumnChooser,
                headerFilter,
                cellTemplate,
                formItem,
                lookup,
                isRequired,
                dictionaryType,
                editorType,
                editorOptions
            };
        }
        return typeColumn;
    },
}