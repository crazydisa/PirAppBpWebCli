<template>
  <div :style="cGetStyle">
    {{ cGetText }}
  </div>
</template>

<script>



export default {
  components: { 

  },
  props: {
   
    text: {
      type: String,
      default: () => ""
    },
   
    
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    
  },
  computed:{
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text
    }
    
  },
  mounted() {
    
  }
}
</script>