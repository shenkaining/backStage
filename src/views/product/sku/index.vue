<template>
  <div>
    <el-table
      v-loading="loading"
      :data="skuList"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
        align="center"
      />
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      />
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      />
      <el-table-column
        label="默认图片"
        width="120"
      >
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量(KG)"
        width="200"
      />
      <el-table-column
        prop="price"
        label="价格(元)"
        width="100"
      />
      <el-table-column
        label="操作"
        width="width"
      >
        <template slot-scope="{row}">
          <el-button v-if="row.isSale!==1" type="success" icon="el-icon-top" size="mini" @click="sale(row)" />
          <el-button v-else type="info" icon="el-icon-bottom" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message('开发中...')" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="showInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style=";text-align:center"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-drawer

      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      :before-close="handleClose"
      :show-close="false"
    >
      <div v-loading="drawerLoading">

        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <template>
              <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right:10px">{{ attr.attrName }}:{{ attr.valueName }}</el-tag>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="10">
            <el-carousel height="400px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="height:400px">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </div>

    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      loading: true, // 加载状态的显示隐藏
      drawerLoading: true, // 抽屉的加载状态
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      drawer: false, // 抽屉的显示隐藏
      direction: 'rtl', // 抽屉出现的方向 right to left
      skuInfo: {}
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku展示的数据
    async getSkuList() {
      const res = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.skuList = res.data.records
        this.loading = false
      }
    },
    // 上架商品
    async sale(row) {
      // console.log(row.isSale)
      try {
        await this.$API.sku.reqOnSale(row.id)
        this.$message.success('上架成功')
        this.getSkuList()
      } catch (error) {
        this.$message.error('上架失败')
      }
    },
    // 下架商品
    async cancel(row) {
      // console.log(row.isSale)
      try {
        await this.$API.sku.reqCancelSale(row.id)
        this.$message.success('下架成功')
        this.getSkuList()
      } catch (error) {
        this.$message.error('下架失败')
      }
    },
    // 展示sku信息的抽屉组件
    async showInfo(row) {
      this.drawer = true
      const res = await this.$API.sku.reqSkuInfo(row.id)
      if (res.code === 200) {
        this.skuInfo = res.data
        this.drawerLoading = false
      }
    },
    // 页面跳转的回调
    handleCurrentChange(pager) {
      this.page = pager
      this.loading = true
      this.getSkuList()
    },
    // 页面数据数量变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.loading = true
      this.getSkuList()
    },
    // 抽屉关闭前的回调
    handleClose(done) {
      this.skuInfo = {}
      this.drawerLoading = true
      done()
    }
  }
}
</script>

<style scoped>
.el-row {
  /* overflow: hidden; */
  min-height: 40px;
  margin-bottom: 20px;
}
.el-col-5 {
  padding-right: 20px;
  text-align: right;
  font-size: 20px;
  font-weight: 700;
}
.el-col-16{
  font-size: 20px;
}
>>>.el-carousel__button{
  width: 10px;
  height: 10px;
  background-color: orange;
  border-radius: 50%;
}
</style>
