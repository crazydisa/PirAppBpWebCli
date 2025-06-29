<template>
    <span ref="component">
        <slot/>
    </span>
</template>

<script>
export default {
    name: 'scroll-to-component',
    methods: {
        scrollTo () {
            this.$refs.component.scrollIntoView();
        },
    },
};
</script>