<script setup lang="ts">
import { CircleBar } from '@banmao/datav'
</script>

<template>
  <div style="width: 100%; height: 600px">
    <CircleBar
      :title="{
        text: '3D Circle Bar',
      }"
      :data="[
        {
          name: '小米',
          value: 100,
        },
        {
          name: '华为',
          value: 200,
        },
        {
          name: '苹果',
          value: 300,
        },
        {
          name: 'OPPO',
          value: 400,
        },
        {
          name: 'vivo',
          value: 500,
        },
      ]"
      :legend="{
        show: false,
      }"
      :xAxis="{
        type: 'category',
      }"
      :yAxis="{
        type: 'value',
      }"
    />
  </div>
</template>
