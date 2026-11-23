import { NButton, NModal, NSpace, NStep, NSteps } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { ProForm } from '@components/ProForm'
import {
  stepsFormEmits,
  stepsFormProps,
  type StepsFormExpose,
  type StepsFormFooterScope,
  type StepsFormStepScope,
} from './types'

export default defineComponent({
  name: 'StepsForm',
  inheritAttrs: false,
  props: stepsFormProps,
  emits: stepsFormEmits,
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

    const current = ref(0)
    const stepErrors = ref<Record<number, boolean>>({})
    const values = ref<Record<string, any>>({ ...props.model, ...props.defaultValue })
    const forms = ref<any[]>([])
    // 步骤表单已挂载时，重置需要强制重新挂载才能按 defaultValue 重新初始化
    const stepVersion = ref(0)

    watch(
      () => props.model,
      (model) => {
        if (!model || typeof model !== 'object') return
        values.value = { ...values.value, ...model }
      },
      { deep: true },
    )

    const stepCount = computed(() => props.steps.length)
    const isFirst = computed(() => current.value === 0)
    const isLast = computed(() => current.value >= Math.max(stepCount.value - 1, 0))

    function open() {
      setVisible(true)
    }

    function close() {
      setVisible(false)
    }

    function reset() {
      const previous = current.value
      values.value = { ...props.defaultValue }
      current.value = 0
      stepErrors.value = {}
      if (previous === 0) stepVersion.value += 1
      else emit('step-change', 0, previous)
      emit('reset')
    }

    function setFormRef(index: number, form: any) {
      forms.value[index] = form
    }

    function filterColumns(columns: any[]) {
      return (columns || []).filter(col =>
        !['index', 'selection'].includes(col?.type as string) && col?.key !== 'actions'
      )
    }

    function handleUpdateModel(partial: Record<string, any>) {
      values.value = { ...values.value, ...partial }
      emit('update:model', { ...values.value })
    }

    function setFieldValue(key: string, value: any) {
      const form = forms.value[current.value]
      if (form?.setFieldValue) {
        form.setFieldValue(key, value)
        return
      }
      values.value = { ...values.value, [key]: value }
      emit('update:model', { ...values.value })
    }

    async function validateCurrent() {
      const form = forms.value[current.value]
      const passed = form?.validate ? await form.validate() : true
      stepErrors.value = { ...stepErrors.value, [current.value]: !passed }
      return passed
    }

    function goTo(index: number) {
      const previous = current.value
      if (index === previous) return
      current.value = index
      emit('step-change', index, previous)
    }

    async function next(): Promise<boolean> {
      if (!(await validateCurrent())) return false
      if (current.value < stepCount.value - 1) {
        goTo(current.value + 1)
        return true
      }
      return submit()
    }

    function prev() {
      if (current.value > 0) goTo(current.value - 1)
    }

    async function submit(): Promise<boolean> {
      if (!(await validateCurrent())) return false
      emit('submit', { ...values.value })
      if (props.closeOnSubmit) close()
      return true
    }

    function setStep(index: number) {
      if (!Number.isInteger(index) || index < 0 || index >= stepCount.value) return false
      goTo(index)
      return true
    }

    expose<StepsFormExpose>({
      open,
      close,
      next,
      prev,
      submit,
      reset,
      setStep,
      setFieldValue,
      current: current as unknown as number,
      forms: forms as unknown as any[],
      form: computed(() => forms.value[current.value]),
    })

    const modalWidth = computed(() => {
      return typeof props.width === 'number' ? `${props.width}px` : props.width
    })

    const modalAttrs = computed(() => ({
      preset: 'card' as const,
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

    function stepStatus(index: number) {
      if (stepErrors.value[index]) return 'error'
      if (index < current.value) return 'finish'
      if (index === current.value) return 'process'
      return 'wait'
    }

    function renderTrigger() {
      if (!props.showTrigger) return null
      return (
        <div class="bm-steps-form-trigger" style="display: inline-block" onClick={open}>
          {slots.trigger
            ? slots.trigger()
            : slots.default
              ? slots.default()
              : <NButton size="small" type="primary">打开</NButton>}
        </div>
      )
    }

    function renderSteps() {
      return (
        <div class="bm-steps-form-steps" style="margin-bottom: 24px">
          <NSteps current={current.value} size={props.stepSize}>
            {props.steps.map((step, index) => (
              <NStep
                key={index}
                title={step.title}
                description={step.description}
                status={stepStatus(index)}
              />
            ))}
          </NSteps>
        </div>
      )
    }

    function renderStepForm() {
      const step = props.steps[current.value]
      if (!step) return null
      if (slots.step) {
        return slots.step({
          step,
          index: current.value,
          values: values.value,
          setFieldValue,
        } satisfies StepsFormStepScope)
      }
      return (
        <ProForm
          key={`${current.value}-${stepVersion.value}`}
          ref={(form: any) => setFormRef(current.value, form)}
          {...attrs}
          {...{
            model: values.value,
            'onUpdate:model': handleUpdateModel,
          }}
          mode="modal"
          columns={filterColumns(step.columns)}
        />
      )
    }

    function renderContent() {
      return (
        <div class="bm-steps-form">
          {stepCount.value > 0 ? renderSteps() : null}
          <div class="bm-steps-form-body">{renderStepForm()}</div>
        </div>
      )
    }

    function renderFooter() {
      if (props.hideFooter) return null
      if (slots.footer) {
        return slots.footer({
          close,
          prev,
          next,
          submit,
          current: current.value,
          stepCount: stepCount.value,
          isFirst: isFirst.value,
          isLast: isLast.value,
          confirmLoading: props.confirmLoading,
        } satisfies StepsFormFooterScope)
      }
      return (
        <NSpace justify="end" wrap={false}>
          {isFirst.value ? null : <NButton onClick={prev}>{props.prevText}</NButton>}
          <NButton onClick={close}>{props.cancelText}</NButton>
          <NButton
            type="primary"
            loading={props.confirmLoading}
            disabled={props.confirmLoading}
            onClick={() => (isLast.value ? submit() : next())}
          >
            {isLast.value ? props.submitText : props.nextText}
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
            default: renderContent,
            ...(slots['header-extra'] ? { 'header-extra': slots['header-extra'] } : {}),
            ...(props.hideFooter ? {} : { footer: renderFooter }),
          }}
        </NModal>
      </>
    )
  },
})
