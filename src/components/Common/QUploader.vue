
<template>
  <div class="q-pa-md">
    <q-uploader
      :factory="factoryFn"
      multiple
      style="max-width: 300px"
      with-credentials=true
    />
  </div>
</template>

<script>
export default {
  methods: {
    factoryFn () {
      return {
        url: 'https://tnnc-pir-app.rosneft.ru/pir-tz-api/upload-template',
        method: 'POST',
        withCredentials: true
      }
    }
  }
}
</script>



<!--url: 'https://tnnc-pir-app.rosneft.ru/pir-tz-api/upload-template',
 url:'http://localhost:5038/upload-template',
 <template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <q-uploader
        url="http://localhost:5038/sapsan/upload-template"
        withCredentials = false
        label="Individual upload"
        multiple
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:5038/sapsan/upload-template"
        withCredentials = false
        label="Batch upload"
        multiple
        batch
        style="max-width: 300px"
      />
    </div>
  </div>
</template> -->


<!-- <script>
import {  ref } from 'vue';

export default {
  components: { 

  },
  props: {
    progress: {
      type: Object,
      default: () => {return { loading: false, percentage: 0 }}
    },
    text: {
      type: String,
      default: () => ""
    },
    label: {
      type: String,
      default:  "myQButtonr"
    },
    myId: {
        type: String,
        default: () => "myQButtonr"
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    objectType: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default:  "amber"
    },
    background: {
      type: String,
      default:  "goldenrod"
    },
    tooltipText: {
      type: String,
      default:  ""
    },
    disableTooltipText: {
      type: String,
      default:  ""
    },
    textColor: {
      type: String,
      default:  "black"
    },
    disable: {
      type: Function,
      default: () => false
    },
  },
  methods:{
    click(){
      
      this.$emit('q-button-click', {senderProps: this.$props})
    }
  },
  computed:{
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text

    }
    
  },
  data(){
    return{
      date: ref(new Date())
    } 
  }
  ,
  mounted() {
    
  }
}
</script> -->