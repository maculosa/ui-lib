import type { HTMLAttributes } from 'vue'

export interface LoginFormProps {
  /** 登录表单配置 */
  schema?: any[]
  title: string
  description?: string
  class?: HTMLAttributes['class']
  /** 注册页的链接地址，当不存在时，不显示注册链接 */
  signUpUrl?: string
  /** 登录页的布局类型，默认为 `simple`，可选 `simple` | `column` | `card` */
  type?: 'simple' | 'column' | 'card'
  /** 登录页图片显示地址 */
  bgImageUrl?: string
  /** 图片显示位置，默认为 `false` 图片显示在右侧；仅在 type 为 column，card 时生效 */
  imageReverse?: boolean
  privacyUrl?: string
  serviceUrl?: string
}

/**
 * 定义登录表单组件可用的插槽结构
 * 
 * 该接口描述了一个支持自定义内容的登录表单组件插槽配置，
 * 主要用于模板化组件开发中允许父组件注入自定义内容
 * @interface LoginFormSlots
 * @property {VNode} default - 默认插槽，用于放置登录表单的默认内容
 * @property {VNode} logo - Logo插槽，用于放置Logo
 */
export interface LoginFormSlots {
  /**
   * 默认内容插槽，用于替换登录表单的主体区域
   * 
   * 当需要完全自定义表单布局时使用，此插槽会覆盖默认的表单元素
   */
  default?: () => any

  /**
   * Logo展示插槽，用于在登录表单顶部显示自定义品牌标识
   * 
   * 接受返回任意内容的渲染函数，常用于展示企业Logo或产品标识，
   * 未提供时将使用默认Logo或留白
   */
  logo?: () => any
}

/**
 * SignUpLink组件属性接口定义
 * @property {string} [url] - 可选参数，用于指定用户注册链接的URL地址。
*/
export interface SignUpLinkProps {
  /** 注册链接的URL地址 */
  url?: string
}

export interface PrivacyPolicyProps {
  /** 服务条款 URL */
  service?: string
  /** 隐私政策 URL */
  privacy?: string
}

/**
 * 登录卡片组件属性定义
 * 
 * @param {string} title - 卡片标题文本（必填）
 * @param {string} [description] - 卡片描述文本（可选）
 * @param {boolean} [shadow] - 是否显示卡片阴影效果（默认false）
 * @param {boolean} [rounded] - 是否显示卡片圆角（默认false）
 * @param {boolean} [border] - 是否显示卡片边框（默认false）
 * @param {string} [class] - 自定义CSS类名，用于扩展样式
 */
export interface LoginCardProps {
  /** 卡片标题文本（必填） */
  title: string
  /** 卡片描述文本（可选） */
  description?: string
  /** 是否显示卡片阴影效果（默认为 `false`） */
  shadow?: boolean
  /** 是否显示卡片圆角效果（默认为 `false`） */
  rounded?: boolean
  /** 是否显示卡片边框（默认为 `false`） */
  border?: boolean
  /** 自定义CSS类名，用于扩展样式 */
  class?: HTMLAttributes['class']
}
