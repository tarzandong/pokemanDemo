<script setup lang="ts">
// import test from '@components/test.vue'
import {ref, computed} from 'vue'
import axios from 'axios'
import pagenation from './components/pagenation.vue'
import Card from './components/card.vue'
import to from 'await-to-js'

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
  const [err,data] =await to(axios.get(targetUrl.value))
  if (err) console.log(err)
  total.value = data?.data.count
  const tempNameArr = data?.data.results as nameType[]
  roleList.value.splice(0)
  for (let i = 0; i < tempNameArr.length; i++) {
    let item = tempNameArr[i] 
    const [err1, ret] = await to(axios.get(item.url))
    if (err1) console.log(err1)
    const data1 = ret?.data
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

const resultList = computed(()=>{
  console.log(nameWord.value)
  let temp = [] as roleType[]
  if (nameWord.value) {
    temp = roleList.value.filter(item => item.name.includes(nameWord.value))
  } else {
    temp = roleList.value
  }
  return temp.sort((a,b)=>{
    if (experienceSort.value === 'asc') {
      return a.base_experience - b.base_experience
    } else {
      return b.base_experience - a.base_experience
    }
  })
})

const nameWord = ref('')
	const experienceSort = ref("desc") 
</script>

<template>
  <div class="vw100 vh100 ovh flxC aiC">
    <div class='fl1 flxR wfull p20 bbox yauto flexwrap gap16'>
      <Card v-for="item in resultList" :key="item.name" :role="item" />
    </div>
    <div class="flxR h60 aiC jcC">
      <pagenation :page="page.index" :total="totalPages" @jump="jumpPage" />
      <input v-model="nameWord" class="ml20 fs16 w200 h28" placeholder="search name" />
      <div class="ml20">Sort by Experience</div>
      <div class="bcgray1 flxR ml5 pl5 pr5 bdr4">
        <input type="radio" value="asc" name="sort" v-model="experienceSort" />asc
        <input type="radio" value="desc" name="sort" v-model="experienceSort" />desc
      </div>
      
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
