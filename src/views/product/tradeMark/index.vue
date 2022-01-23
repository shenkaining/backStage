<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTm">添加</el-button>
    <el-table
      :data="list"
      border
      style="width: 100%;margin-top:10px"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      />
      <el-table-column label="品牌LOGO" width="width" prop="logoUrl">
        <!-- 通过作用域插槽将每个 item 回传 -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row}">
          <!-- 将每个item的数据传给事件 -->
          <el-button type="warning" icon="el-icon-edit" @click="editTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="page"
      :page-sizes="[3,5,7]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- visible 对话框的显示隐藏 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- :model动态收集表单对象，:rules给表单添加验证规则，ref代表给表单绑定提交表单的回调 -->
      <el-form ref="ruleForm" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action代表上传的服务器地址，这里由于proxy所以要加上代理前缀 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 上传后会显示上传的图片 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 当前页
      page: 1,
      // 每页显示数据数量
      limit: 5,
      // 每页的所有数据
      list: [],
      // 所有数据数量
      total: 0,
      // 添加商品的对话框的显示与隐藏
      dialogFormVisible: false,
      // 对话框收集的表单内容
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        // 规则与每个表单item的prop对应
        tmName: [
          // trigger代表触发验证的行为（事件），blur失去焦点，change内容发生改变
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          // 上传图片的组件并不是表单元素，所以不用加trigger
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表信息，如果没有传参就设置pager一个默认值1
    async getPageList(pager = 1) {
      this.page = pager
      const result = await this.$API.trademark.reqPage(this.page, this.limit)
      if (result.code === 200) {
        this.list = result.data.records
        this.total = result.data.total
      }
    },
    // 每次分页器的当前页改变触发
    handleCurrentChange(pager) {
      this.page = pager
      this.getPageList(this.page)
    },
    // 每次page-size改变触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList(this.page)
    },
    // 点击添加触发
    addTm() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 点击修改触发
    editTradeMark(row) {
      this.dialogFormVisible = true
      // 将服务器请求得到的row传进来
      // this.tmForm = row 不能直接赋值，这样是深拷贝会导致tmForm中数据修改，row数据也被修改，渲染的表格也会发生改变
      // 通过扩展运算符变成 浅拷贝
      this.tmForm = { ...row }
    },
    // 上传图片成功触发回调，res为上传成功的服务器返回数据，file也差不多
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.code === 200) {
        this.tmForm.logoUrl = res.data
      } else {
        this.$message.error('图片上传失败')
      }
    },
    // 图片上传前进行验证
    beforeAvatarUpload(file) {
      // 验证图片类型
      const isJPGOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      // 验证图片大小
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPng) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGOrPng && isLt2M
    },
    // 新增品牌或修改品牌
    addOrUpdate() {
      // 表单验证，提交表单时触发回调
      this.$refs.ruleForm.validate(async success => {
        // 提交表单会得到 形参，如果验证成功结果为true，验证失败结果为false
        if (success) {
          const res = await this.$API.trademark.reqAddOrUpdate(this.tmForm)
          if (res.code === 200) {
            // 根据数据中是否有id判断是新增的还是修改原有的
            this.$message.success(this.tmForm.id ? '品牌修改成功' : '品牌上传成功')
            this.dialogFormVisible = false
            // 新增品牌完成就跳转到首页，如果是修改就留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          } else {
            this.$message.error('上传失败')
          }
        } else {
          return false
        }
      })
    },
    // 点击删除按钮
    deleteTradeMark(row) {
      // console.log(row)
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 点击确定删除触发
        // 发送请求删除品牌
        const res = await this.$API.trademark.reqDeleteTM(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 删除后重新获取列表，如果这页的品牌删除完了就请求前一页的数据
        this.getPageList(this.list.length > 0 ? this.page : this.page - 1)
      }).catch(() => {
        // 点击取消按钮
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
