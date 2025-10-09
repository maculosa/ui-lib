import {
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider,
  NDialogProvider,
  NNotificationProvider,
  NConfigProvider
} from 'naive-ui'
import { defineComponent } from 'vue'
import { NaiveProviderProps } from './types'

export default defineComponent({
  name: 'NaiveProvider',
  props: NaiveProviderProps,
  setup(props, { slots }) {
    const children = slots.default?.() || []

    return () => (
      <NConfigProvider {...props}> 
        <NLoadingBarProvider>
          <NMessageProvider>
            <NNotificationProvider>
              <NDialogProvider>
                <NModalProvider>
                  { children }
                </NModalProvider>
              </NDialogProvider>
            </NNotificationProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})
