import { NButton, NDrawer, NDrawerContent, NSpace } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { ProForm } from '@components/ProForm'
import {
  drawerFormEmits,
  drawerFormProps,
  type DrawerFormExpose,
  type DrawerFormFooterScope,
} from './types'

interface FormValues {
  [key: string]: any
}

export default defineComponent({
  name: 'DrawerForm',
  inheritAttrs: false,
  props: drawerFormProps,
  emits: drawerFormEmits,
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

    expose<DrawerFormExpose>({
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

    function toCssLength(value: number | string | undefined) {
      if (value === undefined) return undefined
      return typeof value === 'number' ? `${value}px` : value
    }

    const drawerWidth = computed(() => toCssLength(props.width))
    const drawerHeight = computed(() => toCssLength(props.height))

    const drawerAttrs = computed(() => ({
      placement: props.placement,
      width: drawerWidth.value,
      height: drawerHeight.value,
      resizable: props.resizable,
      maskClosable: props.maskClosable,
      showMask: props.showMask,
      closeOnEsc: props.closeOnEsc,
      blockScroll: props.blockScroll,
      autoFocus: props.autoFocus,
      trapFocus: props.trapFocus,
      displayDirective: props.displayDirective,
      zIndex: props.zIndex,
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
        <div class="bm-drawer-form-trigger" style="display: inline-block" onClick={open}>
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
          mode="drawer"
          columns={columns.value}
          defaultValue={props.defaultValue}
        />
      )
    }

    function renderHeader() {
      if (!slots.header && !slots['header-extra']) return undefined
      return (
        <div style="display: flex; align-items: center; gap: 8px; width: 100%">
          <div style="min-width: 0">{slots.header ? slots.header() : props.title}</div>
          {slots['header-extra'] ? <div style="margin-left: auto">{slots['header-extra']!()}</div> : null}
        </div>
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
        } satisfies DrawerFormFooterScope)
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

    return () => {
      const header = renderHeader()
      return (
        <>
          {renderTrigger()}

          <NDrawer
            {...drawerAttrs.value}
            show={visible.value}
            {...{ 'onUpdate:show': setVisible }}
          >
            <NDrawerContent title={props.title} closable={props.closable}>
              {{
                default: renderForm,
                ...(header ? { header: () => header } : {}),
                ...(props.hideFooter ? {} : { footer: renderFooter }),
              }}
            </NDrawerContent>
          </NDrawer>
        </>
      )
    }
  },
})
