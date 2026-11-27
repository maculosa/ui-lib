<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import { useList } from '@banmao/hooks'
import dayjs from 'dayjs'
import { NButton, NSpace, NSwitch, useMessage } from 'naive-ui'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/layout/layout/index.vue'
import Header from '@/layouts/header/index.vue'
import { locale, t } from '@/locales'

/** 表格行数据结构 */
interface PlateRow {
  /** 行唯一标识 */
  id: number
  /** 车牌号 */
  plate_no: string
  /** 状态：1 正常，0 停用 */
  state: number
  /** 车架号 */
  vin_no: string
  /** 车辆类型 */
  car_type: string
  /** 车系 */
  car_series: string
  /** 司机 */
  driver: string
  /** 司机手机号 */
  driver_phone: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  created_at: string
}

const message = useMessage()
const route = useRoute()

/** 模拟接口延时（毫秒），用于观察 loading 与快速翻页时的竞态处理 */
const MOCK_DELAY = 600

/** 模拟服务端存储：查询、删除都作用在这份数据上 */
const mockRows: PlateRow[] = generatePlateDataSource()

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
      title: 'Color',
      key: 'color',
      valueType: 'text',
    },
    {
      title: 'Plate No',
      key: 'plate_no',
      width: 140,
      valueType: 'text',
      fixed: 'left',
    },
    {
      title: t('examples.colDriverPhone'),
      key: 'driver_phone',
      hideInTable: true,
      valueType: 'text',
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
      title: t('examples.colDriver'),
      key: 'driver',
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
      title: 'Action',
      key: 'action',
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

/** 搜索条件，由 useList 带入下一次请求 */
const searchModel = ref<Record<string, any>>({})

/**
 * 模拟分页查询接口，返回 useList 约定的响应结构
 * @param params 分页信息与搜索条件
 * @returns 状态码与列表、总数、页码、每页条数
 */
async function fetchPlateList(params: Record<string, any>) {
  const { pageNum, pageSize, ...query } = params
  await delay(MOCK_DELAY)

  const rows = mockRows.filter(row =>
    Object.entries(query).every(([key, value]) => {
      // 空条件不参与过滤，但需保留 0（状态“停用”）
      if (value === '' || value === null || value === undefined) return true
      const cell = (row as any)[key]
      if (typeof cell === 'number') return cell === value
      return String(cell ?? '').toLowerCase().includes(String(value).toLowerCase())
    }),
  )

  return {
    status: 200,
    data: {
      list: rows.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      total: rows.length,
      pageNum,
      pageSize,
    },
  }
}

const {
  dataSource,
  loading,
  pagination,
  loadData,
  handlePageChange,
  handlePageSizeChange,
} = useList(fetchPlateList, { filterOption: searchModel })

// 与页面既有分页保持一致：每页 20 条
pagination.value.pageSize = 20

/** 模拟网络延时 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 搜索：同步查询条件后回到第一页重新请求
 * @param params 搜索表单值
 * @returns 请求完成后的 Promise，供 ProTable 控制搜索 loading
 */
async function handleQuery(params: Record<string, any>) {
  searchModel.value = params
  await loadData(1)
}

// 语言切换时原地更新文案：ProTable 在 setup 时已捕获列数组，整体替换会失效；
// 行数据原地更新则可保留状态开关与已删除的结果，再重新请求刷新当前页。
watch(locale, () => {
  createColumns().forEach((column, index) => Object.assign(columns.value[index], column))
  mockRows.forEach(row => Object.assign(row, sampleText(row.id)))
  loadData()
})

/**
 * 删除一行：先更新模拟服务端数据，再重新请求当前页
 * @param row 待删除的行
 */
function handleDelete(row: PlateRow) {
  const index = mockRows.findIndex(item => item.id === row.id)
  if (index === -1) return

  mockRows.splice(index, 1)
  message.success(t('examples.deletedMessage', { plateNo: row.plate_no }))
  loadData()
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

/**
 * 生成模拟数据
 * @returns 100 条车队数据
 */
function generatePlateDataSource(): PlateRow[] {
  const arr: PlateRow[] = []
  for (let i = 0; i < 100; i++) {
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
            {{ pagination.itemCount }} ROWS · COLUMN SETTINGS PERSISTED
          </span>
        </div>
        <div class="table-frame-body">
          <ProTable
            remote
            auto-flex
            :columns="columns"
            :data="dataSource"
            :loading="loading"
            :pagination="pagination"
            :row-key="(row: any) => row.id"
            :columnStorageKey="route.name"
            :on-query="handleQuery"
            @load-data="loadData"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
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