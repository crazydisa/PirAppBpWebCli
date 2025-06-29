<template>
    <div class="layout">
      <div class="header">
        <div class="header-app-top">
            <div class="header-app-title" :title="'ToMainPage'" @click="headerAppTitleClick">
                <h1>{{'AppTitle'}}</h1>
            </div>
            <div class="header-app-version">
                v. {{packageVersion}}
            </div>
        </div>
        <div class="header-content">
            <div >
                <div class="q-pa-md q-gutter-sm">
                <q-btn-group rounded outline v-for="(item, index) in menuDataSource" v-bind:key="index">
                    
                    <q-btn outline   color="brown" @click="menuItemClick(item)"  :label="item.Title"  />

                </q-btn-group>
            </div>
        </div>
           
            <div class="header-page-title">
               <!-- <h2>{{pageTitle}}</h2>--> 
            </div>
            <div class="header-user-menu">
                <!--<div id="current-user"
                    @mouseenter="currentUserInfoToggle"
                    @mouseleave="currentUserInfoToggle">
                    <i class="dx-icon-user"></i> {{currentUser.Title}}
                </div>--> 
                <TooltipDx
                    :v-model="currentUserInfoVisible"
                    :close-on-outside-click="false"
                    position="left"
                    target="#current-user">
                    <template #content>
                       <!-- <div class="current-user-info">
                            <div class="current-user-info-item">
                                {{"UserLogin"|localize}}: <b>{{currentUser.Name}}</b>
                            </div>
                            <div class="current-user-info-item" v-if="currentUser.Email">
                                {{"UserEmail"|localize}}: <b>{{currentUser.Email}}</b>
                            </div>
                            <div class="current-user-info-item">
                                {{"UserRoles"|localize}}:
                                <div v-for="(role, index) in currentUser.Roles" v-bind:key="index">
                                    <b>{{role.Title}}</b>
                                </div>
                            </div>
                        </div>-->
                    </template>
                </TooltipDx>
            </div>
            <div class="header-settings-menu">
            </div>
        </div>
      </div>
      <div class="page-content">
          <router-view/>        
      </div>
      <div class="footer" v-if="false">
          <div class="footer-copyright-title">
                {{'AppCopyrightTitle'}}
            </div>
            <div class="footer-copyright-description">
                {{'AppCopyrightDescription'}}
            </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
//import MenuDx from "@/components/Common/MenuDx.vue";
import TooltipDx from '@/components/Common/TooltipDx.vue';
import localizeFilter from '@/localize';

export default {
    name: "main-layout",
    components: {
       //MenuDx,
       TooltipDx,     
    },
    data() {
      return {
        currentUserInfoVisible: false,
        currentUserIsGipManager: false,
        currentUserIsProjectorManager: false,
        currentUserIsProspectorManager: false,
        packageVersion: process.env.PACKAGE_VERSION || '0',
       
      }
    },
    methods: {
        ...mapActions([
        ]),
        currentUserInfoToggle() {
            this.currentUserInfoVisible = !this.currentUserInfoVisible;
        },
        menuItemClick(e) {
            
            if(e.Path && e.Path != this.$route.path) {
                console.log("e.Path",e.Path)
            console.log("this.$route.path",this.$route.path)
                this.$router.push(e.Path);
            }
        },
        headerAppTitleClick() {
            this.$router.push("/");
        }
    },
    computed: {
        ...mapGetters([
            "getSystem",
            "getCurrentUser",
            "getPages",
            "currentUserIsAllowedAction",
            "isTestConfig",
            "isDebugConfig"
        ]),
        pageTitle() {
            return (this.isDebugConfig ? (localizeFilter("Debug") + ". ") : this.isTestConfig ? (localizeFilter("Test") + ". ") : "") + this.$route.meta.title;
        },
        menuDataSource() {
            const menu = this.getPages//.filter(page => page.LoadAction && this.currentUserIsAllowedAction(page.LoadAction.Name));
            console.log("menu",menu)
            return menu;
        },
        headerAppTitle() {
            return this.getSystem.Description;
        },
        currentUser() {
            return this.getCurrentUser;
        }
    },
    async mounted() {
    }
}
</script>

 

<style scoped>

    .layout {

        text-align: center;
        align-items: left;
        
        display: flex;

        flex-direction: column;

        min-height: 100vh;
        min-width: 100vw;
        max-width: 100%;

        position: relative;

    }

   

    .header {

        margin: 0;

        padding: 0;

        flex: 0 0;

        position: relative;

    }

 

    .header-message {

        position: absolute;

        margin: 0;

        width: 100%;

        padding: 0;

        border: 0;

        z-index: 1000;

    }

 

    .header-message-content {

        position: relative;

        margin: 2px 0px;

        padding: 4px;

        background-color: rgba(73, 68, 42, 0.801);

        color: rgb(255, 246, 238);

        font-weight: 550;

        font-size: 15px;

        letter-spacing: 2px;

        word-spacing: 3px;

    }

 

    .header-message-content .dx-icon-warning {

        font-size: 16px;

    }

 

    .header-app-top {

        flex: 1 1;

        text-align: center;

        overflow: hidden;

        display: flex;

        flex-direction: row;

        background-color: rgb(85, 85, 85);

    }

 

    .header-app-title {

        flex: 1 1 auto;

        padding-left: 70px;

        text-align: center;

        padding: 1px 0;

        overflow: hidden;

        cursor: pointer;

    }

 

    .header-app-title h1 {

        margin: 1px;

        font-size: 12px;

        padding: 1px 0;

        letter-spacing: 5px;

        word-spacing: 6px;

        color: #fff;

        white-space: nowrap;

    }

 

    .header-app-version {

        flex: 0 0 70px;

        font-size: 11px;

        color: rgb(204, 204, 204);

        padding: 3px;

        text-align: right;

    }

 

    .header-content {

        display: flex;

        align-items: center;

        background-color: rgb(241, 225, 132);

        border-bottom: 1px solid rgb(228, 205, 77);

        box-shadow: 0 5px 10px rgb(207, 207, 207);

    }

 

    .header-app-menu {

        flex: 0 0 250px;

        padding-left: 8px;

    }

 

    .header-page-title {

        flex: 1 1;

        text-align: center;

        overflow: hidden;

    }

 

    .header-page-title h2 {

        margin: 2px;

        font-size: 20px;

        font-weight: 800;

        padding: 2px 0;

        letter-spacing: 3px;

        word-spacing: 6px;

        border-top: 0px solid rgb(255, 193, 23);

        color: rgb(44, 44, 44);

        white-space: nowrap;

    }

 

    .header-user-menu {

        flex: 0 0 250px;

        padding-right: 8px;

        text-align: right;

        font-size: 11px;

        font-weight: bold;

        color: rgb(63, 63, 63);

    }

    .header-user-menu .dx-menu {

        display: inline-block;

    }

 

    #current-user {

        display: inline;

        cursor: default;

    }

 

    #current-user i {

        font-size: 12px;

    }

 

    .current-user-info {

        padding: 0;

    }

    .current-user-info-item {

        padding: 1px 0;

    }

 

    .page-content {

        text-align: left;

        padding: 10px 4px 4px 10px;

        flex: 1 1;

    }

 

    .footer {

        text-align: center;

        padding: 10px 0 20px 0;

        flex: 0 0 50px;

    }

    .footer-copyright-title {

        font-size: 12px;

        padding: 2px;

    }

    .footer-copyright-description {

        font-size: 11px;

    }

    .stl-item {

        border: 1px solid darkcyan;

    }

 

    .stl-red {

        color: red;

        font-size: 13px;

    }

</style>