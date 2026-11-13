export const zh = {
  workshopTitle: '图表工坊',
  workshopDesc:
    '左侧控制台实时驱动右侧真实 Chart 组件：改类型、调柱宽、换配色，每一次拖动都即时生效。调出满意的组合后，一键导出 PNG。',
  controlDeck: 'CONTROL DECK · 控制台',
  moreCharts: 'MORE CHARTS · 更多图表',
  stageNote: '图表始终以纸面亮色渲染，导出即所得。',

  chartTitleLabel: '图表标题',
  titlePlaceholder: '输入标题',
  chartTypeLabel: '图表类型',
  typeBar: '柱状',
  typeLine: '折线',
  typeScatter: '散点',
  verticalLabel: '垂直布局',
  barWidthLabel: '柱体宽度',
  gradientLabel: '渐变配色',
  legendLabel: '显示图例',
  seriesALabel: '系列 A · {name}',
  seriesBLabel: '系列 B · {name}',
  reset: '重置',
  randomize: '随机数据',
  exportPng: '导出 PNG',

  defaultChartTitle: '本周销售趋势',
  seriesSales: '销售额',
  seriesVisits: '访问量',
  resetSuccess: '已恢复默认参数',
  exportNotReady: '图表尚未渲染完成，请稍后再试',
  exportSuccess: '已导出 PNG 图片',

  galleryChartName: 'Chart 通用图表',
  galleryChartDesc: '柱状 / 折线 / 散点',
  galleryPieName: 'Pie 饼图',
  galleryPieDesc: '环形 / 玫瑰 / 半圆',
  galleryCircleBarName: 'CircleBar 圆形柱',
  galleryCircleBarDesc: '3D 圆柱柱状图',
  galleryCubeBarName: 'CubeBar 立方柱',
  galleryCubeBarDesc: '3D 立方柱状图',

  barLineTitle: '柱状 · 折线 · 散点',
  barLineDesc:
    'Chart 是通用直角坐标图表：同一份双系列数据，可在柱状、折线、散点之间切换，支持横向布局、柱宽调节与渐变配色。下方控件即时生效，右侧画布固定亮色纸感底，保证两种站点主题下读数一致。',
  titleLabel: '标题',
  titleInputPlaceholder: '图表标题',
  horizontalLabel: '横向布局',
  barWidthShortLabel: '柱宽',
  seriesColorLabel: '系列颜色',
  gradientColorLabel: '渐变颜色',
  barLineStageNote:
    '提示：Chart 内部固定使用 ECharts 亮色主题，画布因此保持纸白底；站点切换暗色时图表读数不受影响。',

  circleBarTitle: '3D 环形柱状图',
  circleBarDesc:
    'CircleBar 用象形柱（pictorialBar）的椭圆顶盖、底环叠加渐变柱身，在 2D 画布上拼出立体圆柱的视觉效果，适合大屏展示与品牌占比对比。无需 WebGL，兼容性好；图表内部固定亮色主题，承载于纸感画布之上。',
  circleBarNote:
    '提示：立体效果由 2D 象形柱叠加绘制，不依赖 WebGL，在绝大多数设备上都能稳定渲染；柱顶数值标签随数据实时更新。',

  cubeBarTitle: '3D 立方柱状图',
  cubeBarDesc:
    'CubeBar 通过自定义系列（custom series）的 renderItem 逐面绘制立方体的顶面与侧棱，在 2D 画布上堆叠出立体体量，适合数据大屏与汇报场景。无需 WebGL，渲染轻量；图表内部固定亮色主题，承载于纸感画布之上。',
  cubeBarNote:
    '提示：立方体由自定义系列在 2D 画布上逐面绘制，不依赖 WebGL，兼容性好；调整数据即重新计算各柱体量与透视面。',

  pieTitle: '饼图家族',
  pieDesc:
    '同一份数据，七种形态。Pie 覆盖基础饼图、环形、圆角、半环与玫瑰图，Pie3D 以 WebGL 渲染立体饼图。所有图表内部固定使用亮色主题，因此统一承载于纸感画布之上。',
  pieVariantBasic: '基础饼图',
  pieVariantDoughnut: '环形图',
  pieVariantCorner: '圆角环形图',
  pieVariantHalf: '半环形图',
  pieVariantRoseDoughnut: '玫瑰环形图',
  pieVariantRose: '玫瑰饼图',
  pieVariant3d: '3D 饼图',
  brandXiaomi: '小米',
  brandHuawei: '华为',
  brandApple: '苹果',
}

