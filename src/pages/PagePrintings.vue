<template>
   <div>
    
   </div>
</template>
  
  <script>
  
  
 
  
  export default {
    components: {
      
 
    },
    methods: {
      
      rowClick(e) {

        this.detailsDataSource = [e.data]
       //this.loadFilesTest(e.values[0])
    },
      async reloadPrintings() {
        this.loading = true;        
        await this.loadPrintings()
        this.loading = false;
      },
      
      onResize(e) {
          this.gridHeight = e.detail.height;
      },
    },
    data() {
      return {
        loading: true,
        gridHeight: 400,
        detailsDataSource: null,
      }
    },
    computed: {
     
      columns() {
        return [{  
           
            dataField: "Id",
            caption: "Id",
          }, {  
            dataField: "Name",
            caption: "Name",
          }, {  
            dataField: "Type" ,
            caption: "Type",
          }, {  
            dataField: "SapsanId",
            caption: "SapsanId",         
          }, 
          {  
            dataField: "Description",
            caption: "Description",       
            //cellTemplate:"mySuperTemplate"  
          }, 
          {  
            dataField: "DtSend",
            caption: "DtSend",         
          }, 
          {  
            dataField: "DtPrint",
            caption: "DtPrint",         
          }, 
          {  
            dataField: "SendRemark",
            caption: "SendRemark",         
          }, 
          {  
            dataField: "PrintRemark",
            caption: "PrintRemark",         
          }, 
          {  
            dataField: "IsMyselfPrinting",
            caption: "IsMyselfPrinting",         
          }, 
          {  
            dataField: "ResultPrint",
            caption: "ResultPrint",         
          }, 
          {  
            dataField: "UserSendPrint",
            caption: "UserSendPrint",         
          }, 
          {  
            dataField: "ShifrContract",
            caption: "ShifrContract",         
          }, 
          {  
            dataField: "ShifrStage",
            caption: "ShifrStage",         
          }, 
          {  
            dataField: "IsResultPrint",
            caption: "IsResultPrint",         
          }, 
          {  
            dataField: "ShortPakage",
            caption: "ShortPakage",         
          }, 
          {  
            dataField: "OtdelName",
            caption: "OtdelName",         
          }, 
        ];
      },
      
    },
    async mounted() {
      
      await this.reloadPrintings();
    }
  };
  </script>
  
  <style>
  
   </style>