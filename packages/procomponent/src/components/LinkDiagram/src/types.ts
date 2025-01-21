/**
 * @description 连接图组件的属性定义
 */
export interface LinkDiagramProps {
  /**
   * @description 图谱数据
   */
  data: LinkDiagramData
  /**
   * @description 图谱宽度
   * @default '100%'
   */
  width?: number | string
  /**
   * @description 图谱高度
   * @default 600
   */
  height?: number
  /**
   * @description 图谱边距
   */
  margin?: number
}

/**
 * @description 图谱数据 -- 加油站数据图谱
 */
export interface LinkDiagramData {
  /**
   * @description 图谱名称
   */
  name: string
  /**
   * @description 图谱数据
   */
  data: { [key: string]: number }
  /**
   * @description 图谱备注
   */
  remark?: string | string[]
  /**
   * @description 油罐油品对应关系
   */
  oilTypeForOilTankRelation: OilTypeForOilTankRelation[]
  /**
   * @description 油罐油枪对应关系
   */
  oilTankForOilGunRelation: OilTankForOilGunRelation[]
}

/**
 * @description 油罐油品对应关系
 */
export interface OilTypeForOilTankRelation {
  /**
   * @description 油品
   */
  oilType: string
  /**
   * @description 油罐
   */
  tank: string
}

export interface OilTankForOilGunRelation {
  /**
   * @description 油枪
   */
  gun: string
  /**
   * @description 油罐
   */
  tank: string
  /**
   * @description 加油机
   */
  fuelDispenser: string
  /**
   * @description ID
   */
  id: number
}
