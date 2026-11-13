<script setup lang="ts">
import { Watermark } from '@banmao/procomponent'
</script>

<template>
  <Watermark color="rgba(0, 0, 0, 0.06)" text="banmao" :rotate="-22" :gap="80">
    <div class="wm-sheet">
      <p class="wm-sheet-title">季度经营报表 · 内部资料</p>
      <p class="wm-sheet-line">营业收入 ¥1,284,500 同比增长 12.6%</p>
      <p class="wm-sheet-line">毛利率 38.2% 净利率 14.7%</p>
      <p class="wm-sheet-note">水印覆盖局部内容区域，防止敏感信息被截图外传。</p>
    </div>
  </Watermark>
</template>

<style scoped>
.wm-sheet {
  height: 160px;
  padding: 18px 20px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #e7e2d6;
}
.wm-sheet-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #141310;
}
.wm-sheet-line {
  margin: 0 0 6px;
  font-size: 13px;
  color: #4a463c;
}
.wm-sheet-note {
  margin: 14px 0 0;
  font-size: 12px;
  color: #9a958a;
}
</style>
