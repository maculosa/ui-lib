import type { ProTableColumn } from 'naive-ui'
import type { PropType } from 'vue'
import { NButton, NCheckbox, NPopover } from 'naive-ui'
import { defineComponent, Fragment, ref, toRefs, watch } from 'vue'
import { VueDraggableNext as VueDraggable } from 'vue-draggable-next'
import './ColumnSetting.scss'
import BmIconDragDrop from '~icons/bm-icon/drag-drop'
import BmIconSettings from '~icons/bm-icon/settings'

type Column = ProTableColumn
type List = Column & { checked?: boolean }

interface ElementItem {
  key: string
  title: string
  type: string
  hideInTable?: boolean
}

const VueDraggableItem = defineComponent({
  name: 'VueDraggableItem',
  props: {
    element: {
      type: Object as PropType<ElementItem>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { element } = toRefs(props)
    return () => (
      <Fragment key={element.value.key}>
        {
          element.value.type === 'selection'
            ? (
                <div
                  class="drag-list-item"
                >
                  <BmIconDragDrop class="text-24px cursor-move" />
                  <NCheckbox v-model:checked={element.value.hideInTable}>
                    多选框
                  </NCheckbox>
                </div>
              )
            : (
                <div
                  class="drag-list-item"
                >
                  <BmIconDragDrop class="text-24px cursor-move" />
                  <NCheckbox v-model:checked={element.value.hideInTable}>
                    { element.value.title }
                  </NCheckbox>
                </div>
              )
        }

      </Fragment>
    )
  },
})

export default defineComponent({
  name: 'ColumnSetting',
  props: {
    columns: {
      type: Array as PropType<Column[]>,
      default: () => [],
    },
    label: {
      type: [String, Boolean] as PropType<string | false>,
      default: '表格列设置',
    },
  },
  emits: ['update:columns'],
  setup(props, { emit }) {

    function initList(): List[] {
      if (!props.columns) return []
      if (!Array.isArray(props.columns)) return []
      return props.columns.map(item => ({
        ...item,
        hideInTable: !item.hideInTable,
      }))
    }

    const list = ref(initList())

    watch(() => list.value, (newValue: List[]) => {
      const newColumns = newValue.filter(item => item.hideInTable)

      const columns: Column[] = newColumns.map((item) => {
        const column = { ...item }
        delete column.hideInTable
        return column
      }) as Column[]

      emit('update:columns', columns)
    }, {
      deep: true,
    })

    return () => (
      <NPopover placement="bottom" trigger="click">
        {{
          trigger: () => (
            <NButton size="small" quaternary>
              <BmIconSettings class="mr-4px text-16px" />
              {
                props.label && <span>
                  { props.label }
                </span>
              }
            </NButton>
          ),
          default: () => (
            <Fragment>
              <VueDraggable v-model={list.value} item-key="key">
                {
                  list.value.map((element: List) => (
                    <VueDraggableItem key={element.key} element={element} />
                  ))
                }
              </VueDraggable>
            </Fragment>
          ),
        }}
      </NPopover>
    )
  },
})
