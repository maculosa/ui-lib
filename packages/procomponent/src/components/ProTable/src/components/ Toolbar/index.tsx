import { computed, defineComponent, inject, toRefs } from 'vue'
import { NButton, NButtonGroup, NSpace } from 'naive-ui'
import { DrawerForm, ModalForm } from '@components/index'
import { ColumnSetting, DensityButton, RefreshButton } from '../index'
import { toolbarProps, toolbarEmits } from './types'
import type { TableSize } from './types'

export default defineComponent({
  name: 'ToolbarComponent',
  props: toolbarProps,
  emits: Object.keys(toolbarEmits),
  setup(props, { emit }) {
    const { config, title, loading, formColumns } = toRefs(props)

    const {
      columnSetting,
      columnSettingLabel,
      create,
      createLabel,
      createMode,
      density,
      exportLabel,
      reload,
      reloadLabel,
    } = config.value

    /**
     * 列设置 inject
     */
    const settingColumns = inject<any>('settingColumns')

    /**
     * 创建按钮 inject
     */
    const onCreate = inject<() => void>('toolbar-create')

    /**
     * 刷新按钮点击事件
     */
    function handleRefresh() {
      emit('refresh')
    }

    /**
     * 是否有导出按钮 computed
     */
    const hasExportButton = computed(() => {
      return config.value.export
    })

    /**
     * 是否有新增按钮 computed
     */
    const hasCreateButton = computed(() => {
      return create
    })

    /**
     * 是否为新增按钮 modal 模式 computed
     */
    const isModal = computed(() => {
      return createMode === 'modal'
    })

    /**
     * 是否为新增按钮 drawer 模式 computed
     */
    const isDrawer = computed(() => {
      return createMode === 'drawer'
    })

    /**
     * 是否为新增按钮 button 模式 computed
     */
    const isButton = computed(() => {
      return create
    })

    /**
     * 新增表单标题
     */
    const formTitle = computed(() => {
      return `${(createLabel || '新增')} ${title.value}`
    })

    /**
     * 新增按钮点击事件
     */
    function handleCreate() {
      onCreate && onCreate()
    }

    /**
     * 导出数据点击事件
     */
    function handleExportData() {
      emit('export')
    }

    /**
     * 选择表格大小
     * @param key 列设置按钮选中的 key
     */
    function handleSelectForTableSize(key: TableSize) {
      emit('update:size', key)
    }

    return () => (
      <NSpace>
        <slot name="toolbar" />

        {
          // 导出按钮
          hasExportButton.value && (
            <NButton type="info" ghost size="small" onClick={handleExportData}>
              {{
                icon: () => <bm-download class="mr-4px text-16px" />,
                default: () => exportLabel || '导出Excel',
              }}
            </NButton>
          )
        }
        {
          // 新增按钮 modal 模式
          hasCreateButton.value && isModal.value && (
            <ModalForm
              title={formTitle.value}
              columns={formColumns.value}
            >
              <NButton type="primary" ghost size="small" onClick={handleCreate}>
                {{
                  icon: () => <bm-plus class="mr-4px text-16px" />,
                  default: () => createLabel || '新增',
                }}
              </NButton>
            </ModalForm>
          )
        }
        {
          // 新增按钮 drawer 模式
          hasCreateButton.value && isDrawer.value && (
            <DrawerForm
              title={formTitle.value}
              columns={formColumns.value}
            >
              <NButton type="primary" ghost size="small" onClick={handleCreate}>
                {{
                  default: () => createLabel || '新增',
                  icon: () => <bm-plus class="mr-4px text-16px" />,
                }}
              </NButton>
            </DrawerForm>
          )
        }
        {
          // 新增按钮 button 模式
          (hasCreateButton.value && isButton.value) && (
            <NButton type="primary" ghost size="small" onClick={handleCreate}>
              {{
                icon: () => <bm-plus class="mr-4px text-16px" />,
                default: () => createLabel || '新增',
              }}
            </NButton>
          )
        }

        <NButtonGroup>
          {
            // 刷新按钮
            (reload !== false) && (
              <RefreshButton
                label={reloadLabel}
                loading={loading.value}
                onClick={handleRefresh}
              />
            )
          }
          {
            // 密度按钮
            (density !== false) && (
              <DensityButton
                onUpdate:select={handleSelectForTableSize}
              />
            )
          }
          {
            // 列设置按钮
            (columnSetting !== false) && (
              <ColumnSetting
                label={columnSettingLabel || false}
                v-model:columns={settingColumns.value}
              />
            )
          }
        </NButtonGroup>
      </NSpace>
    )
  },
})
