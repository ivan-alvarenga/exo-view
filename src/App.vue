<template>
  <div id="app">    
    
    <div class="md-layout">
      <div class="md-layout-item md-size-30 md-alignment-left-center">
        <label>Planeta</label>
        <div><md-checkbox v-model="array" value="1">Nome</md-checkbox></div>        
        <div><md-checkbox v-model="array" value="1">Massa</md-checkbox></div>        
        <div><md-checkbox v-model="array" value="1">Massa Relativa(planeta/terra)</md-checkbox></div>        
        <div><md-checkbox v-model="array" value="1">Massa Relativa(planeta/júpiter)</md-checkbox></div>        
      </div>
      <div class="md-layout-item md-size-50">
        <md-field>
          <label>Pesquisar</label>
          <md-input v-model="initial"></md-input>
          <md-button>Nome do planeta</md-button>
        </md-field>
        <md-field>          
          <md-input v-model="initial"></md-input>
          <md-button>Nome do planeta</md-button>
        </md-field>
        <Home parentMessage="Bem-vindo ao explorador de exoplanetas" :headers="heads" :values="values"/>
      </div>
      <div class="md-layout-item"></div>
  </div>
    
  </div>
</template>

<script>
import Home from './components/Home/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  },
  data() {
    return {
      heads: [
        {
          id: 1,
          name: 'coluna 1',
        },
        {
          id: 2,
          name: 'coluna 2',          
        },
        {
          id: 3,
          name: 'coluna 3',
        },
      ],
      values: [
        { id: 1, nome: 'joão', idade: 23},
        { id: 2, nome: 'josé', idade: 32},
        { id: 3, nome: 'alberto', idade: 43},
      ],
    }
  },
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
