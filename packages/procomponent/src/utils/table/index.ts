// import { Icon } from '@iconify/vue'
import { NTooltip } from 'naive-ui'
import { Comment, isVNode } from 'vue'
import { ProText } from '@components/ProText'
import TableIndex from '../../components/ProTable/src/components/TableIndex'
import { h } from 'vue'
import BmIconInfoCircle from '~icons/bm-icon/info-circle'

/** 未配置宽度的普通列的默认估算宽度（px） */
const DEFAULT_COLUMN_WIDTH = 140
/** selection / expand 等特殊列的默认宽度（px），与 naive-ui 默认值保持一致 */
const SPECIAL_COLUMN_WIDTH = 48
/** extractVNodeText 递归深度上限，防止异常渲染函数导致超深递归 */
const MAX_EXTRACT_DEPTH = 5

/**
 * 从 VNode 树中递归提取纯文本
 * @param source - 渲染输出，可为字符串、数字、VNode 或其数组
 * @param depth - 当前递归深度
 * @returns 提取出的文本；无法解析的部分返回空字符串
 * @description 用于估算渲染函数标题的宽度：仅提取文本节点；
 * 组件内部的渲染结果（如 NEllipsis 包裹的文本）无法静态解析，返回空串由兜底宽度处理。
 */
function extractVNodeText(source: unknown, depth = 0): string {
  // 超深递归或空值直接放弃
  if (depth > MAX_EXTRACT_DEPTH || source == null || typeof source === 'boolean') return ''
  // 基本类型直接作为文本
  if (typeof source === 'string' || typeof source === 'number') return String(source)
  // 数组（Fragment / 多子节点）：逐项递归拼接
  if (Array.isArray(source)) {
    return source.map(item => extractVNodeText(item, depth + 1)).join('')
  }
  if (!isVNode(source)) return ''
  // 注释节点不占宽度
  if (source.type === Comment) return ''
  const { children } = source
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return extractVNodeText(children, depth + 1)
  // 插槽对象：仅尝试 default 插槽，执行失败则忽略
  if (
    children
    && typeof children === 'object'
    && typeof (children as Record<string, any>).default === 'function'
  ) {
    try {
      return extractVNodeText((children as Record<string, any>).default(), depth + 1)
    } catch {
      return ''
    }
  }
  return ''
}

/**
 * 获取列标题的纯文本
 * @param column - 列配置对象
 * @returns 标题文本；渲染函数执行失败或无法解析时返回空字符串
 * @description 兼容字符串标题、渲染函数标题（title: () => VNodeChild）与 VNode 标题三种写法。
 */
function getColumnTitleText(column: Record<string, any>): string {
  const { title } = column
  if (typeof title === 'string') return title
  // 渲染函数标题：执行后从 VNode 树提取文本，
  // 依赖组件上下文（inject 等）的渲染函数会执行失败，交由兜底宽度处理
  if (typeof title === 'function') {
    try {
      return extractVNodeText(title())
    } catch {
      return ''
    }
  }
  if (isVNode(title)) return extractVNodeText(title)
  return ''
}

/**
 * 解析宽度配置值
 * @param value - 宽度配置，兼容 number 与 '100px' 两种写法
 * @returns 解析出的数值宽度；无效（非数值或非正数）时返回 undefined
 */
function parseWidth(value: unknown): number | undefined {
  const width = typeof value === 'number' ? value : Number.parseFloat(value as string)
  return Number.isFinite(width) && width > 0 ? width : undefined
}

/**
 * 估算单列的渲染宽度（px）
 * @param column - 列配置对象
 * @returns 估算出的列宽度
 * @description 用于自动计算表格 scroll-x：优先取列配置的 width，
 * 分组列（children）递归累加子列，未配置 width 的列按标题字符长度估算，
 * 并用 minWidth / maxWidth 约束估算结果的下限与上限。
 */
