import request from '@/utils/request'

export const getPageList = (page, limit, searchObj) => request.get(`/admin/acl/user/${page}/${limit}`, { params: searchObj })

export const getRoles = (userId) => request.get(`/admin/acl/user/toAssign/${userId}`)

export function assignRoles(userId, roleId) {
  return request({
    url: `/admin/acl/user/doAssign`,
    method: 'post',
    params: {
      userId,
      roleId
    }
  })
}
/*
批量删除多个用户
ids的结构: ids是包含n个id的数组
*/
export const removeUsers = (ids) => request.delete(`/admin/acl/user/batchRemove`, { data: ids })

/*
删除某个用户
*/
export function removeById(id) {
  return request({
    url: `/admin/acl/user/remove/${id}`,
    method: 'delete'
  })
}

/*
保存一个新的后台用户
*/
export function add(user) {
  return request({
    url: `/admin/acl/user/save`,
    method: 'post',
    data: user
  })
}

/*
更新一个后台用户
*/
export function update(user) {
  return request({
    url: `/admin/acl/user/update`,
    method: 'put',
    data: user
  })
}
