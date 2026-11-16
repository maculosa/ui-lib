import { computed, defineComponent, inject, ref, toRefs } from 'vue'
import { NButton, NButtonGroup, NSpace } from 'naive-ui'
import { DrawerForm, ModalForm } from '@components/index'
import { ColumnSetting, DensityButton, RefreshButton } from '../index'
import { toolbarProps, toolbarEmits } from './types'
import type { TableSize } from './types'
import BmIconDelete from '~icons/bm-icon/delete'
import BmIconDownload from '~icons/bm-icon/download'
import BmIconPlus from '~icons/bm-icon/plus'
import BmIconPrint from '~icons/bm-icon/print'
import BmIconUpload from '~icons/bm-icon/upload'

export default defineComponent({
  name: 'ToolbarComponent',
  props: toolbarProps,
  emits: Object.keys(toolbarEmits),
  setup(props, { emit, slots }) {
    const { config, title, loading, formColumns } = toRefs(props)

    /** 列设置:列设置面板实例,供 ProTable 的 setColumnsState 调用 */
    const settingColumns = inject<any>('settingColumns')
    const columnSettingRef = inject<any>('column-setting-ref', null)

    /**
     * 创建按钮 inject
     */
    const onCreate = inject<() => void>('toolbar-create')

    const createMode = computed(() => config.value.createMode ?? 'button')
    const createLabel = computed(() => config.value.createLabel || '新增')
    const deleteLabel = computed(() => config.value.deleteLabel || '删除')
    const exportLabel = computed(() => config.value.exportLabel || '导出Excel')
    const printLabel = computed(() => config.value.printLabel || '打印')
    const importLabel = computed(() => config.value.importLabel || '导入')
    const isModal = computed(() => createMode.value === 'modal')
    const isDrawer = computed(() => createMode.value === 'drawer')
    const isButton = computed(() => createMode.value === 'button')

    /**
     * 新增表单标题
     */
    const formTitle = computed(() => {
      return `${createLabel.value} ${title.value}`
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
     * 删除点击事件
     */
    function handleDelete() {
      emit('delete')
    }

    /**
     * 打印点击事件
     */
    function handlePrint() {
      emit('print')
    }

    const fileInputRef = ref<HTMLInputElement | null>(null)

    /**
     * 导入点击事件:打开文件选择器
     */
    function handleImport() {
      fileInputRef.value?.click()
    }

    function handleImportChange(event: Event) {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]
      if (file) emit('import', file)
      // 清空 value,允许重复选择同一个文件
      input.value = ''
    }

    /**
     * 选择表格大小
     * @param key 列设置按钮选中的 key
     */
    function handleSelectForTableSize(key: TableSize) {
      emit('update:size', key)
    }

    return () => (
      <NSpace align="center">
        { slots.default?.() }
        {
          // 新增按钮
          config.value.create === true && isModal.value && (
            <ModalForm
              title={formTitle.value}
              columns={formColumns.value}
            >
              <NButton type="primary" ghost size="small" onClick={handleCreate}>
                {{
                  icon: () => <BmIconPlus class="mr-4px text-16px" />,
                  default: () => createLabel.value,
                }}
              </NButton>
            </ModalForm>
          )
        }
        {
          // 新增按钮 drawer 模式
          config.value.create === true && isDrawer.value && (
            <DrawerForm
              title={formTitle.value}
              columns={formColumns.value}
            >
              <NButton type="primary" ghost size="small" onClick={handleCreate}>
                {{
                  default: () => createLabel.value,
                  icon: () => <BmIconPlus class="mr-4px text-16px" />,
                }}
              </NButton>
            </DrawerForm>
          )
        }
        {
          // 新增按钮 button 模式
          (config.value.create === true && isButton.value) && (
            <NButton type="primary" ghost size="small" onClick={handleCreate}>
              {{
                icon: () => <BmIconPlus class="mr-4px text-16px" />,
                default: () => createLabel.value,
              }}
            </NButton>
          )
        }
        {
          // 删除按钮
          config.value.delete === true && (
            <NButton type="error" ghost size="small" disabled={props.deleteDisabled} onClick={handleDelete}>
              {{
                icon: () => <BmIconDelete class="mr-4px text-16px" />,
                default: () => deleteLabel.value,
              }}
            </NButton>
          )
        }
        {
          // 导出按钮
          config.value.export === true && (
            <NButton type="info" ghost size="small" onClick={handleExportData}>
              {{
                icon: () => <BmIconDownload class="mr-4px text-16px" />,
                default: () => exportLabel.value,
              }}
            </NButton>
          )
        }
        {
          // 打印按钮
          config.value.print === true && (
            <NButton size="small" onClick={handlePrint}>
              {{
                icon: () => <BmIconPrint class="mr-4px text-16px" />,
                default: () => printLabel.value,
              }}
            </NButton>
          )
        }
        {
          // 导入按钮
          config.value.import === true && (
            <NButton size="small" onClick={handleImport}>
              {{
                icon: () => <BmIconUpload class="mr-4px text-16px" />,
                default: () => importLabel.value,
              }}
            </NButton>
          )
        }
        <input
          ref={fileInputRef}
          type="file"
          accept={config.value.importAccept}
          style={{ display: 'none' }}
          onChange={handleImportChange}
        />

        <NButtonGroup>
          {
            // 刷新按钮
            (config.value.reload !== false) && (
              <RefreshButton
                label={config.value.reloadLabel}
                loading={loading.value}
                onClick={() => emit('refresh')}
              />
            )
          }
          {
            // 密度按钮
            (config.value.density !== false) && (
              <DensityButton
                onUpdate:select={handleSelectForTableSize}
              />
            )
          }
          {
            // 列设置按钮
            (config.value.columnSetting !== false) && (
              <ColumnSetting
                ref={columnSettingRef}
                label={config.value.columnSettingLabel || false}
                storageKey={config.value.columnSettingKey}
                v-model:columns={settingColumns.value}
              />
            )
          }
        </NButtonGroup>
      </NSpace>
    )
  },
})
