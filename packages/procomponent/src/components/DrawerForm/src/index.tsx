import { NButton, NDrawer, NDrawerContent, NLayout, NSpace } from 'naive-ui'
import { computed, defineComponent, Fragment, ref, toRefs } from 'vue'
import { ProForm } from '@components/ProForm'
import { drawerFormProps, drawerFormEmits, type DrawerFormExpose } from './types'

export default defineComponent({
  name: 'DrawerForm',
  props: drawerFormProps,
  emits: drawerFormEmits,
  setup(props, { attrs, emit, slots, expose }) {
    const { closable, hideFooter, title, defaultValue, ...restDrawerProps } = toRefs(props)

    const drawerProp = computed(() => {
      const values = Object.entries(restDrawerProps).map(item => ({
        [item[0]]: item[1].value
      }))

      return values
    })

    const columns = computed(() => {
      const cols = props.columns
      return cols.filter(col => col?.type !== 'index' && col?.type !== 'selection' && col?.key !== 'actions')
    })

    // const defaultValue = computed(() => props.defaultValue)

    const visible = ref(false)

    function open() {
      visible.value = true
    }

    function close() {
      visible.value = false
    }

    expose<DrawerFormExpose>({
      open,
      close,
    })

    const formRef = ref()

    async function handleSubmit(values: any) {
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
      formRef.value.submit()
    }

    function _reset() {
      formRef.value.reset()
    }

    return () => (
      <Fragment>
        <div style="display: inline-block" onClick={open}>
          { slots.trigger
            ? slots.trigger()
            : (
                <NButton size="small" type="primary">
                  { props.title ? props.title : '打开' }
                </NButton>
              ) }
        </div>
        <NDrawer v-model:show={visible.value}
          { ...drawerProp}
        >
          <NDrawerContent closable={props.closable} title={props.title}>
            <NLayout>
              {
                slots.default
                  ? slots.default?.()
                  : (
                      <ProForm
                        ref={formRef}
                        { ...attrs }
                        defaultValue={defaultValue.value}
                        columns={columns.value}
                        mode="drawer"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      />
                    )
              }
            </NLayout>
            {
              !props.hideFooter && (
                <Fragment>
                  { slots.footer
                    ? slots.footer()
                    : (
                        <NSpace justify="end">
                          <NButton onClick={_reset}>重置</NButton>
                          <NButton type="primary" onClick={_submit}>确定</NButton>
                        </NSpace>
                      )}
                </Fragment>
              )
            }
          </NDrawerContent>
        </NDrawer>
      </Fragment>
    )
  },
})