export const en = {
  workshopTitle: 'Chart atelier',
  workshopDesc:
    'The control deck on the left drives a real Chart component on the right: switch types, tune bar width, swap palettes — every drag applies instantly. Once you like the combination, export a PNG in one click.',
  controlDeck: 'CONTROL DECK',
  moreCharts: 'MORE CHARTS',
  stageNote: 'Charts always render on light paper — what you export is what you see.',

  chartTitleLabel: 'Chart title',
  titlePlaceholder: 'Enter a title',
  chartTypeLabel: 'Chart type',
  typeBar: 'Bar',
  typeLine: 'Line',
  typeScatter: 'Scatter',
  verticalLabel: 'Vertical layout',
  barWidthLabel: 'Bar width',
  gradientLabel: 'Gradient palette',
  legendLabel: 'Show legend',
  seriesALabel: 'Series A · {name}',
  seriesBLabel: 'Series B · {name}',
  reset: 'Reset',
  randomize: 'Randomize data',
  exportPng: 'Export PNG',

  defaultChartTitle: 'Weekly sales trend',
  seriesSales: 'Sales',
  seriesVisits: 'Visits',
  resetSuccess: 'Defaults restored',
  exportNotReady: 'The chart has not finished rendering. Try again in a moment.',
  exportSuccess: 'PNG exported',

  galleryChartName: 'Chart',
  galleryChartDesc: 'Bar / line / scatter',
  galleryPieName: 'Pie',
  galleryPieDesc: 'Doughnut / rose / half',
  galleryCircleBarName: 'CircleBar',
  galleryCircleBarDesc: '3D cylinder bars',
  galleryCubeBarName: 'CubeBar',
  galleryCubeBarDesc: '3D cube bars',

  barLineTitle: 'Bar · Line · Scatter',
  barLineDesc:
    'Chart is a general-purpose Cartesian chart: one dual-series dataset switches between bar, line and scatter, with horizontal layout, bar-width tuning and gradient palettes. The controls below apply instantly, and the canvas keeps a fixed light paper background so readings stay identical under both site themes.',
  titleLabel: 'Title',
  titleInputPlaceholder: 'Chart title',
  horizontalLabel: 'Horizontal layout',
  barWidthShortLabel: 'Bar width',
  seriesColorLabel: 'Series colors',
  gradientColorLabel: 'Gradient colors',
  barLineStageNote:
    'Note: Chart always uses the ECharts light theme internally, so the canvas keeps its paper-white background; switching the site to dark mode does not affect chart readings.',

  circleBarTitle: '3D circle bar chart',
  circleBarDesc:
    'CircleBar stacks an elliptical cap and base ring from pictorialBar over a gradient body to build a solid cylinder on a 2D canvas — a good fit for big-screen displays and brand-share comparisons. No WebGL required, so compatibility is excellent; the chart keeps a fixed light theme on a paper-like canvas.',
  circleBarNote:
    'Note: the 3D effect is drawn by stacking 2D pictorial bars with no WebGL dependency, so it renders reliably on almost any device; the value labels on top update live with the data.',

  cubeBarTitle: '3D cube bar chart',
  cubeBarDesc:
    'CubeBar uses a custom series renderItem to draw each cube face and side edge, stacking solid volume on a 2D canvas — a good fit for data walls and reporting decks. No WebGL and lightweight rendering; the chart keeps a fixed light theme on a paper-like canvas.',
  cubeBarNote:
    'Note: cubes are drawn face by face on a 2D canvas via a custom series, with no WebGL dependency and broad compatibility; changing the data recomputes each bar volume and its perspective faces.',

  pieTitle: 'The pie family',
  pieDesc:
    'One dataset, seven shapes. Pie covers the basic pie, doughnut, rounded, half and rose variants, while Pie3D renders a solid pie with WebGL. Every chart uses a fixed light theme internally, so they all sit on the same paper-like canvas.',
  pieVariantBasic: 'Basic pie',
  pieVariantDoughnut: 'Doughnut',
  pieVariantCorner: 'Rounded doughnut',
  pieVariantHalf: 'Half doughnut',
  pieVariantRoseDoughnut: 'Rose doughnut',
  pieVariantRose: 'Rose pie',
  pieVariant3d: '3D pie',
  brandXiaomi: 'Xiaomi',
  brandHuawei: 'Huawei',
  brandApple: 'Apple',
}