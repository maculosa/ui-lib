export interface WatermarkProps {
  /**
   * 水印文本内容
   */
  text: string

  /**
   * 水印文本颜色
   * @default '#000'
   */
  color?: string

  /**
   * 水印文本字体大小
   * @default 16
   */
  fontSize?: number

  /**
   * 水印之间的间距
   * @default 50
   */
  gap?: number

  /**
   * 水印旋转角度
   * @default -30
   */
  rotate?: number

  /**
   * 是否全屏显示水印
   * @default false
   */
  fullscreen?: boolean
}
