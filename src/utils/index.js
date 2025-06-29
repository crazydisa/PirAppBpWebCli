import { isProxy, toRaw } from 'vue';
import notify from "@/notify";
(function($) {
    var _extend = function(_to, _from) {
       for(let i in _from)
          _to[i] = _from[i];
    };
    _extend($, {
        // Парсим различные представления.
        isInteger: function (value) {
            return /^\d+$/.test(value);
          },
        parse: function(date) {
            // Если нечего парсить
            if (!date) return null;
            // Если код изначально был в формате C#
            if (typeof(date) === 'string' && date.indexOf('/Date(') === 0) return new Date(parseInt(date.substring(6)));
            // Если мы взяли iso формат
            else if (typeof(date) === 'string' && date.replace('-', '').length != date.length) {
                return new Date(date.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
            }
            // Если мы взяли русский формат
            else if (typeof(date) === 'string' && date.replace('.', '').length != date.length) {
                return new Date(date.replace(/(\d+)\.(\d+)\.(\d+)/, '$2/$1/$3'));
            }
            else if (typeof(date) === 'number')  {
                return new Date(date);
            }
            else if (typeof(date) === 'string' && $.isInteger(date)) {
                return new Date(Number(date));
            }
            // Если передан готовый объект
            else if (typeof(date) === 'object' && date.constructor === Date) return date;
            // Пришел некорректный параметр отдаем пустой объект
            return null;
        },
        // Обработка iso
        iso: {
            // Вывод даты
            date: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate());
            },
            // Вывод времени
            time: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return (date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes());
            },
            // Вывод даты и времени
            datetime: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes());
            }
        },
        // Обработка на русского формата
        ru: {
            // Вывод даты
            date: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()) + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)) + '.' + date.getFullYear();
            },
            // Вывод времени
            time: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return (date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes());
            },
            // Вывод даты и времени    
            datetime: function(_date) {
                var date;
                // Если входной формат не корректен,
                // то возвращаем пустую строку
                if (!(date = $.parse(_date))) return '';
                return (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()) + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)) + '.' + date.getFullYear() + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes());
            }
        }
    });
})(window.dt = {});

