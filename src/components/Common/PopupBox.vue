<template>
    <DxPopup class="popup-box-component"
        ref="popupRef"
        :visible="visible"
        :drag-enabled="true"
        :close-on-outside-click="true"
        :show-title="true"
        @hiding="popupHiding"
        :width="width"
        :height="height"
        :title="title"
        >
        <div class="popup-box-container">
            <slot name="container">
            </slot>
        </div>
        <DxToolbarItem 
            widget="dxButton"
            toolbar="bottom"
            :options="popupButtonOptions"
            location="after">
        </DxToolbarItem>
    </DxPopup>
</template>

<script>

import { DxPopup, DxToolbarItem  } from 'devextreme-vue/popup';
import localizeFilter from '@/localize';

export default {
    components: {
        DxPopup,
        DxToolbarItem,
       
     
    },
    props: {
        title: {
            type: String,
            default: () => null
        },
        id: {
            type: String,
            default: () => null
        },
        applyButtonText: {
            type: String,
            default: () => localizeFilter("Apply")
        },
        width: {
            default: () => null
        },
        height: {
            default: () => null
        },
        visible: {
            type: Boolean,
            default: () => false
        },
        onApply: {
            type: Function,
            default: () => function() {}
        },
        onClose: {
            type: Function,
            default: () => function() {}
        },
        tabs: {
            type: Array,
            default: () => []
    },
    },
    data() {
        return {
            isApply: false,
            popupButtonOptions: {
                text: this.applyButtonText,
                onClick: () => {
                    this.isApply = true;
                    this.onApply();
                    this.onClose();
                }
            },
            
        }
    },
    methods: {
        popupHiding() {
            if(!this.isApply) {
                this.onClose();
            }
            this.isApply = false;
        }
    },
    computed: {
        popup() {
            return this.$refs["popupRef"].instance;
        },
    },
    mounted() {
    }
};

</script>

<style>

</style>