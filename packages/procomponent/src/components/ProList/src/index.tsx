import { defineComponent } from 'vue'
import { NFlex, NList, NListItem, NPagination, NSpin } from 'naive-ui'
import { listProps } from './types'
import './styles/css'

export default defineComponent({
  name: 'ProList',
  props: listProps,
  emits: ['update:page', 'update:pageSize', 'pageChange', 'pageSizeChange'],
  setup(props, { emit }) {
    /**
     * 页码改变事件
     * @param page 当前页码
     */
    const handlePageChange = (page: number) => {
      emit('update:page', page)
      emit('pageChange', page)
    }

    /**
     * 每页条数改变事件
     * @param pageSize 每页条数
     */
    const handlePageSizeChange = (pageSize: number) => {
      emit('update:pageSize', pageSize)
      emit('pageSizeChange', pageSize)
    }

    return () => {
      return (
        <NFlex vertical>
          <NSpin show={props.loading}>
            <NList>
              {{
                header: props.title,
                default: () =>
                  props.data.map((item) => {
                    return <NListItem key={item.id}>{props.renderItem(item)}</NListItem>
                  }),
              }}
            </NList>
          </NSpin>
          <div class="flex justify-end mt-4">
            <NPagination
              {...props.pagination}
              onUpdate:page={handlePageChange}
              onUpdate:pageSize={handlePageSizeChange}
            />
          </div>
        </NFlex>
      )
    }
  },
})
