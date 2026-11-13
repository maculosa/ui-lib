<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import dayjs from 'dayjs'
import { NButton, NSpace, NSwitch, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/layout/layout/index.vue'
import Header from '@/layouts/header/index.vue'

const message = useMessage()
const route = useRoute()

const columns = ref([
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    type: 'index',
    fixed: 'left',
  },
  {
    title: 'Plate No',
    key: 'plate_no',
    width: 140,
    valueType: 'text',
    fixed: 'left',
  },
  {
    title: 'State',
    key: 'state',
    width: 80,
    valueType: 'select',
    options: [
      { label: '正常', value: 1 },
      { label: '停用', value: 0 },
    ],
    render(row: any) {
      return (
        <NSwitch
          value={row.state === 1}
          onUpdate:value={(v: boolean) => {
            row.state = v ? 1 : 0
          }}
        />
      )
    },
  },
  {
    title: '车架号',
    key: 'vin_no',
    valueType: 'text',
    copyable: true,
    width: 360,
  },
  {
    title: '车辆类型',
    key: 'car_type',
    valueType: 'text',
  },
  {
    title: '车系',
    key: 'car_series',
    valueType: 'text',
  },
  {
    title: '司机',
    key: 'driver',
    valueType: 'text',
  },
  {
    title: '司机手机号',
    key: 'driver_phone',
    hideInTable: true,
    valueType: 'text',
  },
  {
    title: 'Remark',
    key: 'remark',
    hideInSearch: true,
  },
  {
    title: 'Created At',
    key: 'created_at',
    hideInSearch: true,
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 148,
    render(row: any) {
      return (
        <NSpace size={8}>
          <NButton
            size="small"
            onClick={() => message.info(`演示操作：修改 ${row.plate_no}`)}
          >
            修改
          </NButton>
          <NButton size="small" type="error" ghost onClick={() => handleDelete(row)}>
            删除
          </NButton>
        </NSpace>
      )
    },
  },
])

const dataSource = ref(generatePlateDataSource())

const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: dataSource.value.length,
})

function handleDelete(row: any) {
  dataSource.value = dataSource.value.filter(item => item.id !== row.id)
  pagination.value.itemCount = dataSource.value.length
  message.success(`已删除 ${row.plate_no}`)
}

function generatePlateDataSource() {
  const arr = []
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
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  }
  return arr
}
</script>

<template>
  <Layout>
    <Header />
    <main class="examples-main">
      <header class="page-head">
        <p class="bm-mono-label page-kicker">PLAYGROUND · LIVE EXAMPLE</p>
        <h1 class="page-title">在线示例</h1>
        <p class="page-desc">
          一个完整的 ProTable 远程数据场景：车队管理。搜索表单、列设置持久化、状态开关、复制车架号与行内操作全部真实可用，
          删除会即时更新数据与分页计数。
        </p>
      </header>

      <section class="table-frame bm-corner-marks">
        <div class="table-frame-bar">
          <span class="bm-mono-label">FLEET / REMOTE TABLE</span>
          <span class="bm-mono-label table-frame-meta">
            {{ dataSource.length }} ROWS · COLUMN SETTINGS PERSISTED
          </span>
        </div>
        <div class="table-frame-body">
          <ProTable
            remote
            :columns="columns"
            :data="dataSource"
            :pagination="pagination"
            :row-key="(row: any) => row.id"
            :columnStorageKey="route.name"
          />
        </div>
      </section>
    </main>
  </Layout>
</template>

<style scoped>
.examples-main {
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
  padding: calc(var(--layout-header-height) + 40px) 28px 96px;
}

.page-kicker {
  color: var(--color-primary);
}

.page-title {
  margin: 10px 0 12px;
  font-family: var(--font-serif);
  font-size: 36px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--color-foreground);
}

.page-desc {
  max-width: 640px;
  margin: 0 0 28px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}

.table-frame {
  position: relative;
  border: 1px solid var(--color-divider);
  border-radius: 16px;
  background: var(--color-surface);
  overflow: hidden;
  box-shadow: 0 24px 60px -40px var(--color-shadow);
}

.table-frame-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 18px;
  border-bottom: 1px dashed var(--color-divider);
  color: var(--color-foreground-secondary);
}

.table-frame-meta {
  color: var(--color-primary);
}

.table-frame-body {
  height: 560px;
  padding: 16px;
}

@media (max-width: 720px) {
  .examples-main {
    padding: calc(var(--layout-header-height) + 24px) 16px 64px;
  }

  .page-title {
    font-size: 28px;
  }

  .table-frame-body {
    height: 480px;
    padding: 10px;
  }

  .table-frame-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>