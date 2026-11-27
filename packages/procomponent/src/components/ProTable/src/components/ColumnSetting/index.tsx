import type { ProTableColumn } from "naive-ui";
import type { PropType } from "vue";
import { NButton, NCheckbox, NPopover } from "naive-ui";
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import { VueDraggableNext as VueDraggable } from "vue-draggable-next";
import "./ColumnSetting.scss";
import BmIconDragDrop from "~icons/bm-icon/drag-drop";
import BmIconSettings from "~icons/bm-icon/settings";
import { NTooltip } from "naive-ui";

type Column = ProTableColumn;

/** 列的固定位置 */
export type ColumnFixed = "left" | "right";

export interface ColumnSettingState {
  /** 全部列 key 的当前顺序 */
  order: string[];
  /** 呗隐藏列的 key */
  hidden: string[];
  /**
   * 保存时列配置的声明顺序快照,
   * 用于区分「用户手动排序」与「尚未操作的默认顺序」。
   * 旧版本数据没有该字段,按用户已自定义处理,保持原行为。
   */
  declaredOrder?: string[];
  /**
   * 列 key → 固定位置。
   * 值为 null 表示用户显式取消了列声明中的固定,key 缺失时沿用列配置的 fixed。
   */
  fixed?: Record<string, ColumnFixed | null>;
}

/**
 * 稳定取列 key:key 缺失时依次回退 type / 标题 / 位置索引。
 * 标题比位置索引稳定:中间插入新列不会让旧偏好的 key 错位到别的列上。
 */
export function getColumnKey(column: Column, index: number): string {
  const explicit = column.key ?? (column as any).type;
  if (explicit != null && explicit !== "") return String(explicit);
  const title = (column as any).title;
  if (typeof title === "string" && title) return `__title_${title}`;
  return `__col_${index}`;
}

/**
 * 合并已保存顺序与当前列声明顺序:
 * 已保存的列沿用用户排序,新增列(保存中不存在)保留声明位置而不是排到末尾。
 */
export function orderColumns<T extends { key: string }>(
  items: T[],
  savedOrder: string[],
): T[] {
  if (savedOrder.length === 0) return items;
  const orderMap = new Map(savedOrder.map((k, i) => [k, i]));
  const known = items
    .filter((item) => orderMap.has(item.key))
    .sort((a, b) => orderMap.get(a.key)! - orderMap.get(b.key)!);
  let cursor = 0;
  return items.map((item) => (orderMap.has(item.key) ? known[cursor++] : item));
}

/** 判断两个列 key 序列是否完全一致 */
function isSameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((key, index) => key === b[index]);
}

/**
 * 解析应当生效的排序:
 * - 保存的 order 与保存时的声明快照一致,说明用户从未手动拖拽,
 *   返回空数组让最新的列声明顺序生效;
 * - 用户手动排过序时返回保存的 order;
 * - 旧版本缓存没有 declaredOrder,无法区分「默认顺序落盘」与「用户拖拽」,
 *   存储场景下按「未自定义」迁移,避免代码调整列顺序后页面一直停留在旧位置;
 *   外部显式传入的 state 不迁移,仍以传入 order 为准。
 * @param state 已保存或外部传入的列设置状态
 * @param migrateLegacy 是否把缺少 declaredOrder 的旧数据视为未自定义
 * @returns 需要应用的排序 key 列表,空数组表示直接使用声明顺序
 */
function resolveOrder(
  state?: ColumnSettingState | null,
  migrateLegacy = false,
): string[] {
  if (!state) return [];
  const { order = [], declaredOrder } = state;
  if (declaredOrder) return isSameOrder(order, declaredOrder) ? [] : order;
  return migrateLegacy ? [] : order;
}

/**
 * 归一化列配置上的 fixed 值
 * @param value 列配置的 fixed,兼容 naive-ui 的 'left' | 'right' | boolean 写法
 * @returns 归一化后的固定位置;未固定返回 null
 */
function normalizeFixed(value: unknown): ColumnFixed | null {
  if (value === "left" || value === true) return "left";
  if (value === "right") return "right";
  return null;
}

/**
 * 按固定位置分组输出列
 * @param entries 列配置及其固定位置,数组顺序即同组内的顺序
 * @returns 左固定 → 未固定 → 右固定 排列的新列数组,不修改原始列配置
 * @description naive-ui 的固定列需要位于列数组两端才能正确渲染,
 * 因此这里在输出时统一分组;原始列对象通过浅拷贝隔离,避免污染调用方配置。
 */
