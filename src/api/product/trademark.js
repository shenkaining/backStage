import request from '@/utils/request'
// 获取品牌管理数据
export const reqPage = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)
// 新增品牌或修改品牌
export const reqAddOrUpdate = (trademark) => {
  if (trademark.id) {
    // 如果数据中含有id代表是修改品牌信息
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: trademark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: trademark })
  }
}
// 删除品牌
export const reqDeleteTM = (id) => request.delete(`/admin/product/baseTrademark/remove/${id}`)
