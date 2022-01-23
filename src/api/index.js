import * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'
import * as user from './acl/user'
import permission from './acl/permission'
import role from './acl/role'

// 将所有 api 一起暴露，方便组件中调用
export default {
  trademark,
  attr,
  spu,
  sku,
  user,
  permission,
  role
}
