<template>
  <div>
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="规格描述" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="attrInfo in attrInfoList" :key="attrInfo.id" :label="attrInfo.attrName" style="margin:0 0 0 20px">
            <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attr in attrInfo.attrValueList" :key="attr.id" :label="attr.valueName" :value="`${attrInfo.id}:${attr.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in saleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName" style="margin-left:20px">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          :data="imgList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="100"
            align="center"
          />
          <el-table-column
            prop="prop"
            label="图片"
            width="width"
          >
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;heught:100px">
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="名称"
            width="width"
          >
            <template slot-scope="{row}">
              {{ row.imgName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault===0" type="primary" @click="isDefault(row)">设置为默认</el-button>
              <el-button v-else type="success" plain disabled>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spuName: '',
      skuInfo: {
        'category3Id': 0,
        'price': '',
        'spuId': '',
        'tmId': 0,
        'skuDesc': '',
        'weight': '',
        'skuName': '',
        'skuDefaultImg': '',
        'skuAttrValueList': [
          // {
          //   'attrId': 0,
          //   'valueId': 0
          // }
        ],
        'skuImageList': [
          // {
          //   'imgName': 'string',
          //   'imgUrl': 'string',
          //   "spuImgId" : 0,
          //   "isDefault" :''
          // }
        ],
        'skuSaleAttrValueList': [
          // {
          //   'saleAttrId': 0,
          //   'saleAttrValueId': 0
          // }
        ]
      },
      imgList: [], // 图片列表
      attrInfoList: [], // 平台属性列表
      saleAttrList: [], // 销售属性列表
      selectImgList: [] // 选择的图片
    }
  },
  methods: {
    // 获取新增sku所需的数据
    async getData(category1Id, category2Id, row) {
      // console.log(category1Id, category2Id, row)
      this.spuName = row.spuName
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      // 获取平台属性
      const attrInfoList = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, row.category3Id)
      if (attrInfoList.code === 200) {
        this.attrInfoList = attrInfoList.data
      }
      // 获取图片列表
      const imgList = await this.$API.spu.reqSpuImgList(row.id)
      if (imgList.code === 200) {
        this.imgList = imgList.data
        this.imgList.forEach(item => {
          // 绑定动态响应的属性，设置默认图片
          this.$set(item, 'isDefault', 0)
        })
      }
      // 获取销售属性
      const saleAttrList = await this.$API.spu.reqSkuSaleAttrList(row.id)
      if (saleAttrList.code === 200) {
        this.saleAttrList = saleAttrList.data
      }
    },
    // 点击表格中的复选框触发事件
    handleSelectionChange(selection) {
      // 每次点击复选框能获取到相应的row数据，得到的是选择元素组成的数组
      // console.log(selection)
      this.selectImgList = selection
    },
    // 点击成为默认图片
    isDefault(row) {
      this.imgList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击提交按钮
    async submit() {
      // 通过 reduce()方法先创建一个空数组，将符合的元素push到里面，最后返回
      // 将得到的新数组赋值给skuInfo.skuAttrValueList
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 将得到的新数组赋值给skuInfo.skuSaleAttrValueList
      this.skuInfo.skuSaleAttrValueList = this.saleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 将选择的图片列表映射一个新的数组，并赋值给skuInfo，skuImageList
      this.skuInfo.skuImageList = this.selectImgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          spuImgId: item.id,
          isDefault: item.isDefault
        }
      })
      try {
        await this.$API.spu.reqSaveSkuInfo(this.skuInfo)
        this.$message.success('提交成功')
        this.$emit('closeStage', { stage: 0, update: 1 })
      } catch (error) {
        this.$message.error('提交失败')
      }
    },
    // 取消按钮
    cancel() {
      // 取消后留在当前页
      this.$emit('closeStage', { stage: 0, update: 1 })
      // 清空data数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>

</style>
