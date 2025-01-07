import {
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
} from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NaiveProvider',
  setup(_, { slots }) {
    const chilren = slots.default?.() || []

    return () => (
      <NLoadingBarProvider>
        <NMessageProvider>
          <NNotificationProvider>
            <NModalProvider>
              { chilren }
            </NModalProvider>
          </NNotificationProvider>
        </NMessageProvider>
      </NLoadingBarProvider>
    )
  },
})
