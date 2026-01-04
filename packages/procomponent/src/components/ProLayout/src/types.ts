import type { PropType, ExtractPropTypes, VNodeChild } from "vue";
import type { MenuOption } from "naive-ui";


export interface MenuConfig {
  collapsed: boolean;
  collapsedWidth: number;
  collapsedIconSize: number;
  locale?: boolean
  loading?: boolean
  request: (params: any, defaultMenuData: MenuOption[]) => Promise<MenuOption[]>;
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
  style: {
    type: Object as PropType<Record<string, string | number>>,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String as PropType<'side' | 'top' | 'mix'>,
    default: 'side',
  },
  menu: {
    type: Object as PropType<MenuConfig>,
    default: () => ({
      collapsed: false,
      collapsedWidth: 64,
      collapsedIconSize: 22,
      locale: true,
      loading: false
    }),
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
