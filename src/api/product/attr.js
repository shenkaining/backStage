import request from '@/utils/request'

// 获取一级分类列表信息
export const reqCategoryList1 = () => request.get('/admin/product/getCategory1')
// 获取二级分类列表信息
export const reqCategoryList2 = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)
// 获取三级分类列表信息
export const reqCategoryList3 = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`)

// 获取具体的商品属性
export const reqAttrList = ({ category1Id, category2Id, category3Id }) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
// 向服务器上传新增的/修改后的属性值
export const reqAddOrUpdateAttr = (data) => request.post('/admin/product/saveAttrInfo', data)
