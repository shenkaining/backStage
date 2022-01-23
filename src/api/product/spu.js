import request from '@/utils/request'

// 请求获取Spu数据，需要参数 page、limit、categoryId
export const reqSpuList = (page, limit, category3Id) => request.get(`/admin/product/${page}/${limit}`, { params: { category3Id }})

// 获取修改的spu信息
export const reqSpuInfo = (spuId) => request.get(`/admin/product/getSpuById/${spuId}`)

// 获取品牌列表
export const reqTMList = () => request.get('/admin/product/baseTrademark/getTrademarkList')

// 获取图片列表
export const reqSpuImgList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)

// 获取所有销售属性
export const reqSaleAttrList = () => request.get('/admin/product/baseSaleAttrList')

// 上传新的spu或更新原有spu，区别就是是否含有id
export const reqSaveOrUpdate = (spuInfo) => {
  if (spuInfo.id) {
    return request.post('/admin/product/updateSpuInfo', spuInfo)
  } else {
    return request.post('/admin/product/saveSpuInfo', spuInfo)
  }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request.delete(`/admin/product/deleteSpu/${spuId}`)

// 给spu分类添加sku具体商品
// 获取spuimglist，其实与修改spu是同一接口
// export const reqSpuImgList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)

// 获取平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

// 获取平台属性
export const reqSkuSaleAttrList = (spuId) => request.get(`/admin/product/spuSaleAttrList/${spuId}`)

// 保存skuInfo
export const reqSaveSkuInfo = (skuInfo) => request.post('/admin/product/saveSkuInfo', skuInfo)

// 查看某项spu下的sku列表
export const reqSkuList = (spuId) => request.get(`/admin/product/findBySpuId/${spuId}`)
