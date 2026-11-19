import type { App, Plugin } from 'vue'
import ProTabs from './src'

export const ProTabsPlugin: Plugin = {
  install(app: App) {
    app.component('ProTabs', ProTabs)
  },
}

export {
  ProTabs,
}

export type {
  ContextMenuCommand,
  PanelLoader,
  ProTabsContextMenuLabels,
  ProTabsDragGroup,
  ProTabsEmits,
  ProTabsInstance,
  ProTabsProps,
  ProTabsRouter,
  ProTabsSize,
  ProTabsTransferPayload,
  TabBadge,
  TabOption,
} from './src/types'

export type { VirtualWindow } from './src/virtual'
