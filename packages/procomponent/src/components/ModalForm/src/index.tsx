import { NButton, NModal, NSpace } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import { ProForm } from '@components/ProForm'
import { modalFormProps, modalFormEmits, type ModalFormExpose } from './types'

interface FormValues {
  [key: string]: any
}

export default defineComponent({
  name: 'ModalForm',
  props: modalFormProps,
  emits: modalFormEmits,
  setup(props, { emit, slots, attrs, expose }) {
    const visible = ref(false)

    const columns = computed(() => {
      return props.columns.filter(col => 
        !['index', 'selection'].includes(col?.type as string) && col?.key !== 'actions'
      )
    })

    const width = computed(() => {
      return props.width ? props.width : '640px'
    })

    function handleVisible() {
      visible.value = true
    }

    function close() {
      visible.value = false
    }

    const formRef = ref()

    async function handleSubmit(values: FormValues) {
      try {
        await emit('submit', values)
        close()
      } catch (error) {
        console.error('Form submit failed:', error)
      }
    }

    function handleReset() {
      emit('reset')
    }

    function _submit() {
      formRef.value?.submit()
    }

    function _reset() {
      formRef.value?.reset()
    }

    expose<ModalFormExpose>({
      submit: _submit,
      reset: _reset,
    })

    return () => (
      <>
        <div class="modal-trigger" style="display: inline-block">
          { slots.default?.() || (
            <NButton size="small" type="primary" onClick={handleVisible}>
              { props.title ?? '打开' }
            </NButton>
          )}
        </div>

        <NModal
          v-model:show={visible.value}
          preset="card"
          title={props.title}
          style={{ bodyStyle: typeof width === 'number' ? { width: `${width}px` } : { width } }}
        >
          {{
            default: () => (
              <ProForm
                ref={formRef}
                columns={columns.value}
                mode="modal"
                model={props.model}
                {...attrs}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            ),
            footer: () => (
              <NSpace justify="end" wrap={false}>
                <NButton onClick={close}>取消</NButton>
                <NButton type="primary" onClick={_submit}>确定</NButton>
                <NButton onClick={_reset}>重置</NButton>
              </NSpace>
            ),
          }}
        </NModal>
      </>
    )
  },
})
