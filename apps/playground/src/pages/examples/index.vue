<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent';
import dayjs from 'dayjs';
import { NButton, NSpace, NSwitch } from 'naive-ui';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const columns = ref([
  {
    type: 'selection',
    fixed: 'left'
  },
  {
    type: 'index',
    fixed: 'left'
  },
  {
    title: 'Plate No',
    key: 'plate_no',
    width: 140,
    valueType: 'text',
    fixed: 'left'
  },
  {
    title: 'State',
    key: 'state',
    width: 80,
    valueType: 'select',
    options: [
      { label: '正常', value: 1 },
      { label: '停用', value: 0 }
    ],
    render() {
      return <NSwitch value="row.state" />
    }
  },
  {
    title: '车架号',
    key: 'vin_no',
    valueType: 'text',
    copyable: true,
    width: 360
  },
  {
    title: '车辆类型',
    key: 'car_type',
    valueType: 'text'
  },
  {
    title: '车系',
    key: 'car_series',
    valueType: 'text'
  },
  {
    title: '司机',
    key: 'driver',
    valueType: 'text'
  },
  {
    title: '司机手机号',
    key: 'driver_phone',
    valueType: 'text'
  },
  {
    title: 'Remark',
    key: 'remark',
    hideInSearch: true
  },
  {
    title: 'Created At',
    key: 'created_at',
    hideInSearch: true,
    width: 180
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 148,
    render() {
      return (
        <NSpace>
          <NButton>修改</NButton>
          <NButton>删除</NButton>
        </NSpace>
      )
    }
  }
])

const dataSource = ref(generatePlateDataSource())

const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: dataSource.value.length
})

function generatePlateDataSource() {
  let arr = []
  for (let i = 0; i < 10; i++) {
   arr.push({
     id: i,
     plate_no: `鲁Q·${i}43${i}2`,
     state: 1,
     vin_no: `12345678901234567890123456789012`,
     car_type: `车辆类型${i}`,
     car_series: `车系${i}`,
     driver: `司机${i}`,
     driver_phone: `1380000000${i}`,
     remark: `第${i}辆车`,
     created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
   })
  }

  return arr
}

const route = useRoute()
</script>

<template>
<!-- <div class="min-h-svh flex overflow-hidden p-2">
  <h2 class="my-0!">Example</h2>

  <div class="bg-amber-100 flex-1 flex overflow-hidden rounded-md border border-border p-4 shadow-sm"
    style="flex-direction: column;"
  >
    <div class="mb-3 border-b border-border pb-3">
      <h3 class="my-0! text-base font-semibold text-foreground">车队</h3>
      <p class="my-0! text-xs text-muted-foreground">车队信息</p>
    </div>
      <ProTable
        remote
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        autoFlex
        :columnStorageKey="route.name"
      />
  </div>
</div> -->
  <div style="height: 500px;">
      <ProTable
        remote
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :columnStorageKey="route.name"
      />
  </div>
</template>
