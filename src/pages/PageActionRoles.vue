<template>
  <div>
    <LoadPanel v-if="loading"/>
    <div class="page-container" v-resize @resize="onResize">
      <DataGrid
        v-if="!!columns"
        :columns="columns"
        :data-source="dataSource"
        :show-column-chooser="true"
        :show-refresh-button="true"
        :show-reset-filters-button="true"
        :show-filter-row="true"
        :show-search-panel="true"
        :show-page-selector="true"
        :page-size="50"
        selection-mode="none"
        :width="gridWidth"
        :height="gridHeight"
        :allow-column-resizing="true"
        :allow-grouping="true"
        :allow-updating="true"
        :export-enabled="true"
        :export-file-name="'ActionRoles'"
        :on-row-updating="actionRoleRowUpdating"
        :on-refreshing="actionRoleRefreshing"
        editing-mode="cell">
      </DataGrid>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex"
import DataGrid from "@/components/Common/DataGrid.vue";
import localizeFilter from '@/localize';


export default {
  components: {
    DataGrid
  },
  methods: {
    ...mapActions([
        "loadActions",
        "loadRoles",
        "updateActionRoles"
    ]),
    setColumns() {
        let columns = [{
                dataField: "ObjectType.RootContainer.Title",
                visible: true,
                allowEditing: false,
                fixed: true,
                groupIndex: 1,
                sortOrder: "asc",
                width: 120,
                caption: localizeFilter('ActionModuleTitle'),
            }, {
                dataField: "ObjectType.Title",
                visible: true,
                allowEditing: false,
                fixed: true,
                groupIndex: 1,
                sortOrder: "asc",
                width: 120,
                caption: localizeFilter('ActionTypeTitle'),
            }, {
                dataField: "Title",
                visible: true,
                allowEditing: false,
                fixed: true,
                width: 280,
                caption: localizeFilter('ActionTitle'),
            }, {
                dataField: "IsChange",
                dataType: "boolean",
                visible: true,
                allowEditing: false,
                allowFiltering: false,
                allowHeaderFiltering: true,
                fixed: true,
                width: 90,
                caption: localizeFilter('ActionIsChange'),
            }
        ];

        const roles = this.getRoles.filter(r => !r.IsDepartment && !r.IsAdmin);
        let roleColumns = [];
        for(let i in roles) {
            const role = roles[i];
            roleColumns.push({
                caption: role.Title,
                dataField: "Role" + role.Id,
                dataType : "boolean",
                alignment: "center",
                allowEditing: true,
                allowFiltering: false,
                allowHeaderFiltering: true,
                role,
                width: 90
            });
        }
        columns.push({
            caption: localizeFilter("ActionRoles"),
            alignment: "center",
            columns: roleColumns,
            allowEditing: true,
            allowFiltering: false,
        });
        this.columns = columns;
    },
    setDataSource() {
        this.dataSource = [];
        const actions = this.getActions;
        const roles = this.getRoles.filter(r => !r.IsDepartment && !r.IsAdmin);
        for(let u in actions) {
            let action = {...actions[u]};
            for(let r in roles) {
                const role = roles[r];
                let inRole = false;
                if(action.Roles && action.Roles.find(actionRole => actionRole.Id == role.Id)) {
                    inRole = true;
                }
                action["Role" + role.Id] = inRole;
            }
            this.dataSource.push(action);
        }
    },
    async actionRoleRowUpdating(e) {
        if(e.newData) {
            for (let prop in e.newData) {
                if(prop.startsWith("Role")) {
                    const actionId = e.oldData.Id;
                    const roleId = parseInt(prop.substring(4));
                    const role = this.getRoles.find(r => r.Id == roleId);
                    e.newData.Roles = this.getActionRoles(actionId).filter(role => role.Id != roleId);
                    if(e.newData[prop]) {
                        e.newData.Roles.push(role);
                    }
                    this.loading = true;
                    await this.updateActionRoles({key: actionId, values: e.newData});
                    this.loading = false;
                }
            }
        }
    },
    async actionRoleRefreshing() {
        this.loading = true;
        await this.loadActions();
        this.loading = false;
        this.setDataSource();
    },
    onResize(e) {
        this.gridWidth = e.detail.width;
        this.gridHeight = e.detail.height;
    },
  },
  data() {
    return {
      loading: null,
      gridWidth: null,
      gridHeight: null,
      columns: null,
      dataSource: null
    }
  },
  computed: {
    ...mapGetters([
        "getActions",
        "getRoles",
        "getActionRoles"
    ]),
  },
  async mounted() {
    this.loading = true;
    await this.loadRoles();
    // await this.loadActions();
    this.loading = false;

    this.setColumns();
    this.setDataSource();
  }
};
</script>

<style>

</style>