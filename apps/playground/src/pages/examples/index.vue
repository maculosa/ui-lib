<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent';
import dayjs from 'dayjs';
import { NButton, NSpace, NSwitch } from 'naive-ui';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const columns = ref([
  {
    title: 'Plate No',
    key: 'plate_no',
    valueType: 'text'
  },
  {
    title: 'State',
    key: 'state',
    valueType: 'select',
    options: [
      { label: '正常', value: 1 },
      { label: '停用', value: 0 }
    ],
    render(row) {
      return <NSwitch value="row.state" />
    }
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
    minWidth: 180
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row) {
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
  for (let i = 0; i < 20; i++) {
   arr.push({
     id: i,
     plate_no: `鲁Q·${i}43${i}2`,
     remark: `第${i}辆车`,
     created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
   })
  }

  return arr
}

const route = useRoute()
</script>

<template>
<div class="min-h-svh flex overflow-hidden p-2">
  <!-- <h2 class="my-0!">Example</h2> -->

  <div class="bg-amber-100 flex-1 flex overflow-hidden rounded-md border border-border p-4 shadow-sm"
    style="flex-direction: column;"
  >
    <div class="mb-3 border-b border-border pb-3">
      <h3 class="my-0! text-base font-semibold text-foreground">车队</h3>
      <p class="my-0! text-xs text-muted-foreground">车队信息</p>
    </div>
      <ProTable
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :autoFlex="true"
        :columnStorageKey="route.name"
      />
  </div>
</div>
</template>
