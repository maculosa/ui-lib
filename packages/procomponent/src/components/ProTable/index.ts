import type { App, Plugin } from 'vue'
import ProTable from './src'

export const ProTablePlugin: Plugin = {
  install(app: App) {
    app.component('ProTable', ProTable)
  },
}

export {
  ProTable,
}

export type {
  ProTableRequest,
  ProTableRequestParams,
  ProTableRequestResult,
  ProTableSorter,
  ProTableInstance,
} from './src/types'
