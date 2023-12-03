<template>
  <div class="flxR aiC gap10">
    
    <div class="w30 h30 lh30 taC bcgray" :class="{canpress: props.page > 1}"  @click="$emit('jump', props.page - 1)"> &lt </div>
    <div class="w30 h30 lh30 taC bcgray" :class="{canpress: props.page > 1}"  @click="$emit('jump', 1)" v-if="props.page > 3"> 1 </div>
    <div class="w30 h30 lh30 taC bcgray canpress" @click="$emit('jump', props.page - 5 > 0 ? props.page -5 : 1)" v-if="props.page > 4"> ... </div>
    <div v-for="i in showPages">
      <div class="w30 h30 lh30 taC bcgray" :class="{bcgray1: props.page == i, canpress: props.page !== i }" @click="$emit('jump', i)">{{ i }}</div>
    </div>
    <div class="w30 h30 lh30 taC bcgray canpress" @click="$emit('jump', props.page + 5 > props.total ? props.total : props.page +5)" v-if="props.page < props.total - 3"> ... </div>
    <div class="w30 h30 lh30 taC bcgray" :class="{bcgray1: props.page == props.total, canpress: props.page !== props.total }" @click="$emit('jump', props.total)" v-if="props.page < props.total - 2"> {{ props.total }} </div>
    <div class="w30 h30 lh30 taC bcgray" :class="{canpress: props.page < props.total}"  @click="$emit('jump', props.page + 1)">&gt</div>
    <!-- <div class="w30 h30 lh30 taC bcgray" :class="{canpress: props.page < props.total}"  @click="$emit('jump', props.total)">&gt&gt</div> -->
  </div>
</template>

<script lang='ts' setup>
import { defineProps, defineEmits, computed } from 'vue';
const props = defineProps<{
  page:number,
  total:number
}>()

const emits = defineEmits<{
  (event: 'jump', page: number): void
}>()
const showPages = computed(()=>{
  return props.page < 4 ? [1, 2, 3, 4, 5] : props.page > props.total - 3? [props.total - 4, props.total - 3, props.total - 2, props.total - 1, props.total] : [props.page - 2, props.page - 1, props.page, props.page + 1, props.page + 2]
})
</script>

<style lang='scss' scoped>
  .canpress {
    cursor: pointer;
    &:hover {
      z-index: 10;
      background: colors(warning);
    };
    &:active {
      box-shadow: 1px 1px 3px 3px colors(shadows);
    }
  }
  

</style>