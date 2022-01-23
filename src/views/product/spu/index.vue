<template>
  <div>
    <el-card>
      <Category :show="!isShowTab" @sendCategoryId="getCategoryId" />
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="stage===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table
          :data="list"
          style="width: 100%;margin:10px 0"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          />
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          />
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{row}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改该spu" @click="editSpu(row)" />
              <el-button type="info" icon="el-icon-info" size="mini" title="查看sku信息" @click="showSkuList(row)" />
              <el-popconfirm
                title="确定删除当前SPU吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除该spu" style="margin-left:10px" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style=";text-align:center"
          :current-page="page"
          :page-sizes="[3,5,7]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SpuForm v-show="stage===1" ref="spu" @closeStage="changeStage" />
      <SkuForm v-show="stage===2" ref="sku" @closeStage="changeStage" />
    </el-card>
    <!-- sku列表展示对话框 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
      <el-table v-loading="loading" :data="skuList">
        <el-table-column property="skuName" label="名称" width="250" />
        <el-table-column property="price" label="价格(元)" width="200" />
        <el-table-column property="weight" label="重量(KG)" width="200" />
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      isShowTab: true, // 是否禁用三级分类
      category1Id: 0,
      category2Id: 0,
      category3Id: 0, // 获取第三级分类id
      page: 1, // 分页器当前页
      limit: 3, // 每页显示数据数量
      list: [], // 每页显示的数据
      total: 0, // 总页数
      stage: 0, // 切换显示不同页面
      dialogTableVisible: false,
      skuList: [],
      spu: {},
      loading: true
    }
  },
  methods: {
    // 获取category组件传过来的三级Id
    getCategoryId(val) {
      this.category1Id = val.category1Id
      this.category2Id = val.category2Id
      this.category3Id = val.category3Id
      this.getData()
    },
    // 获取spu列表信息
    async getData(pager = 1) {
      this.page = pager
      const res = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    // 更改pagesize触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getData(this.page)
    },
    // 页面跳转触发
    handleCurrentChange(pager) {
      this.getData(pager)
    },
    // 点击添加spu
    addSpu() {
      this.stage = 1
      this.isShowTab = false
      // 点击添加时将category3Id传过去
      this.$refs.spu.addSpu(this.category3Id)
    },
    // 点击修改spu按钮
    editSpu(row) {
      this.stage = 1
      this.isShowTab = false
      this.$refs.spu.getData(row)
    },
    // 改变显示的页面
    changeStage({ stage, update }) {
      this.stage = stage
      this.isShowTab = true
      // 重新获取展示信息
      // 更新spu停留在当前页
      if (update) {
        this.getData(this.page)
      } else {
        // 新增spu返回第一页
        this.getData()
      }
    },
    // 删除spu
    async deleteSpu(row) {
      const res = await this.$API.spu.reqDeleteSpu(row.id)
      if (res.code === 200) {
        // 删除后判断当前页的数据数量，如果当前页没有数据就往前跳一页
        this.getData(this.list.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku
    addSku(row) {
      this.isShowTab = false
      this.stage = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 展示list列表信息
    async showSkuList(row) {
      this.spu = row
      this.dialogTableVisible = true
      const res = await this.$API.spu.reqSkuList(row.id)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      }
    },
    // dialog关闭前的回调
    handleClose(done) {
      // 每次关闭对话框前要把loading状态改为true，否则会一直是false
      this.loading = true
      // 关闭前清空table数据，避免每次一开始显示上一次的数据
      this.skuList = []
      // 需要调用done()才能关闭
      done()
    }
  }
}
</script>

<style>

</style>
