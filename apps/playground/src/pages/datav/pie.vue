<script setup lang="ts">
import { Pie, Pie3D } from '@banmao/datav'
import { ref } from 'vue'

const data = ref([
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
])
</script>

<template>
  <div style="width: 100%; display: grid; gap: 16px; grid-template-columns: 1fr 1fr">
    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{
          text: 'Pie',
        }"
        :data="data"
        :legend="{
          show: false,
        }"
        label
        label-position="inside"
      />
    </div>

    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{ text: 'Doughnut Pie' }"
        :data="data"
        :legend="{
          show: false,
        }"
        type="doughnut"
        label-position="center"
      />
    </div>

    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{ text: 'Doughnut Pie with Rounded Corner' }"
        :data="data"
        :legend="{
          show: false,
        }"
        type="doughnut"
        corner
        label
      />
    </div>

    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{ text: 'Half Doughnut Pie' }"
        :data="data"
        :legend="{
          top: 'bottom',
        }"
        type="doughnut"
        corner
        half
        label
        label-position="inside"
      />
    </div>

    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{ text: 'Rose Doughnut Pie with corner' }"
        :data="data"
        :legend="{
          top: 'bottom',
        }"
        type="doughnut"
        min-radius="5%"
        max-radius="50%"
        :padAngle="1"
        rose
        corner
        label
        label-position="outside"
      />
    </div>
    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie
        :title="{ text: 'Rose Pie' }"
        :data="data"
        :legend="{
          top: 'bottom',
        }"
        type="pie"
        rose
        label
        label-position="outside"
      />
    </div>

    <div style="height: 300px; border: 1px solid #e5e5e5; border-radius: 8px">
      <Pie3D
        :title="{ text: 'Rose Pie' }"
        :data="data"
        :legend="{
          top: 'bottom',
        }"
        type="pie"
        rose
        label
        label-position="outside"
      />
    </div>
  </div>
</template>
