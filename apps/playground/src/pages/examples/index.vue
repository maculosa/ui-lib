<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import dayjs from 'dayjs'
import { NButton, NSpace, NSwitch, useMessage } from 'naive-ui'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/layout/layout/index.vue'
import Header from '@/layouts/header/index.vue'
import { locale, t } from '@/locales'

const message = useMessage()
const route = useRoute()

function createColumns() {
  return [
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
        { label: t('examples.stateActive'), value: 1 },
        { label: t('examples.stateDisabled'), value: 0 },
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
      title: t('examples.colVinNo'),
      key: 'vin_no',
      valueType: 'text',
      copyable: true,
      width: 360,
    },
    {
      title: t('examples.colCarType'),
      key: 'car_type',
      valueType: 'text',
    },
    {
      title: t('examples.colCarSeries'),
      key: 'car_series',
      valueType: 'text',
    },
    {
      title: t('examples.colDriver'),
      key: 'driver',
      valueType: 'text',
    },
    {
      title: t('examples.colDriverPhone'),
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
              onClick={() => message.info(t('examples.demoEditMessage', { plateNo: row.plate_no }))}
            >
              {t('examples.edit')}
            </NButton>
            <NButton size="small" type="error" ghost onClick={() => handleDelete(row)}>
              {t('examples.delete')}
            </NButton>
          </NSpace>
        )
      },
    },
  ]
}

const columns = ref(createColumns())

const dataSource = ref(generatePlateDataSource())

const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: dataSource.value.length,
})

// 语言切换时原地更新文案：ProTable 在 setup 时已捕获列数组，整体替换会失效；
// 行数据原地更新则可保留状态开关与已删除的结果。
watch(locale, () => {
  createColumns().forEach((column, index) => Object.assign(columns.value[index], column))
  dataSource.value.forEach(row => Object.assign(row, sampleText(row.id)))
})

function handleDelete(row: any) {
  dataSource.value = dataSource.value.filter(item => item.id !== row.id)
  pagination.value.itemCount = dataSource.value.length
  message.success(t('examples.deletedMessage', { plateNo: row.plate_no }))
}

/** 示例行中需要跟随语言切换的文案 */
function sampleText(index: number) {
  return {
    car_type: t('examples.sampleCarType', { index }),
    car_series: t('examples.sampleCarSeries', { index }),
    driver: t('examples.sampleDriver', { index }),
    remark: t('examples.sampleRemark', { index }),
  }
}

function generatePlateDataSource() {
  const arr = []
  for (let i = 0; i < 10; i++) {
    arr.push({
      id: i,
      plate_no: `鲁Q·${i}43${i}2`,
      state: 1,
      vin_no: `12345678901234567890123456789012`,
      ...sampleText(i),
      driver_phone: `1380000000${i}`,
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
        <h1 class="page-title">{{ t('examples.pageTitle') }}</h1>
        <p class="page-desc">
          {{ t('examples.pageDesc') }}
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
            auto-flex
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
  display: flex;
  flex-direction: column;
  height: 720px;
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
    height: 560px;
    padding: 10px;
  }

  .table-frame-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>