import request from '@/utils/request'

// 获取sku模块的展示信息
export const reqSkuList = (page, limit) => request.get(`/admin/product/list/${page}/${limit}`)

// 上架商品
export const reqOnSale = (skuId) => request.get(`/admin/product/onSale/${skuId}`)

// 下架商品
export const reqCancelSale = (skuId) => request.get(`/admin/product/cancelSale/${skuId}`)

// 获取具体商品的信息
export const reqSkuInfo = (skuId) => request.get(`/admin/product/getSkuById/${skuId}`)
