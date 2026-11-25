import type { PropType, ExtractPropTypes, VNodeChild, CSSProperties } from "vue";
import type { MenuOption } from "naive-ui";


export interface MenuConfig {
  // 只作为初始值，根 collapsed 显式传入时始终以根 collapsed 为准
  collapsed?: boolean;
  collapsedWidth?: number;
  collapsedIconSize?: number;
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
  mobileBreakpoint: {
    type: Number,
    default: undefined,
  },
  breakpointMode: {
    type: String as PropType<'viewport' | 'container'>,
    default: 'viewport',
  },
  footer: {
    type: Boolean,
    default: false,
  },
  footerClass: {
    type: String,
  },
  footerStyle: {
    type: Object as PropType<CSSProperties>,
  },
  menu: {
    type: Object as PropType<MenuConfig>,
  },
  menus: {
    type: Array as PropType<MenuOption[]>,
  },
  menuValue: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  expandedKeys: {
    type: Array as PropType<(string | number)[]>,
    default: undefined,
  },
  autoExpandSelected: {
    type: Boolean,
    default: true,
  },
  drawerPlacement: {
    type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
    default: 'left',
  },
  drawerWidth: {
    type: Number,
    default: undefined,
  },
};

export type ProLayoutProps = ExtractPropTypes<typeof proLayoutProps>;

export const proLayoutEmits = {
  collapseChange: (collapsed: boolean) => typeof collapsed === "boolean",
  'update:menuValue': (key: string | number) => typeof key === "string" || typeof key === "number",
  'update:expandedKeys': (keys: (string | number)[]) => Array.isArray(keys),
  menuClick: (key: string | number, item: MenuOption) =>
    (typeof key === "string" || typeof key === "number") && !!item,
  topMenuClick: (key: string | number, item: MenuOption) =>
    (typeof key === "string" || typeof key === "number") && !!item,
};

export type ProLayoutEmits = ExtractPropTypes<typeof proLayoutEmits>;

/** ProLayout 通过 expose 暴露给父组件的实例 API */
export interface ProLayoutInstance {
  /** 重新加载菜单数据 */
  reloadMenus: () => Promise<void>;
  /** 设置侧边栏折叠状态 */
  setCollapsed: (value: boolean) => void;
  /** 切换侧边栏折叠状态 */
  toggleCollapsed: () => void;
  /** 打开移动端抽屉 */
  openDrawer: () => void;
  /** 关闭移动端抽屉 */
  closeDrawer: () => void;
  /** 切换移动端抽屉 */
  toggleDrawer: () => void;
  /** 设置当前选中菜单 */
  setMenuValue: (key: string | number) => void;
  /** 设置展开的菜单项 */
  setExpandedKeys: (keys: (string | number)[]) => void;
  /** 滚动到指定菜单项，返回是否定位成功 */
  scrollToMenu: (key: string | number) => Promise<boolean>;
}
