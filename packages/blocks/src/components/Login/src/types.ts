import type { PropType, VNodeChild } from "vue";

export type LoginLayout = "simple" | "column" | "muted" | "card";

export interface Action {
  name: "Weixin";
  label: string;
  config: Record<string, any>;
}

export interface LoginProps {
  /**
   * 登录页方式，默认为 simple
   * - simple: 一个简单的登录样式，表单居中，无背景图片
   * - column: 两列布局的登录页面，需要配合 bg 属性
   * - muted: 在简单样式基础上，使用柔和的颜色作为背景图，需要配合 bg 属性
   * - card: 以卡片的形式展示两列布局的登录布局，需要配合 bg 属性
   */
  layout?: LoginLayout;
  /** 登录页的背景图，仅当 layout = column 或 card */
  bg?: string;
  /** 登录页的描述语，默认为 Login to your account */
  subTitle?: string;
  /** title 登录页标题, 默认为 Welcome back */
  title?: string;
  /** 忘记登录密码，当设置了忘记登录密码，显示 "忘记密码？" 超链接 */
  forgotUrl?: string;
  /** 立即注册的地址，默认为 /signup */
  signUpUrl?: string;
  /** 授权登录 */
  actions?: Action[];
  bgImageUrl?: string;
  logo?: () => VNodeChild
  imagePosition?: 'left' | 'right';
}

export interface LoginEmits {
  /** 表单登录提交 */
  finish: (values: Record<string, string>) => void;
  error: (error: any) => void;
  captcha: () => Record<string, string>;
  wechatFinish: (values: Record<string, any>) => void;
}

export type LoginEmitsType = keyof LoginEmits;
export const loginEmits: LoginEmitsType[] = ["finish", "error", "captcha", "wechatFinish"];

export const loginProps = {
  title: {
    type: String as PropType<LoginProps["title"]>,
    default: "Welcome back",
  },
  subTitle: {
    type: String as PropType<LoginProps["subTitle"]>,
    default: "Login to your account",
  },
  layout: {
    type: String as PropType<LoginProps["layout"]>,
    default: "simple",
  },
  bg: {
    type: String as PropType<LoginProps["bg"]>,
    default: "",
  },
  forgotUrl: {
    type: String as PropType<LoginProps["forgotUrl"]>,
    default: "",
  },
  signUpUrl: {
    type: String as PropType<LoginProps["signUpUrl"]>,
    default: "",
  },
  bgImageUrl: {
    type: String as PropType<LoginProps["bgImageUrl"]>,
    default: "",
  },
  logo: {
    type: Function as PropType<LoginProps["logo"]>,
  },
  imagePosition: {
    type: String as PropType<LoginProps["imagePosition"]>,
    default: "right",
  },
  actions: {
    type: Array as PropType<LoginProps["actions"]>,
  },
};

export const loginFormProps = {
  title: {
    type: String as PropType<LoginProps["title"]>,
    default: "Welcome back",
  },
  subTitle: {
    type: String as PropType<LoginProps["subTitle"]>,
    default: "Login to your account",
  }, 
  forgotUrl: {
    type: String as PropType<LoginProps["forgotUrl"]>,
    default: "",
  },
  signUpUrl: {
    type: String as PropType<LoginProps["signUpUrl"]>,
    default: "",
  },
  shadow: {
    type: Boolean,
    default: true,
  },
  actions: {
    type: Array as PropType<LoginProps["actions"]>,
  },
}