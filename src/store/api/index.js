import axios from "axios";
//import fs from "fs";
//import { fileStream } from 'node:fs'
import store from "@/store";
import notify from "@/notify";
import utils from "@/utils";


function getObject(oldValue, newValue) {
    let value = {};
    if(oldValue) {
        for(let propName in oldValue) {
            value[propName] = oldValue[propName];
        }
    }
    if(newValue) {
        for(let propName in newValue) {
            value[propName] = newValue[propName];
        }
    }
    delete value.Type;
    delete value.Parent;
    return value;
}

export default {
    
    
    async loadObject(actionName, pathUrl, commit, setterName) {
        await axios.get(store.getters.getConfigServiceUrl + pathUrl, { withCredentials: true})
            .then((response) => {
                const obj = utils.apiObjectToObject(response.data);
                if(commit && setterName) {
                    commit(setterName, obj);
                }
                notify.success(actionName, obj);
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            });
    },
    async loadObjects(actionName, pathUrl, commit, setterName) {
        const url = store.getters.getConfigServiceUrl + pathUrl
        console.log("url",url)
        await axios.get(url,{ withCredentials: true })
            .then((response) => {
                console.log("response",response)
                // const objs = utils.apiObjectsToObjects(response.data);
                // console.log("objs",objs)
                if(commit && setterName) {
                    commit(setterName, response.data);
                }
                //notify.success(actionName, objs);
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            });
    },
    
    async loadAnyObjects(commit, requestOptions ) {
        const url = store.getters.getConfigServiceUrl + requestOptions.url
        console.log("url",url)
        await axios.post(url, requestOptions, { withCredentials: true })
            .then((response) => {
                console.log("response",response)
                const objs = utils.apiObjectsToObjects(response.data);
                // console.log("objs",objs)
                if(commit && requestOptions.setterName) {
                    commit(requestOptions.setterName, {...requestOptions, responseData: objs});
                }
                notify.success(requestOptions.actionName, objs);
            })
            .catch((e) => {
                notify.error(requestOptions.actionName+"["+ requestOptions.typeName +"]", null, e);
            });
    },
    async createObject(actionName, pathUrl, newValue, commit, setterName) {
        const obj = getObject(null, newValue);
        delete obj.Id;
        await axios.post(store.getters.getConfigServiceUrl + pathUrl, utils.objectToApiObject(obj), { withCredentials: true })
            .then((response) => {
                const obj = utils.apiObjectToObject(response.data);
                if(commit && setterName) {
                    commit(setterName, obj);
                }
                notify.success(actionName, obj);
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            })
    },
    async createObjects(actionName, pathUrl, newValues, commit, setterName) {
        if(newValues && newValues instanceof Array) {
            let objs = [];
            for(let v in newValues) {
                const obj = getObject(null, newValues[v]);
                objs.push(obj);
            }
            await axios.post(store.getters.getConfigServiceUrl + pathUrl, utils.objectsToApiObjects(objs), { withCredentials: true })
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    if(commit && setterName) {
                        commit(setterName, objs);
                    }
                    notify.success(actionName, objs);
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
        }
    },

    async updateObject(actionName, pathUrl, value, newValue, commit, setterName) {
        if(value) {
            const obj = getObject(value, newValue);
            console.log("const obj = getObject(value, newValue);",obj)
            await axios.put(store.getters.getConfigServiceUrl + pathUrl, utils.objectToApiObject(obj), { withCredentials: true })
                .then((response) => {
                    const obj = utils.apiObjectToObject(response.data);
                    if(commit && setterName) {
                        commit(setterName, obj);
                    }
                    notify.success(actionName, obj);
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
        }
    },
    async updateAnyObject(actionName, pathUrl, value, newValue, commit, requestOptions) {
        //if(value) {
            const obj = getObject(value, newValue);
            const{typeName, nameSpace, setterName} = requestOptions
            await axios.put(store.getters.getConfigServiceUrl + pathUrl, utils.objectToApiObject(obj), { withCredentials: true })
                .then((response) => {
                    const obj = utils.apiObjectToObject(response.data);
                    if(commit && setterName) {
                        commit(setterName, {"typeName":typeName, "nameSpace":nameSpace, "anyObject": obj});
                    }
                    notify.default(actionName+ " - Успешное сохранение изменений");
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
       // }
    },
    async setM2MAnyObject(actionName, pathUrl, newValue, commit, setterName) {
        //if(value) {
            const obj = newValue//getObject(value, newValue);
            //const{typeName, nameSpace} = triad
            console.log("const obj = getObject(value, newValue);",obj)
            await axios.put(store.getters.getConfigServiceUrl + pathUrl, utils.objectToApiObject(obj), { withCredentials: true })
                .then((response) => {
                    const obj = utils.apiObjectToObject(response.data);
                    if(commit && setterName) {
                        commit(setterName,obj);
                    }
                    notify.success(actionName, obj);
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
       // }
    },
    async setOne2MAnyObject(actionName, pathUrl, newValue, commit, setterName) {
        //if(value) {
            const obj = newValue//getObject(value, newValue);
            //const{typeName, nameSpace} = triad
            console.log("setOne2MAnyObject rawObj",obj)
            //console.log("setOne2MAnyObject One2MAnyObjectToApiObject(rawObj)",utils.One2MAnyObjectToApiObject(obj))
            await axios.put(store.getters.getConfigServiceUrl + pathUrl, utils.objectToApiObject(obj), { withCredentials: true })
                .then((response) => {
                    const obj = utils.apiObjectToObject(response.data);
                    console.log("apiObjectToObject",obj)
                    if(commit && setterName) {
                        commit(setterName,obj);
                    }
                    notify.default(actionName+ " - Успешное сохранение изменений");
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
       // }
    },
    async updateObjects(actionName, pathUrl, values, newValues, commit, setterName) {
        if(values && values instanceof Array && newValues && newValues instanceof Array && values.length == newValues.length) {
            let objs = [];
            for(let v in values) {
                const obj = getObject(values[v], newValues[v]);
                objs.push(obj);
            }
            await axios.put(store.getters.getConfigServiceUrl + pathUrl, utils.objectsToApiObjects(objs), { withCredentials: true })
                .then((response) => {
                    const objs = utils.apiObjectsToObjects(response.data);
                    if(commit && setterName) {
                        commit(setterName, objs);
                    }
                    notify.success(actionName, objs);
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
        }
    },

    async deleteObject(actionName, pathUrl, value, commit, setterName) {
        if(value) {
            const title = value.Title;
            await axios.delete(store.getters.getConfigServiceUrl + pathUrl, { data: value, withCredentials: true })
                .then(() => {
                    if(commit && setterName) {
                        commit(setterName, value);
                    }
                    notify.success(actionName, title);
                })
                .catch((e) => {
                    notify.error(actionName, title, e);
                })
        }
    },
    async deleteObjects(actionName, pathUrl, values, commit, setterName) {
        if(values) {
            await axios.delete(store.getters.getConfigServiceUrl + pathUrl, { data: values, withCredentials: true })
                .then(() => {
                    commit(setterName, values);
                    notify.success(actionName);
                })
                .catch((e) => {
                    notify.error(actionName, null, e);
                })
        }
    },

    async downloadFile(actionName, pathUrl, fileName) {
        await axios.get(store.getters.getConfigServiceUrl + pathUrl,{withCredentials: true, responseType: 'blob'} )
            .then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
            
                fileLink.href = fileURL;
                fileLink.setAttribute('download', fileName);
                document.body.appendChild(fileLink);
            
                fileLink.click();
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            });
    },
    async downloadReport(actionName, pathUrl) {
        await axios.get(store.getters.getConfigServiceUrl + pathUrl,{withCredentials: true, responseType: 'stream'} )
            .then((response) => {
                //const fs = require('fs')
                //var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                //var fileLink = document.createElement('a');
                let headerLine = response.headers['Content-Disposition'];
                var FileReadStream = require('filestream/read');
                        let startFileNameIndex = headerLine.indexOf('"') + 1
                        let endFileNameIndex = headerLine.lastIndexOf('"');
                        let filename = headerLine.substring(startFileNameIndex, endFileNameIndex);
                        response.data.pipe(FileReadStream.createWriteStream(filename));
               // fileLink.href = fileURL;
                //fileLink.setAttribute('download', filename);
                //document.body.appendChild(fileLink);
            
                //sfileLink.click();
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            });
    },
    async importObjects(actionName, pathUrl) {
        await axios.post(store.getters.getConfigServiceUrl + pathUrl, {}, { withCredentials: true })
            .then((response) => {
                notify.info(actionName, null, response.data);
            })
            .catch((e) => {
                notify.error(actionName, null, e);
            })
    },
    async loadObjectsPost(actionName, pathUrl, objs, commit, setterName) {
        console.log("loadObjectsPost objs",objs);
        await axios.post(store.getters.getConfigServiceUrl + pathUrl, objs ? objs : {}, { withCredentials: true })
          .then((response) => {
            console.log("loadObjectsPost objs","loadObjectsPost");
              const objs = utils.apiObjectsToObjects(response.data);
              if(commit && setterName) {
                  commit(setterName, objs);
              }
              notify.success(actionName, objs);
              
          })
          .catch((e) => {
              notify.error(actionName, null, e);
          })
    },  
  
}