function buildFixedColumns(
  entries: { column: Column; fixed: ColumnFixed | null }[],
): Column[] {
  const groups: Record<"left" | "none" | "right", Column[]> = {
    left: [],
    none: [],
    right: [],
  };
  entries.forEach(({ column, fixed }) => {
    const next = { ...column } as Column;
    if (fixed) next.fixed = fixed;
    else delete (next as any).fixed;
    groups[fixed ?? "none"].push(next);
  });
  return [...groups.left, ...groups.none, ...groups.right];
}

const STORAGE_PREFIX = "pro-table:column-setting:";
const hasWindow = typeof window !== "undefined";
/** 是否开发环境(非 Vite 项目请替换为对应的环境判断) */
const isDev = Boolean((import.meta as any).env?.DEV);

function loadState(storageKey: string): ColumnSettingState | null {
  if (!hasWindow) {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + storageKey);
    return raw ? (JSON.parse(raw) as ColumnSettingState) : null;
  } catch {
    return null;
  }
}

function saveState(storageKey: string, state: ColumnSettingState) {
  if (!hasWindow) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(state));
  } catch (e) {
    /* 存储异常静默失败 */
    if (isDev) console.warn("[ColumnSetting] 保存失败:", storageKey, e);
  }
}

function removeState(storageKey: string) {
  if (!hasWindow) return;
  try {
    localStorage.removeItem(STORAGE_PREFIX + storageKey);
  } catch {}
}

/** 根据 state 从原始列配置派生表格渲染列(状态由外部管理时使用) */
export function applyColumnState(
  columns: Column[],
  state?: ColumnSettingState | null,
): Column[] {
  if (!state) return columns;
  const hidden = new Set(state.hidden);
  const items = columns.map((column, index) => {
    const key = getColumnKey(column, index);
    // 保存中显式记录了固定位置(含取消固定)时以保存为准,否则沿用列声明
    const fixed =
      state.fixed && key in state.fixed
        ? state.fixed[key]
        : normalizeFixed((column as any).fixed);
    return { column, key, fixed };
  });

  return buildFixedColumns(
    orderColumns(items, resolveOrder(state)).filter(
      ({ key }) => !hidden.has(key),
    ),
  );
}

/** 内部列表项:column 保存原始列配置的引用,emit 时原样返回 */
interface ListItem {
  /** 内部唯一 key(字符串化,保证拖拽 itemKey 可用) */
  key: string;
  /** 原始 key(可能为 undefined),用于和 props.columns 比对 */
  originKey: Column["key"];
  title: string;
  type?: string;
  /** 勾选 = 在表格中显示 */
  checked: boolean;
  /** 固定位置;null 表示不固定 */
  fixed: ColumnFixed | null;
  /** 原始列配置引用 */
  column: Column;
}

/** 列固定方向图标:竖线代表表格边缘,方块代表被固定的列 */
const FixedSideIcon = defineComponent({
  name: "FixedSideIcon",
  props: {
    side: {
      type: String as PropType<ColumnFixed>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true">
        <g
          transform={
            props.side === "right" ? "translate(16 0) scale(-1 1)" : undefined
          }
        >
          <rect
            x="5.5"
            y="3"
            width="8.5"
            height="10"
            rx="1.5"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M2.5 2v12"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </g>
      </svg>
    );
  },
});

