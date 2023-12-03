<script setup lang="ts">
// import test from '@components/test.vue'
import {ref, computed} from 'vue'
import axios from 'axios'
import pagenation from './components/pagenation.vue';
import Card from './components/card.vue';

type nameType = {
  name: string,
  url: string
}
type detailType = {
  img: string,
  abilities: {ability: {name: string}}[],
  base_experience: number,
  height: number,
  weight: number
}
type roleType = nameType & detailType
const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
const page = ref({
  size: 20,
  index: 1
}) 
const total = ref(0)
const totalPages = computed(()=>{
  return Math.ceil(total.value / page.value.size)
})

const targetUrl = computed(()=>{
  return baseUrl + `?limit=${page.value.size}&offset=${(page.value.index-1) * page.value.size}`
})
const roleList = ref<roleType[]>([])
async function getList() {
  const data = (await axios.get(targetUrl.value)).data
  total.value = data.count
  const tempNameArr = data.results as nameType[]
  roleList.value.splice(0)
  for (let i = 0; i < tempNameArr.length; i++) {
    let item = tempNameArr[i] 
    const data1 = (await axios.get(item.url)).data
    const detail ={
      ...data1,
      img: data1.sprites.back_default
    } as detailType
    roleList.value.push({
      name: item.name,
      url: item.url,
      ...detail
    }) 
  }
}
getList()
function jumpPage(i: number) {
  page.value.index = i
  getList()
}

</script>

<template>
  <div class="vw100 vh100 ovh flxC aiC">
    <div class='fl1 flxR wfull p20 bbox yauto flexwrap gap16'>
      <Card v-for="item in roleList" :key="item.name" :role="item" />
    </div>
    <div class="flxR h60 aiC jcC">
      <pagenation :page="page.index" :total="totalPages" @jump="jumpPage" />
    </div>
  </div>
  
</template>

<style scoped>
  .flexwrap {
    flex-wrap: wrap;
  }
  .yauto {
    overflow-y: auto;
  }
</style>