export default {
    getItemById(items, Id) {
        return items.find(i => i.Id == Id);
    },
    getItemsByIds(items, Ids) {
        let results = [];
        for(let i in Ids) {
            results.push(this.getItemById(items, Ids[i]));
        }
        return results;
    },
    getItemByTitle(items, Title) {
        return items.find(i => i.Title == Title);
    },
    getItemsRemoveItem(items, item) {
        var objectFromServer=item
        objectFromServer = this.isValidObject({objectFromServer},"Id","bigint","number","string","guid")
        if(objectFromServer){
            return items.filter(i => i.Id != objectFromServer.Id);
        }
        else{
            return null
        }
        
    },
    getItemsAddItems(stateItems, addItems, idProp) {
        if(stateItems && addItems) {
            if(!idProp) idProp = "Id";
            for(let i in addItems) {
                const item = addItems[i];
                if(stateItems.find(t => t[idProp] == item[idProp])) {
                    this.setItem(stateItems, item, idProp);
                }
                else {
                    stateItems.push(item);
                }
            }
        }
        return stateItems;
    },
    setItem(items, item, idProp) {
        if(!idProp) idProp = "Id";
        var objectFromServer=item
        objectFromServer = this.isValidObject({objectFromServer},idProp,"bigint","number","string","guid")
        if(!objectFromServer){return}
        if(items && objectFromServer) {
            const _item = items.find(i => i[idProp] && i[idProp] == objectFromServer[idProp]);
            if(_item) {
                Object.assign(_item, objectFromServer);
            }
            else {
                items.push(objectFromServer);
            }
        }
    },
    sortItems(items, field, order) {
        if(!field) field = "Title";
        if(order == "desc") {
            items.sort((a, b) => (a[field] > b[field]) ? -1 : (a[field] < b[field]) ? 1 : 0);
        }
        else {
            items.sort((a, b) => (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0);
        }
    },
    reorderItems(items, field) {
        if(items && field) {
            for(let i in items) {
                items[i][field] = (i*1 + 1);
            }
        }
    },
    initFieldItems(items, field, getFunction, byItemId) {
        if(items && field && getFunction) {
            for(let i in items) {
                const item = items[i];
                let itemField;
                if(byItemId) {
                    itemField = getFunction(item.Id);
                }
                else {
                    itemField = getFunction(item[field].Id);
                } 
                if(itemField) {
                    item[field] = itemField;
                }
            }
        }
    },
    replaceNullToFalse(value, fields) {
        if(value && fields) {
            const replace = (item, fields) => {
                for(let f in fields) {
                    if(item[fields[f]] == null) {
                        item[fields[f]] = false;
                    }
                }
            }
            if(value instanceof Array) {
                for(let i in value) {
                    replace(value[i], fields);
                }
            }
            else if(typeof value === "object") {
                replace(value, fields);
            }
        }
    },
    getUniqueValues(items, field) {
        var unique_values = [];
        if(items) {
            var hash = {};
            var all_values = [];
            for(let i in items) {
                var fieldValue = field ? items[i][field] : items[i];
                if(fieldValue) {
                    if(fieldValue instanceof Array) {
                        for(let j in fieldValue) {
                            all_values.push(fieldValue[j]);
                        }
                    }
                    else {
                        all_values.push(fieldValue);
                    }
                }
            }
        }
        for (let i in all_values) {
            if (!(all_values[i] in hash)) {
                hash[all_values[i]] = true;
                unique_values.push(all_values[i]);
            }
        }
        // unique_values.sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
        return unique_values;
    },
     uniqueBy(arr, fn) {
        var unique = {};
        var distinct = [];
        arr.forEach(function (x) {
          var key = fn(x);
          if (!unique[key]) {
            distinct.push(x);
            unique[key] = true;
          }
        });
        return distinct;
      },
    getLookupValues(items, field, valueExpr) {
        let lookupValues = [];
        if(items && field && valueExpr) {
            let hash = {};
            for (let r in items) {
                const item = items[r];
                let itemValues;
                if(field.includes('.')) {
                    let values = { ...item};
                    const valueSplit = field.split('.');
                    for(let i in valueSplit) {
                        if(values[valueSplit[i]]) {
                            values = values[valueSplit[i]];
                        }
                        else {
                            values = null;
                            break;
                        }
                    }
                    itemValues = values;
                }
                else {
                    if(isProxy(item)){
                        const raw = toRaw(item)
                        itemValues =  raw[field]
                    }
                    else
                        itemValues = item[field]
                }
                
                for(let t in itemValues) {
                    const value = itemValues[t];
                    if (!(value[valueExpr] in hash)) {
                        hash[value[valueExpr]] = true;
                        lookupValues.push(value);
                    }
                }
                if (typeof itemValues === 'string' || itemValues instanceof String){
                    if (!(itemValues in hash)) {
                        hash[itemValues] = true;
                        lookupValues.push(itemValues);
                    }
                }else if(this.isNumber(itemValues)){
                    if (!(itemValues in hash)) {
                        hash[itemValues] = true;
                        lookupValues.push(itemValues);
                    }
                }
            }
        }
        lookupValues.sort((a, b) => (a[valueExpr] < b[valueExpr]) ? -1 : (a[valueExpr] > b[valueExpr]) ? 1 : 0);
        //console.log("lookupValues!!!! -",lookupValues)
        return lookupValues;
    },
    isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }, 
    getListValues(items, fieldKey, fieldTitle, valueKey, valueTitle) {
        let listValues = [];
        for(let i in items) {
            const listValue = {};
            listValue[valueKey] = items[i][fieldKey];
            listValue[valueTitle] = items[i][fieldTitle];
            if(listValue[valueKey] && !listValues.find(a => a[valueKey] == listValue[valueKey])) {
                listValues.push(listValue);
            }
        }
        listValues.sort((a, b) => (a[valueKey] < b[valueKey]) ? -1 : (a[valueKey] > b[valueKey]) ? 1 : 0);
        return listValues;
    },
    getMinDate(items, field, notNull) {
        let minDate = null;
        if(items && field) {
            for(let i in items) {
                const date = items[i][field];
                if(date instanceof Date) {
                    if(!minDate || minDate.getTime() > date.getTime()) {
                        minDate = new Date(date);
                    }
                }
                else if(notNull) {
                    return null;
                }
            }
        }
        return minDate;
    },
    getMaxDate(items, field, notNull) {
        let maxDate = null;
        if(items && field) {
            for(let i in items) {
                const date = items[i][field];
                if(date instanceof Date) {
                    if(!maxDate || maxDate.getTime() < date.getTime()) {
                        maxDate = new Date(date);
                    }
                }
                else if(notNull) {
                    return null;
                }
            }
        }
        return maxDate;
    },
    geMinNumber(items, field) {
        let minNumber = null;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    if(!minNumber || minNumber > number) {
                        minNumber = number;
                    }
                }
            }
        }
        return minNumber;
    },
    getMaxNumber(items, field) {
        let maxNumber = null;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    if(!maxNumber || maxNumber < number) {
                        maxNumber = number;
                    }
                }
            }
        }
        return maxNumber;
    },
    getSumNumber(items, field) {
        let sumNumber = 0;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    sumNumber += number;
                }
            }
        }
        return sumNumber;
    },
    getFirstValue(items, field) {
        let firstValue = null;
        if(items && items.length > 0 && field) {
            const firstItem = items[0];
            firstValue = firstItem[field];
        }
        return firstValue;
    },
    getLastValue(items, field) {
        let lastValue = null;
        if(items && items.length > 0 && field) {
            const lastItem = items[items.length - 1];
            lastValue = lastItem[field];
        }
        return lastValue;
    },
    getValues(items, field) {
        let values = [];
        if(items && field) {
            for(let i in items) {
                values.push(items[i][field]);
            }
        }
        return values;
    },
    stringToDate (str) {
        if(str) {
            const splt = str.split('.');
            if(splt.length >=3) {
                return new Date(splt[2], splt[1] - 1, splt[0]);
            }
        }
        return null;
    },
    wcfObjectsToObjects(wcfObjs) {
        let objs = [];
        if(wcfObjs && wcfObjs instanceof Array) {
            for(let i in wcfObjs) {
                const wcfObj = wcfObjs[i];
                const obj = this.wcfObjectToObject(wcfObj)
                objs.push(obj);
            }
        }
        return objs;
    },
    wcfObjectToObject(wcfObj) {
        if(wcfObj && typeof wcfObj === "object") {
            const obj = { ...wcfObj };
            for(let prop in obj) {
                const value = obj[prop];
                if(typeof value === "string") {
                    if(value.startsWith('/Date(')) {
                        obj[prop] = this.wcfDateToDate(value);
                    }
                }
                else if(value instanceof Array) {
                    let arr = [];
                    for(let i in value) {
                        const wcfObj = value[i];
                        const obj = this.wcfObjectToObject(wcfObj);
                        arr.push(obj);
                    }
                    obj[prop] = arr;
                }
                else if(typeof value === "object") {
                    obj[prop] = this.wcfObjectToObject(value);
                }
            }
            return obj;
        }
        return wcfObj;
    },
    objectsToWcfObjects(objs) {
        let wcfObjs = [];
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            wcfObjs.push(this.objectToWcfObject(obj));
        }
        return wcfObjs;
    },
    objectToWcfObject(obj) {
        if(obj && typeof obj === "object") {
            const wcfObj = { };
            for(let prop in obj) {
                const value = obj[prop];
                if(value instanceof Date) {
                    wcfObj[prop] = this.dateToWcfDate(value);
                }
                else if(value instanceof Array) {
                    wcfObj[prop] = [];
                    for(let i in value) {
                        wcfObj[prop].push({Id: value[i].Id});
                    }
                }
                else {
                    wcfObj[prop] = value;
                }
            }
            return wcfObj;
        }
        return obj;
    },
    wcfDateToDate (dateTime) {
        if(dateTime && dateTime.length > 6) {
            return new Date(parseInt(dateTime.substr(6)));
        }
        return dateTime;
    },
    dateToWcfDate (date) {
        if(date && date instanceof Date) {
            var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            return '/Date(' + utcDate.getTime() + ')/';
        }
        return date;
    },
    isIsoDate(str) {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/.test(str)) return false;
        const d = new Date(str); 
        return d instanceof Date && !isNaN(d.getTime()) // && d.toISOString().slice(0, -1)===str; // valid date 
    },
    apiObjectsToObjects(apiObjs) {
        let objs = [];
        if(apiObjs && apiObjs instanceof Array) {
            for(let i in apiObjs) {
                const apiObj = apiObjs[i];
                const obj = this.apiObjectToObject(apiObj)
                objs.push(obj);
            }
        }
        return objs;
    },
    apiObjectToObject(apiObj) {
        if(apiObj && typeof apiObj === "object") {
            const obj = { ...apiObj };
            for(let prop in obj) {
                const value = obj[prop];
                if(typeof value === "string") {
                    if(value) {
                        if(value.length >= 16) {
                            if(value[4] === "-" && value[7] === "-" && value[10] === "T") {
                                let date = new Date(value);
                                if(this.isIsoDate(value)){
                                    date = new Date(date.toISOString().slice(0, -1))
                                }
                                
                                if(date !== "Invalid Date" && !isNaN(date)) {
                                    obj[prop] = date;
                                }
                            }
                        }
                    }
                }
                else if(value instanceof Array) {
                    let arr = [];
                    for(let i in value) {
                        const apiObj = value[i];
                        const obj = this.apiObjectToObject(apiObj);
                        arr.push(obj);
                    }
                    obj[prop] = arr;
                }
                else if(typeof value === "object") {
                    obj[prop] = this.apiObjectToObject(value);
                }
            }
            return obj;
        }
        return apiObj;
    },
    objectsToApiObjects(objs) {
        let apiObjs = [];
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            apiObjs.push(this.objectToApiObject(obj));
        }
        return apiObjs;
    },
    prepareDate(date){
        let dd = date.getDate();
        let mm = date.getMonth() + 1; //January is 0!
        let yyyy = date.getFullYear();
        // if (dd < 10) {
        //     dd = '0' + dd
        // }
        // if (mm < 10) {
        //     mm = '0' + mm
        // }
        return mm + '/' + dd + '/' + yyyy;
        //dd + '/' + mm + '/' + yyyy;
    },
    objectToApiObject(obj) {
        if(obj && typeof obj === "object") {
            const apiObj = { };
            for(let prop in obj) {
                const value = obj[prop];
                if(value instanceof Date) {
                    apiObj[prop] = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds()));
                    console.log("apiObj[prop]",apiObj[prop]);
                }
                else if(value instanceof Array) {
                    let arr = [];
                    for(let i in value) {
                        const obj = value[i];
                        const apiObj = this.objectToApiObject(obj);
                        arr.push(apiObj);
                    }
                    apiObj[prop] = arr;
                }
                else if(typeof value === "object") {
                    apiObj[prop] = this.objectToApiObject(value);
                }
                else {
                    apiObj[prop] = value;
                }
            }
            return apiObj;
        }
        return obj;
    },
    
    

    stringToNumber (str) {
        if(str) {
            str = str.trim().replace(',','.');
            if(str.indexOf('.') === -1) {
                return parseInt(str);
            }
            return parseFloat(str);
        }
        return 0;
    },
    stringToBoolean (str) {
        if(str) {
            if(str == 1 || str == "+" || str.toLowerCase() == 'да' || str.toLowerCase() == 'истина') {
                return true;
            }
        }
        return false;
    },
    dateToString(date) {
        return date ? new Date(date).toLocaleDateString()
                : '';
    },
    dateTimeToString(date) {
        return date ? new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString([], {timeStyle: 'short'})
                : '';
    },
    dateTimeToStringFormat(date, format) {
        if(format == "dd.MM.yyyy HH:mm") {
            return this.dateTimeToString(date);
        }
        else if(format == "dd.MM.yyyy") {
            return this.dateToString(date);
        }
        else {
            return date;
        }
    },
    getCellText(item, cellInfo) {
        if(item && cellInfo) {
            if(item instanceof Date) {
                return this.dateToString(item);
            }
            else if(cellInfo && cellInfo.column && cellInfo.column.lookup) {
                return cellInfo.column.lookup.calculateCellValue(item);
            }
            else if(typeof item === "object" && item.Title) {
                return item.Title;
            }
            return item;
        }
    },
    getExportedCellValue(value, cellInfo) {
        let cellValue = "";
        if(value && cellInfo) {
            if(value instanceof Array) {
                for(let i in value) {
                    cellValue += (i*1+1) + ") " + (this.getCellText(value[i], cellInfo) || "") + "\r\n";
                }
            }
            else {
                cellValue += "1) " + (this.getCellText(value) || "");
            }
        }
        return cellValue;
    },
    roundSum(value, powCount = 2) {
        if(value) {
            const pow = Math.pow(10, powCount);
            return Math.round(value * pow) / pow;
        }
        return 0;
    },
    sumToText(value, currencyMeasure) {
        let text = '';
        if(!currencyMeasure || !currencyMeasure.value) currencyMeasure = {value: 1};
        if(value) {
            var valStr = this.roundSum(value / currencyMeasure.value).toString();
            var sc = 0;
            if(valStr.length > 0) {
                for(var i = valStr.length - 1; i >= 0; i--) {
                    const chr = valStr[i];
                    if(chr == '.' || chr == ',')
                    {
                        text = ',' + text;
                        sc = 0;
                    }
                    else {
                        if(sc == 3) {
                            text = chr + ' ' + text;
                            sc = 1;
                        }
                        else {
                            text = chr + text;
                            sc ++;
                        }
                    }
                }
            }
            const valueSplit = valStr.split(".");
            const rightLength = valueSplit.length == 2 ? valueSplit[1].length : 0;
            if(rightLength == 0) {
                text += ",00";
            }
            else if(rightLength == 1) {
                text += "0";
            }
        }
        return text;
    },
    ceilPercent(value) {
        if(value) {
            const ceilValue = Math.ceil(value * 100) / 100;
            if(ceilValue == 1 && value < 1) return 0.99;
            return ceilValue;
        }
        return 0;
    },

    addQueryParam(first, paramName, fieldName, selectedAll, selectedItems) {
        let param = "";
        if(paramName && !selectedAll && selectedItems && selectedItems.length > 0) {
            param += (first ? "?" : "&");
            param += (paramName + "=" + selectedItems.map(item => {return fieldName ? item[fieldName] : item }).join(','));
        }
        return param;
    },

    getDayStartDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    },
    getDayFinishDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    },
    getMonths(year) {
        let months = [];
        if(year) {
            for(let i = 0; i < 12; i++) {
                const StartDate = new Date(year, i, 1);
                const month = this.getMonth(StartDate);
                months.push(month);
            }
        }
        return months;
    },
    getMonth(date) {
        const StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        if(StartDate instanceof Date) {
            const StartTime = StartDate.getTime();
            let DiffDate = new Date(StartTime);
            DiffDate.setMonth(DiffDate.getMonth() + 1);
            const FinishTime = DiffDate.getTime() - 1;
            const FinishDate = new Date(FinishTime);
            const Month = StartDate.getMonth();
            const Year = StartDate.getFullYear();
            const Title = this.getMonthTitle(StartDate);
            const ShortTitle = StartDate.toLocaleString("ru", { month: 'short' });
            const FullTitle = Title + " " + Year;
            return {
                Id: Month + 1,
                Index: Month,
                Year,
                Title,
                ShortTitle,
                FullTitle,
                StartDate,
                StartTime,
                FinishDate,
                FinishTime
            };
        }
        return null;
    },
    getMonthTitle(value) {
        if(typeof(value) == "number" && value >= 1 && value <= 12) {
            value = new Date(new Date().getFullYear(), value - 1, 1);
        }
        if(value instanceof Date) {
            return value.toLocaleString("ru", { month: 'long' });
        }
        return null;
    },
    getDateDiff(dayDiff) {
        const timeNow = new Date().getTime();
        const timeMonthDiff = 1000 * 60 * 60 * 24 * dayDiff;
        const date = new Date(timeNow - timeMonthDiff);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },


    getPluralName(name) {
        if(name) {
            let ends = "s";
            if(name.endsWith("x") || name.endsWith("s")) {
                ends = "es";
            }
            return name + ends;
        }
        return null;
    },
    isValidObject(){
        if (arguments.length == 0) return null
        let message
        let start = 0
        if (typeof arguments[0] === "function") {
            if(arguments.length == 1){notify.defaultError("Не передан объект для вылидации!"); return null}
            message = arguments[0]
            start =1
        }
        else{
            message = notify.defaultError
        }
        var entityName = Object.keys(arguments[start])[0];
        var entity = arguments[start][entityName];
        let fieldName = null
        let fieldTypeName = null
        if (arguments.length > 1+start) {fieldName = arguments[1+start]}
        if (arguments.length > 2+start) {fieldTypeName = arguments[2+start]}
        if(Array.isArray(entity)){
          if(entity.length>0){
            entity = entity[0]
            if(fieldName){
              if (typeof fieldName === "string" && fieldName !="") {
                if(typeof entity == "object"){
                  if (Object.keys(entity).length != 0){
                    if(Object.getOwnPropertyDescriptor(entity, fieldName)){
                      let field = entity[fieldName]
                      if(fieldTypeName){
                        if(typeof fieldTypeName === "string" &&  fieldTypeName!="") {
                          let isMatchingType = false
                          for(let i=2+start;i<arguments.length;i++){
                            let matchType = arguments[i]
                            if(matchType == "date"){
                              if(field instanceof Date){
                                isMatchingType = true}}
                            else{
                              if(matchType == typeof field){
                                isMatchingType = true}}}
                          if(isMatchingType){return entity}
                          else{message("Ожидаемого типа " +fieldTypeName+ " поля "+fieldName+" не найдено! Не ошибка для поля id если объект еще не сохранен в базу"); return null}}
                        else{message("Ожидался строковой параметр - тип поля!"); return null}}
                      else{return entity}}  
                    else{message("У объекта отсутствует заданное свойство "+fieldName+"! Не ошибка для поля id если объект еще не сохранен в базу"); return null}}
                  else{message("Ожидалось что объект "+entityName+" не пустой!"); return null}}
                else{message("Ожидался тип объект"); return null}}
              else{message("Ожидался строковой параметр - имя поля!"); return null}}
            else{return entity}}
          else{return null}}
        else if(typeof entity == "object" && entity != null){
          if (Object.keys(entity).length != 0){
            if(fieldName){
              if(Object.getOwnPropertyDescriptor(entity, fieldName)){
                let field = entity[fieldName]
                if(fieldTypeName){
                  if(typeof fieldTypeName === "string" &&  fieldTypeName!="") {
                    let isMatchingType = false
                    for(let i=2+start;i<arguments.length;i++){
                      let matchType = arguments[i]
                      if(matchType == "date"){
                        if(field instanceof Date){
                          isMatchingType = true}}
                      else{
                        if(matchType == typeof field){
                          isMatchingType = true}}}
                    if(isMatchingType){return entity}
                    else{message("Ожидаемого типа " +fieldTypeName+ " поля "+fieldName+" не найдено! Не ошибка для поля id если объект еще не сохранен в базу"); return null}}
                  else{message("Ожидался строковой параметр - тип поля!"); return null}}
                else{return entity}}  
              else{message("У объекта отсутствует заданное свойство "+fieldName+"! Не ошибка для поля id если объект еще не сохранен в базу"); return null}}
            else{return entity}}
          else{message("Ожидалось что объект "+entityName+" не пустой!"); return null}}
        else{message("Ожидалось что "+entityName+" это объект!"); return null}
      },
      isValidValue(){
        if (arguments.length == 0) return null
        let message
        let start = 0
        if (typeof arguments[0] === "function") {
            if(arguments.length == 1){notify.defaultError("Не передан объект для вылидации!"); return null}
            message = arguments[0]
            start =1
        }
        else{
            message = notify.defaultError
        }
        var valueName = Object.keys(arguments[start])[0];
        var value = arguments[start][valueName];
        let valueTypeName = null
        let condition = null
        if (arguments.length > 1+start) {valueTypeName = arguments[1+start]
          if(typeof valueTypeName === 'string'){valueTypeName=[valueTypeName]}}
        if (arguments.length > 2+start) {condition = arguments[2+start]
          if(typeof condition != 'function'){message("В функции валидации значения " + valueName + " неверно задан параметр условия на значение!"); return null}}
        if(valueTypeName && Array.isArray(valueTypeName)){
          let isMatchingType = false
          for(let i=0;i<valueTypeName.length;i++){let matchType = valueTypeName[i]
            if(matchType == "date"){
              if(value instanceof Date){isMatchingType = true}}
            else{
              if(matchType == typeof value){isMatchingType = true}}}
          if(isMatchingType){
            if(condition){let isConditionMet = condition(value)
              if(isConditionMet){return value}
              else{message("В функции валидации значения " + valueName + " значение не прошло проверку на условие - "+condition.toString()+"!"); return null}}
            else{return value}}
          else{message("В функции валидации значения " + valueName + " значение не прошло проверку на 'тип'! Ожидаемый - "+valueTypeName.join(', ')+"! Полученный - "+typeof value+"!"); return null}}
        else{return value}
      },
      
    
    
    
    
}