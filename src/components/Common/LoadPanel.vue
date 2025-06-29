<template>
    <div class="loader">
        <DxLoadPanel :visible="true"/>
    </div>
</template>

<script>
import { DxLoadPanel } from 'devextreme-vue/load-panel';
export default {
    components: {
        DxLoadPanel
    }
}
</script>