export function estimateColumnWidth(column: Record<string, any>): number {
  // selection / expand 列按 naive-ui 默认宽度估算
  if (column.type === 'selection' || column.type === 'expand') {
    return SPECIAL_COLUMN_WIDTH
  }
  // 分组列：宽度等于所有子列宽度之和
  if (Array.isArray(column.children) && column.children.length > 0) {
    return column.children.reduce(
      (sum: number, child: Record<string, any>) => sum + estimateColumnWidth(child),
      0,
    )
  }
  // 已配置宽度：直接采用
  const width = parseWidth(column.width)
  if (width) return width

  // 未配置宽度：按标题字符长度估算（中文/全角按 16px、其余按 8px，含左右内边距 32px）
  const title = getColumnTitleText(column)
  let textWidth = 0
  for (const char of title) {
    textWidth += /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char) ? 16 : 8
  }
  let estimate = Math.max(DEFAULT_COLUMN_WIDTH, textWidth + 32)

  // 尊重 minWidth / maxWidth 约束：minWidth 抬高下限，maxWidth 限制上限
  const minWidth = parseWidth(column.minWidth)
  if (minWidth) estimate = Math.max(estimate, minWidth)
  const maxWidth = parseWidth(column.maxWidth)
  if (maxWidth) estimate = Math.min(estimate, maxWidth)
  return estimate
}

/**
 * 自定义渲染表格单元格内容
 * @param value 数据
 * @returns 返回渲染后的内容
 * @description 渲染单元格内容，如果数据为空，则返回'-'
 */
export function renderEmptyCell(value: any) {
  if (
    typeof value === 'number'
    || typeof value === 'boolean'
    || typeof value === 'bigint'
  ) {
    return value
  }

  if (!value)
    return '-'
  return value
}

/**
 * 渲染表格索引单元格
 * @param column - 列配置对象
 * @returns 包含索引列配置的对象
 * @description 该函数用于渲染表格的索引列，它返回一个包含列配置的对象，其中包括宽度、标题、对齐方式以及渲染函数。渲染函数使用 `h` 函数来创建一个 `TableIndex` 组件，并将当前行的数据和索引作为属性传递给它。
 */
export function renderIndexCell<T>(column: any) {
  return {
    width: 56,
    title: '序号',
    align: 'center',
    ...column,
    render: (_row: T, index: number) => h(TableIndex, { index }),
  }
}


interface ColumnOption {
  key: string
  [key: string]: any
}
/**
 * 渲染可复制单元格
 * @param column - 列配置对象
 * @returns 包含可复制单元格渲染逻辑的列配置对象
 * @description 该函数用于渲染表格中的可复制单元格。它接受一个列配置对象，并返回一个新的列配置对象，其中包含一个自定义的渲染函数。
 * 这个渲染函数会根据单元格的值类型（字符串、数字或对象）来生成可复制的文本内容，并使用 ProText 组件进行渲染。
 */
export function renderCopyableCell<T>(column: ColumnOption) {
  return {
    ...column,
    render: (row: T) => {
      // 获取当前行对应列的值
      const copyText = row[column.key as keyof T]

      // 如果值为空，则返回 '-'
      if (!copyText) {
        return '-'
      }

      let text = ''
      // 根据值的类型进行处理
      switch (typeof copyText) {
        case 'string':
          text = copyText
          break
        case 'number':
          text = copyText.toString()
          break
        case 'object':
          text = JSON.stringify(copyText)
          break
        default:
          text = ''
      }

      // 使用 ProText 组件渲染可复制的文本内容
      return h(
        ProText,
        {
          copyable: true,
          ellipsis: column.copyable.ellipsis || false,
          lineClamp: column.copyable.lineClamp || 1,
          text,
        },
      )
    },
  }
}

export function renderTitle(column: Record<string, any>) {
  if (column && column.tooltip) {
    return h(
      'div',
      {
        style: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: column.align,
        },
      },
      {
        default: () => [
          h(
            'span',
            {},
            {
              default: () => column.title,
            },
          ),
          h(
            NTooltip,
            {
              trigger: 'hover',
            },
            {
              default: () => column.tooltip,
              trigger: () => h(
                BmIconInfoCircle,
                {
                  style: {
                    marginLeft: '4px',
                    fontSize: '14px',
                  },
                },
              ),
            },
          ),
        ],
      },
    )
  }
}
