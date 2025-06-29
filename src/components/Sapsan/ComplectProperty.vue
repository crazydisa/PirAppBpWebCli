<template>
    <Div>
        <ObjectForm 
        v-if="!!dataSource"
            :enable-edit-mode="true"
            :only-edit-mode="true"
            :auto-form-data="true"
            :allow-editing="true"
            :show-edit-buttons="false"
            :col-count="3"
            :data-source="dataSource"
            :object-type="objectType">
           >
          </ObjectForm>
    </Div>
</template>

<script>

    import ObjectForm from "@/components/Common/ObjectForm.vue";
    export default {
        components: {
            ObjectForm,         
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
                default: () => null
                },
            objectType: {
                type: Object,
                default: () => null
                },
         }
    }
</script>