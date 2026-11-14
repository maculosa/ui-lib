import type { PropType, ExtractPropTypes, VNodeChild } from "vue";
import type { MenuOption } from "naive-ui";


export interface MenuConfig {
  // 只作为初始值，根 collapsed 显式传入时始终以根 collapsed 为准
  collapsed?: boolean;
  collapsedWidth?: number;
  collapsedIconSize?: number;
  // 预留字段，组件库尚未接入 i18n，当前不消费
  locale?: boolean
  loading?: boolean
  params?: Record<string, any>;
  responsive?: boolean;
  request?: (params: any, defaultMenuData: MenuOption[]) => Promise<MenuOption[]>;
  onLoadingChange?: (loading: boolean) => void
}

export const proLayoutProps = {
  title: {
    type: String,
    default: "Admin Pro",
  },
  logo: {
    type: String,
  },
  titleRender: {
    type: Function as PropType<(title: string) => VNodeChild>,
  },
  class: {
    type: String,
  },
  headerClass: {
    type: String,
  },
  siderClass: {
    type: String,
  },
  contentClass: {
    type: String,
  },
  style: {
    type: Object as PropType<Record<string, string | number>>,
  },
  siderWidth: {
    type: Number,
    default: 256,
  },
  contentScroll: {
    type: Boolean,
    default: false,
  },
  collapsed: {
    type: Boolean,
    default: undefined,
  },
  collapsedTriggerPosition: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'bottom',
  },
  layout: {
    type: String as PropType<'side' | 'top' | 'mix'>,
    default: 'side',
  },
  footer: {
    type: Boolean,
    default: false,
  },
  menu: {
    type: Object as PropType<MenuConfig>,
  },
  menus: {
    type: Array as PropType<MenuOption[]>,
  },
};

export type ProLayoutProps = ExtractPropTypes<typeof proLayoutProps>;

export const proLayoutEmits = {
  collapseChange: (collapsed: boolean) => typeof collapsed === "boolean",
};

export type ProLayoutEmits = ExtractPropTypes<typeof proLayoutEmits>;
