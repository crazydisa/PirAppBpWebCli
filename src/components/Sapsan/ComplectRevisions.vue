<template>
    <Div>
        <ObjectsDataGrid
           
            :object-type="objectType"
            :data-source="dataSource"
            :auto-columns="true"
            :show-search-panel="false"
            :show-filter-row="false"
            :allow-editing="false"
            :allow-column-resizing="true"
            :allow-column-fixing="true"
            selection-mode="multiple"
          />
    </Div>
</template>

<script>

    import ObjectsDataGrid from "@/components/Common/ObjectsDataGrid.vue";
    export default {
        components: {
            ObjectsDataGrid,
        
        
         },
         props: {
            config: {
                type: Object,
                default: () => null
            },
            complect: {
                type: Object,
                default: () => null
            },
            dataSource: {
                type: Object,
                default: () => {}
                },
            objectType: {
                type: Object,
                default: () => null
                },
         }
    }
</script>