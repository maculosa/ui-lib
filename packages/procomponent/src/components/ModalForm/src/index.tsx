import { NButton, NModal, NSpace } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { ProForm } from '@components/ProForm'
import { modalFormProps, modalFormEmits, type ModalFormExpose, type ModalFormFooterScope } from './types'

interface FormValues {
  [key: string]: any
}

export default defineComponent({
  name: 'ModalForm',
  inheritAttrs: false,
  props: modalFormProps,
  emits: modalFormEmits,
  setup(props, { attrs, emit, expose, slots }) {
    const innerVisible = ref(props.defaultShow)
    const visible = computed(() => (props.show === undefined ? innerVisible.value : props.show))

    function setVisible(value: boolean) {
      if (value === visible.value) return
      if (props.show === undefined) innerVisible.value = value
      emit('update:show', value)
    }

    watch(visible, (value, oldValue) => {
      if (value !== oldValue) emit(value ? 'open' : 'close')
    })

    function open() {
      setVisible(true)
    }

    function close() {
      setVisible(false)
    }

    const formRef = ref()

    function submit() {
      formRef.value?.submit()
    }

    function reset() {
      formRef.value?.reset()
    }

    function setFieldValue(key: string, value: any) {
      formRef.value?.setFieldValue(key, value)
    }

    expose<ModalFormExpose>({
      open,
      close,
      submit,
      reset,
      setFieldValue,
      form: formRef,
    })

    const columns = computed(() => {
      return props.columns.filter(col =>
        !['index', 'selection'].includes(col?.type as string) && col?.key !== 'actions'
      )
    })

    const modalWidth = computed(() => {
      return typeof props.width === 'number' ? `${props.width}px` : props.width
    })

    const modalAttrs = computed(() => ({
      preset: 'card' as const,
      // card preset renders the `title` prop and ignores the header slot
      title: () => (slots.header ? slots.header!() : props.title),
      closable: props.closable,
      maskClosable: props.maskClosable,
      closeOnEsc: props.closeOnEsc,
      blockScroll: props.blockScroll,
      autoFocus: props.autoFocus,
      trapFocus: props.trapFocus,
      displayDirective: props.displayDirective,
      zIndex: props.zIndex,
      draggable: props.draggable,
      style: { width: modalWidth.value },
    }))

    function handleSubmit(values: FormValues) {
      emit('submit', values)
      if (props.closeOnSubmit) close()
    }

    function handleReset() {
      emit('reset')
    }

    function handleUpdateModel(values: Record<string, any>) {
      emit('update:model', values)
    }

    function renderTrigger() {
      if (!props.showTrigger) return null
      return (
        <div class="bm-modal-form-trigger" style="display: inline-block" onClick={open}>
          {slots.trigger
            ? slots.trigger()
            : slots.default
              ? slots.default()
              : <NButton size="small" type="primary">打开</NButton>}
        </div>
      )
    }

    function renderForm() {
      if (slots.form) return slots.form()
      return (
        <ProForm
          ref={formRef}
          {...attrs}
          {...{
            model: props.model,
            'onUpdate:model': handleUpdateModel,
            onSubmit: handleSubmit,
            onReset: handleReset,
          }}
          mode="modal"
          columns={columns.value}
          defaultValue={props.defaultValue}
        />
      )
    }

    function renderFooter() {
      if (props.hideFooter) return null
      if (slots.footer) {
        return slots.footer({
          close,
          reset,
          submit,
          confirmLoading: props.confirmLoading,
        } satisfies ModalFormFooterScope)
      }
      return (
        <NSpace justify="end" wrap={false}>
          <NButton onClick={reset}>{props.resetText}</NButton>
          <NButton onClick={close}>{props.cancelText}</NButton>
          <NButton
            type="primary"
            loading={props.confirmLoading}
            disabled={props.confirmLoading}
            onClick={submit}
          >
            {props.submitText}
          </NButton>
        </NSpace>
      )
    }

    return () => (
      <>
        {renderTrigger()}

        <NModal
          {...modalAttrs.value}
          show={visible.value}
          {...{ 'onUpdate:show': setVisible }}
        >
          {{
            default: renderForm,
            ...(slots['header-extra'] ? { 'header-extra': slots['header-extra'] } : {}),
            ...(props.hideFooter ? {} : { footer: renderFooter }),
          }}
        </NModal>
      </>
    )
  },
})