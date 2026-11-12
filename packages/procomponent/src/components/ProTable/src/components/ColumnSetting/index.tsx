import type { ProTableColumn } from "naive-ui";
import type { PropType } from "vue";
import { NButton, NCheckbox, NPopover } from "naive-ui";
import { defineComponent, ref, toRefs, watch } from "vue";
import { VueDraggableNext as VueDraggable } from "vue-draggable-next";
import "./ColumnSetting.scss";
import BmIconDragDrop from "~icons/bm-icon/drag-drop";
import BmIconSettings from "~icons/bm-icon/settings";

type Column = ProTableColumn;

export interface ColumnSettingState {
  /** 全部列 key 的当前顺序 */
  order: string[];
  /** 呗隐藏列的 key */
  hidden: string[];
}

/** 稳定取列 key:key 缺失时依次回退 type / 位置索引 */
export function getColumnKey(column: Column, index: number): string {
  return String(column.key ?? (column as any).type ?? `__col_${index}`);
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
  const orderMap = new Map(state.order.map((k, i) => [k, i]));

  return columns
    .map((column, index) => ({ column, key: getColumnKey(column, index) }))
    .sort(
      (a, b) =>
        (orderMap.get(a.key) ?? Number.MAX_SAFE_INTEGER) -
        (orderMap.get(b.key) ?? Number.MAX_SAFE_INTEGER),
    )
    .filter(({ key }) => !hidden.has(key))
    .map(({ column }) => column);
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
  /** 原始列配置引用 */
  column: Column;
}

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
    return () => (
      <div class="drag-list-item">
        <BmIconDragDrop class="text-24px cursor-move" />
        <NCheckbox v-model:checked={element.value.checked}>
          {element.value.type === "selection" ? "多选框" : element.value.title}
        </NCheckbox>
      </div>
    );
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
  setup(props, { emit }) {
    /** 由原始列配置 + 已保存状态生成内部列表 */
    function buildList(
      columns: Column[],
      saved: ColumnSettingState | null,
    ): ListItem[] {
      const order = saved?.order ?? [];
      const orderMap = new Map(order.map((k, i) => [k, i]));
      const hiddenSet = new Set(saved?.hidden ?? []);

      return (
        columns
          .map((column, index) => {
            const key = getColumnKey(column, index);
            // saved.order 里存在 → 用户操作过该列,以保存的偏好为准
            // 不存在(新加的列)→ 回退到列配置本身的 hideInTable
            const known = orderMap.has(key);
            const checked = known
              ? !hiddenSet.has(key)
              : column.hideInTable !== true;
            return {
              key,
              originKey: column.key,
              title: (column as any).title ?? key,
              type: (column as any).type,
              checked,
              column,
            };
          })
          // 按保存的顺序排;没记录顺序的(新列)排最后
          .sort(
            (a, b) =>
              (orderMap.get(a.key) ?? Number.MAX_SAFE_INTEGER) -
              (orderMap.get(b.key) ?? Number.MAX_SAFE_INTEGER),
          )
      );
    }
    // ---- 原始列配置快照 ----
    // 只在「真正的外部变更」时更新;
    // 父组件把我们 emit 的过滤结果回写回来时(echo),快照保持不动
    const originalColumns = ref<Column[]>([...props.columns]);

    function initList(): ListItem[] {
      const saved = props.storageKey ? loadState(props.storageKey) : null;
      return buildList(originalColumns.value, saved); // 基于快照
    }

    const list = ref<ListItem[]>(initList());

    // ---- 状态闸门:落盘只由「用户操作」触发 ----
    // 程序性构建(初始化 / 异步列到达 / 重置)产生的状态与 lastState 相同,不写存储。
    // 修复「空列挂载 → immediate watch 保存空状态 → 覆盖已保存偏好 → 刷新后丢失」的问题
    function serializeState(val: ListItem[]): string {
      return JSON.stringify({
        order: val.map((i) => i.key),
        hidden: val.filter((i) => !i.checked).map((i) => i.key),
      });
    }

    let lastState = serializeState(list.value);
    /** 是否已完成首次落盘:列表非空时允许写入一次默认状态,之后仅状态变化才写 */
    let hasPersisted = false;

    // ---- 派生 & 持久化:勾选、拖拽的任何变化都从这里出口 ----
    watch(
      list,
      (val) => {
        const state: ColumnSettingState = {
          order: val.map((i) => i.key),
          hidden: val.filter((i) => !i.checked).map((i) => i.key),
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
        emit(
          "update:columns",
          val.filter((i) => i.checked).map((i) => i.column),
        );
      },
      { deep: true, immediate: true },
    );

    // ---- 支持 columns 异步加载:外部列变化时重新初始化 ----
    // 防循环:如果传入列的 key 序列与当前可见列一致,
    // 说明是父组件把 emit 的过滤结果回传了,直接跳过
    watch(
      () => props.columns,
      (cols) => {
        const incoming = cols.map((c, i) => getColumnKey(c, i)).join(",");
        const visible = list.value
          .filter((i) => i.checked)
          .map((i) => i.key)
          .join(",");
        if (incoming === visible) return;
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
