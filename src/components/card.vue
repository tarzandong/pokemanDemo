<template>
  <div class="w330 h200 bdr8 pb5 bbox bcgray flxC aiC jcC">
    <div class="flxR aiC wfull jcSB">
      <img :src="props.role.img" class="w100 h100" />
      <div class="fl1 taC fs24 fwb">{{ props.role.name }}</div>
    </div>
    <div class="flxR jcSB gap5 mt5 fs12 h90 wfull pl5 pr5 bbox">
      <div class="flxC bcgray1 p10 bdr4 fl1">
        <div class="fs14">Abilities</div>
        <div v-for="item in props.role.abilities" >{{ item.ability.name }}</div>
      </div>
      <div class="flxC bcgray1 p10 bdr4">
        <div class="fs14">profile</div>
        <div class="flxR gap10">
          <div >Height: {{ props.role.height }}</div>
          <div >Weight: {{ props.role.weight }}</div>
        </div>
        
        <div >Base Experience: {{ props.role.base_experience }}</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { defineProps, defineEmits } from 'vue';
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
const props = defineProps<{
  role: roleType
}>()

</script>

<style lang='scss' scoped>

</style>