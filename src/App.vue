<template>
  <div id="app">

    <div class="md-layout">
      <md-list class="md-layout-item md-size-35 md-alignment-left-center">
        <md-list-item
          v-for="item in menu"
          :key="item.path"
          v-on:click="changeTable(item)"
        >{{item.title}}</md-list-item>
      </md-list>
      <div class="md-layout-item md-size-50">
        <h1 class="md-title">{{title}}</h1>
        <md-field>
          <label v-if="isInQuery('search')">Buscar</label>
          <md-input v-model="search" v-if="isInQuery('search')"/>
          <label v-if="isInQuery('st_age')">st_age</label>
          <md-input v-model="st_age" v-if="isInQuery('st_age')"/>
          <label v-if="isInQuery('pl_telescope')">pl_telescope</label>
          <md-input v-model="pl_telescope" v-if="isInQuery('pl_telescope')"/>
          <label v-if="isInQuery('id_planet')">id_planet</label>
          <md-input v-model="id_planet" v-if="isInQuery('id_planet')"/>
        </md-field>
        <Home parentMessage="Bem-vindo ao explorador de exoplanetas" :headers="heads" :values="filtered"/>
      </div>
      <div class="md-layout-item"></div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Home from './components/Home/Home.vue'
import querystring from 'querystring'

export default {
  name: 'app',
  components: {
    Home
  },
  data() {
    return {
      menu: [
        {
          path: 'planetas',
          title: 'Planetas',
          query: ['search'],
        },
        {
          path: 'planetas_massas',
          title: 'Planetas com as Massas',
          query: ['search'],
        },
        {
          path: 'planetas_descobertas',
          title: 'Planetas com Descobertas',
          query: ['search'],
        },
        {
          path: 'planetas_estrela_mais_velha_que',
          title: 'Planetas com estrela mais velha que `st_age`',
          query: ['st_age'],
        },
        {
          path: 'planetas_estrelas_host',
          title: 'Planetas com sua Host Star',
          query: ['search'],
        },
        {
          path: 'planetas_telescopios',
          title: 'Planetas descobertos pelo telescopio',
          query: ['pl_telescope'],
        },
        {
          path: 'planetas_sistema',
          title: 'Numero de Planetas por Sistema',
        },
        {
          path: 'estrelas_idade_media',
          title: 'Idade media das estrelas de um planeta',
          query: ['id_planet'],
        },
        {
          path: 'estrela_mais_antiga',
          title: 'Estrela mais antiga de cada planeta',
          query: ['search'],
        },
      ],
      title: 'Planetas',
      path: 'planetas',
      queryParams: {},
      query: ['search'],
      id_planet: null,
      st_age: null,
      pl_telescope: null,
      search: '',
      heads: [],
      values: [],
    }
  },
  asyncComputed: {
    filtered: function() {
      // var self=this;
      // return this.values.filter(
      //   function(item) {
      //     return item['pl_name']
      //       .toLowerCase()
      //       .indexOf(self.search.toLowerCase())>-1;
      //   }
      // );
      // const res = await apiGET('Planet', this.search)
      // return res.results
      const query = (this.query || {}).reduce((p,c) => ({...p, [c]: this[c]}), {})
      return apiGET(this.path, query).then(res => res.results)
    },
  },
  methods: {
    changeTable: function(param) {
      this.title = param.title
      this.path = param.path
      this.query = param.query || []
      // const query = (this.query || {}).reduce((p,c) => ({...p, [c]: self[c]}), {})
      apiGET(this.path, {}).then(res => {
        this.values = res.results
        this.heads = res.fields
      })
    },
    isInQuery: function(prop) {
      return (this.query||[]).indexOf(prop) > -1
    },
  },
  mounted() {
    apiGET('planetas').then(res => {
      this.values = res.results
      this.heads = res.fields
    })
  },
}

const apiGET = (param,attrs={}) => {
  try {
    let query = {v: Date.now()}
    query = Object.keys(attrs).reduce((p,c) => ({...p, [c]: attrs[c]}),query)
    const queryString = querystring.stringify(query)
    const url = `${process.env.VUE_APP_API_ENDPOINT}/${param}?${queryString}`
    return axios.get(url).then((res) => ({
      results: res.data.results,
      fields: res.data.fields
    }))
  } catch (error) {
    throw error
  }
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
