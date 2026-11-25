<script setup lang="ts">
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

/**
 * 工具栏全屏示例
 * 点击全屏图标后表格放大到浏览器视口，再次点击或按 Esc 还原
 */

const columns = [
  { title: '订单号', key: 'orderNo', valueType: 'text', minWidth: 160 },
  { title: '客户', key: 'customer', valueType: 'text', minWidth: 120 },
  { title: '金额', key: 'amount', valueType: 'digit', minWidth: 120 },
  { title: '下单时间', key: 'createdAt', valueType: 'datetime', minWidth: 180 },
]

const dataSource = ref(
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    orderNo: `SO2026112${String(index + 1).padStart(3, '0')}`,
    customer: ['张伟', '李娜', '王强', '刘敏'][index % 4],
    amount: 1280 + index * 137,
    createdAt: `2026-11-${String((index % 20) + 1).padStart(2, '0')} 10:2${index % 10}:00`,
  })),
)

/** 行 key 取值 */
function getRowKey(row: { id: number }) {
  return row.id
}

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: dataSource.value.length,
  prefix: ({ itemCount }: { itemCount?: number }) => `共 ${itemCount} 条`,
})
</script>

<template>
  <!-- 固定高度的容器中演示：全屏后表格会脱离容器、铺满浏览器视口 -->
  <div style="height: 300px; padding: 12px; border: 1px dashed #d9d9d9; border-radius: 6px; overflow: auto">
    <ProTable
      title="订单列表"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
      :row-key="getRowKey"
      :toolbar="{ createMode: 'button' }"
    />
  </div>
  <p style="margin-top: 8px; color: #888; font-size: 13px">
    点击工具栏的全屏图标可放大到浏览器视口，表格铺满可视区；再次点击或按 Esc 还原。
  </p>
</template>
