<template>
  <div class="hello">
    <md-table>
      <md-table-toolbar>        
        <h1 class="md-title">{{ parentMessage }}</h1>        
      </md-table-toolbar>
        
      <md-table-row>
        <md-table-head v-for="head in headers" :key="head.id">{{ head.name }}</md-table-head>        
      </md-table-row> 

      <md-table-row v-for="val in values" :key="val.id">
        <md-table-cell md-numeric>{{val.id}}</md-table-cell>
        <md-table-cell>{{val.nome}}</md-table-cell>
        <md-table-cell md-numeric>{{val.idade}}</md-table-cell>        
      </md-table-row>
      
    </md-table>
    
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    parentMessage: String,
    headers: Object,
    values: Object,
  }
}
</script>