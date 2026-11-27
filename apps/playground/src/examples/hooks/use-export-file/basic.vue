<script setup lang="ts">
import { useExportFile } from '@banmao/hooks'
import { NAlert, NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

const rows = [
  ['工号', '姓名', '部门'],
  [1, '员工 1', '研发'],
  [2, '员工 2', '市场'],
  [3, '员工 3', '财务'],
]

function toCsv() {
  // 前置 BOM，避免 Excel 打开 UTF-8 中文乱码
  return new window.Blob(['\ufeff', rows.map(r => r.join(',')).join('\n')])
}

const count = ref(0)

function exportDefaultName() {
  useExportFile(toCsv())
  count.value += 1
}

function exportCustomName() {
  useExportFile(toCsv(), '员工名册.xls')
  count.value += 1
}
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NButton size="small" @click="exportDefaultName">默认文件名导出</NButton>
      <NButton size="small" type="primary" @click="exportCustomName">指定文件名导出</NButton>
      <span class="hint">已触发 {{ count }} 次下载</span>
    </NSpace>

    <NAlert type="warning" :bordered="false" title="文件名约定">
      Blob 的 MIME 固定为 <code>application/vnd.ms-excel</code>，因此文件名建议自带
      <code>.xls</code> / <code>.xlsx</code> 后缀。传入 <code>fileName</code> 时原样使用，不会追加时间戳；
      不传时用 <code>dayjs().format('yyyy-MM-dd hh:mm:ss')</code> 拼接，但 <code>yyyy</code> 与
      <code>dd</code> 并非合法 token，实际得到 <code>yyyy-11-Fr 10:20:31.xlsx</code> 这类名称，建议总是自己传。
    </NAlert>
  </NSpace>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}
</style>