const VueDraggableItem = defineComponent({
  name: "VueDraggableItem",
  props: {
    element: {
      type: Object as PropType<ListItem>,
      required: true,
    },
  },
  setup(props) {
    const { element } = toRefs(props);

    /**
     * 切换列固定位置
     * @param side 目标固定位置;再次点击相同方向表示取消固定
     */
    function toggleFixed(side: ColumnFixed) {
      element.value.fixed = element.value.fixed === side ? null : side;
    }

    return () => {
      const { fixed } = element.value;
      return (
        <div class="drag-list-item">
          <BmIconDragDrop class="text-24px cursor-move" />
          <NCheckbox v-model:checked={element.value.checked}>
            {element.value.type === "selection"
              ? "多选框"
              : element.value.title}
          </NCheckbox>
          <div class="drag-list-item__fixed">
            <NTooltip>
              {{
                trigger: () => (
                  <NButton
                    text
                    size="small"
                    type={fixed === "left" ? "primary" : undefined}
                    class={`column-fixed-btn${fixed === "left" ? " is-active" : ""}`}
                    onClick={() => toggleFixed("left")}
                  >
                    <FixedSideIcon side="left" />
                  </NButton>
                ),
                default: () => <span>固定在左侧</span>,
              }}
            </NTooltip>
            <NTooltip>
              {{
                trigger: () => (
                  <NButton
                    text
                    size="small"
                    type={fixed === "right" ? "primary" : undefined}
                    class={`column-fixed-btn${fixed === "right" ? " is-active" : ""}`}
                    onClick={() => toggleFixed("right")}
                  >
                    <FixedSideIcon side="right" />
                  </NButton>
                ),
                default: () => <span>固定在右侧</span>,
              }}
            </NTooltip>
          </div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: "ColumnSetting",
  props: {
    columns: {
      type: Array as PropType<Column[]>,
      default: () => [],
    },
    label: {
      type: [String, Boolean] as PropType<string | false>,
      default: "表格列设置",
    },
    /** 持久化 key:传入后自动读写 localStorage;不传则只 emit state,由外部自行存储 */
    storageKey: {
      type: String as PropType<string>,
      default: "",
    },
  },
  emits: ["update:columns", "update:state"],
  setup(props, { emit, expose }) {
    /**
     * 由原始列配置 + 已保存状态生成内部列表
     * @param columns 原始列配置
     * @param saved 已保存或外部传入的列设置状态
     * @param migrateLegacy 是否迁移缺少声明快照的旧缓存(仅从 localStorage 加载时为 true)
     */
    function buildList(
      columns: Column[],
      saved: ColumnSettingState | null,
      migrateLegacy = false,
    ): ListItem[] {
      const savedOrder = saved?.order ?? [];
      const orderMap = new Map(savedOrder.map((k, i) => [k, i]));
      const hiddenSet = new Set(saved?.hidden ?? []);
      const savedFixed = saved?.fixed ?? {};

      const items = columns.map((column, index) => {
        const key = getColumnKey(column, index);
        // saved.order 里存在 → 用户操作过该列,以保存的偏好为准
        // 不存在(新加的列)→ 回退到列配置本身的 hideInTable
        const known = orderMap.has(key);
        const checked = known
          ? !hiddenSet.has(key)
          : column.hideInTable !== true;
        // 保存中记录过固定位置时以保存为准(含显式取消固定),否则沿用列声明
        const fixed =
          key in savedFixed
            ? savedFixed[key]
            : normalizeFixed((column as any).fixed);
        return {
          key,
          originKey: column.key,
          title: (column as any).title ?? key,
          type: (column as any).type,
          checked,
          fixed,
          column,
        };
      });

      // 已保存的列按用户排序,新列保留声明位置;
      // 用户从未手动排序时使用最新的声明顺序
      return orderColumns(items, resolveOrder(saved, migrateLegacy));
    }
    // ---- 原始列配置快照 ----
    // 只在「真正的外部变更」时更新;
    // 父组件把我们 emit 的过滤结果回写回来时(echo),快照保持不动
    const originalColumns = ref<Column[]>([...props.columns]);

    function initList(): ListItem[] {
      const saved = props.storageKey ? loadState(props.storageKey) : null;
      // 存储中的旧缓存缺少声明快照,按未自定义迁移,使代码顺序调整能立即生效
      return buildList(originalColumns.value, saved, true); // 基于快照
    }

    const list = ref<ListItem[]>(initList());

    // ---- 状态闸门:落盘只由「用户操作」触发 ----
    // 程序性构建(初始化 / 异步列到达 / 重置)产生的状态与 lastState 相同,不写存储。
    // 修复「空列挂载 → immediate watch 保存空状态 → 覆盖已保存偏好 → 刷新后丢失」的问题
    function serializeState(val: ListItem[]): string {
      return JSON.stringify({
        order: val.map((i) => i.key),
        hidden: val.filter((i) => !i.checked).map((i) => i.key),
        fixed: collectFixed(val),
      });
    }

    let lastState = serializeState(list.value);
    /** 是否已完成首次落盘:列表非空时允许写入一次默认状态,之后仅状态变化才写 */
    let hasPersisted = false;

    /**
     * 当前列配置的声明顺序快照。
     * 随状态一起落盘,下次加载时据此判断用户是否手动排过序。
     * @returns 按声明顺序排列的列 key
     */
    function declarationOrder(): string[] {
      return originalColumns.value.map((column: Column, index: number) =>
        getColumnKey(column, index),
      );
    }

    /**
     * 收集列固定位置
     * @param val 当前列设置列表
     * @returns 列 key → 固定位置,含 null(用于记录用户显式取消固定)
     */
    function collectFixed(val: ListItem[]): Record<string, ColumnFixed | null> {
      return Object.fromEntries(val.map((i) => [i.key, i.fixed]));
    }

    /**
     * 列签名:key 顺序 + 固定位置
     * @param columns 列配置数组
     * @returns 用于比较的签名字符串
     */
    function columnsSignature(columns: Column[]): string {
      return columns
        .map((column, index) => {
          const key = getColumnKey(column, index);
          return `${key}:${normalizeFixed((column as any).fixed) ?? ""}`;
        })
        .join(",");
    }

    /** 最近一次输出给表格的列签名,用于识别父组件回传的列而不重复初始化 */
    let lastEmittedSignature = "";

    /**
     * 输出渲染列:按固定位置分组,保证固定列位于列数组两端
     * @param val 当前列设置列表
     */
    function emitColumns(val: ListItem[]): void {
      const columns = buildFixedColumns(
        val
          .filter((i) => i.checked)
          .map((i) => ({ column: i.column, fixed: i.fixed })),
      );
      lastEmittedSignature = columnsSignature(columns);
      emit("update:columns", columns);
    }

    // ---- 派生 & 持久化:勾选、拖拽、固定的任何变化都从这里出口 ----
    watch(
      list,
      (val) => {
        const state: ColumnSettingState = {
          order: val.map((i) => i.key),
          hidden: val.filter((i) => !i.checked).map((i) => i.key),
          declaredOrder: declarationOrder(),
          fixed: collectFixed(val),
        };

        const serialized = serializeState(val);
        // 状态闸门:
        // 1. 空列表(异步列未到达时的挂载)永不落盘,避免空状态覆盖已保存偏好;
        // 2. 非空列表允许首次落盘一次(把默认状态写入存储);
        // 3. 之后仅当状态真正变化(用户操作)时才写。
        if (val.length > 0 && (serialized !== lastState || !hasPersisted)) {
          lastState = serialized;
          hasPersisted = true;
          if (props.storageKey) saveState(props.storageKey, state);
        }

        emit("update:state", state);
        emitColumns(val);
      },
      { deep: true, immediate: true },
    );

    // ---- 支持 columns 异步加载:外部列变化时重新初始化 ----
    // 防循环:如果传入列的签名与最近一次输出的列一致,
    // 说明是父组件把 emit 的结果回传了,直接跳过
    watch(
      () => props.columns,
      (cols) => {
        if (columnsSignature(cols) === lastEmittedSignature) return;
        originalColumns.value = [...cols];
        list.value = initList();
      },
    );

    // ---- 全选 / 重置 ----
    const allChecked = computed(
      () => list.value.length > 0 && list.value.every((i) => i.checked),
    );
    const indeterminate = computed(
      () => !allChecked.value && list.value.some((i) => i.checked),
    );

    function toggleAll(checked: boolean) {
      list.value.forEach((i) => {
        i.checked = checked;
      });
    }

    function reset() {
      if (props.storageKey) removeState(props.storageKey);
      // 清空保存状态,按原始列配置重新初始化(hideInTable 配置依然生效)
      list.value = buildList(originalColumns.value, null);
    }

    /** 程序化应用列状态(不写 localStorage),同时同步面板与表格列 */
    function applyState(state: ColumnSettingState | null) {
      const next = buildList(originalColumns.value, state);
      // 先把闸门基准同步为新状态,使下面的赋值被判定为“无变化”而不落盘
      lastState = serializeState(next);
      hasPersisted = true;
      list.value = next;
    }

    expose({ applyState });

    return () => (
      <NPopover placement="bottom" trigger="click">
        {{
          trigger: () => (
            <NButton size="small" quaternary>
              <BmIconSettings class="mr-4px text-16px" />
              {props.label && <span>{props.label}</span>}
            </NButton>
          ),
          default: () => (
            <div class="column-setting-panel">
              <div class="column-setting-panel__header">
                <NCheckbox
                  checked={allChecked.value}
                  indeterminate={indeterminate.value}
                  onUpdate:checked={toggleAll}
                >
                  列展示
                </NCheckbox>
                <NButton text type="primary" size="tiny" onClick={reset}>
                  重置
                </NButton>
              </div>
              <div class="column-setting-panel__body">
                <VueDraggable v-model={list.value} item-key="key">
                  {list.value.map((element) => (
                    <VueDraggableItem key={element.key} element={element} />
                  ))}
                </VueDraggable>
              </div>
            </div>
          ),
        }}
      </NPopover>
    );
  },
});
