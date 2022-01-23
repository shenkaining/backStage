<template>
  <div>
    <el-form :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" placeholder="描述" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="saleAttrId" :placeholder="`还有${unSelectSaleAttr.length}项未选择`">
          <el-option v-for="saleAttr in unSelectSaleAttr" :key="saleAttr.id" :label="saleAttr.name" :value="`${saleAttr.id}+${saleAttr.name}`" />
        </el-select>
        <el-button type="primary" :disabled="unSelectSaleAttr.length<1" icon="el-icon-plus" @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="spu.spuSaleAttrList"
          style="width: 100%"
          border=""
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          />
          <el-table-column
            label="属性值名称列表"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row,index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                :ref="$index"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row,$index)">+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSaleAttr($index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '', // 预览图片的地址
      dialogVisible: false, // 控制预览图片显示隐藏
      spu: {
        'category3Id': 0,
        'description': '',
        'spuImageList': [],
        'spuName': '',
        'spuSaleAttrList': [],
        'tmId': ''
      },
      tradeMarkList: [], // 品牌列表
      imgList: [], // 图片列表
      saleAttrList: [], // 销售属性列表
      saleAttrId: ''
    }
  },
  computed: {
    // 计算出没有被选中的售卖属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter(item1 => {
        return this.spu.spuSaleAttrList.every(item => item.saleAttrName !== item1.name)
      })
    }
  },
  methods: {
    // 删除照片墙中照片的回调
    handleRemove(file, fileList) {
      // file代表被删除的图片信息，fileList代表删除后的数组
      // console.log(file, fileList)
      this.imgList = fileList
    },
    // 照片墙预览照片的回调
    handlePictureCardPreview(file) {
      // file代表预览图片的信息
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 图片上传成功调用
    uploadSuccess(response, file, fileList) {
      // 三个参数分别代表：上传成功的响应信息，上传的图片信息，上传后的数组
      // console.log(response, file, fileList)
      this.imgList = fileList
    },
    // 通过$refs调用子组件中的方法，传递需要修改的spu的信息
    async getData(row) {
      // console.log(row)
      const res = await this.$API.spu.reqSpuInfo(row.id)
      // console.log(res)
      if (res.code === 200) {
        this.spu.spuName = res.data.spuName
        this.spu.description = res.data.description
        this.spu.category3Id = res.data.category3Id
        this.spu.tmId = res.data.tmId
        this.spu.spuSaleAttrList = res.data.spuSaleAttrList
        this.spu.id = res.data.id
      }
      // 获取品牌列表
      const tmList = await this.$API.spu.reqTMList()
      if (tmList.code === 200) {
        this.tradeMarkList = tmList.data
      }
      // 获取图片列表
      const imgList = await this.$API.spu.reqSpuImgList(row.id)
      if (imgList.code === 200) {
        this.imgList = imgList.data
        this.imgList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
      }
      // 获取所有销售属性
      const saleAttrList = await this.$API.spu.reqSaleAttrList()
      // console.log(saleAttrList)
      if (saleAttrList.code === 200) {
        this.saleAttrList = saleAttrList.data
      }
    },
    // 添加销售属性
    addSaleAttr() {
      // 对数组进行结构赋值
      const [id, name] = this.saleAttrId.split('+')
      const newSaleAttr = {
        baseSaleAttrId: id,
        saleAttrName: name,
        spuSaleAttrValueList: []
      }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.saleAttrId = ''
    },
    // 销售属性表格添加tag时的blur事件
    handleInputConfirm(row) {
      row.inputVisible = false
      // 判断不能为空
      if (row.inputValue.trim() === '') {
        this.$message.error('请输入正确的值')
        return
      }
      // 判断不能输入重复的值，some()方法会返回布尔值
      const res = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.inputValue)
      // console.log(res)
      if (res) {
        this.$message.error('请勿输入重复的值')
        return
      }
      // 收集新增的tag的值与销售属性id，追加到数组进行动态显示
      const newSaleAttrValue = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue
      }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    // 添加tag显示隐藏input
    showInput(row, $index) {
      // 给row上添加一个动态响应的自定义属性
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[$index].focus()
      })
    },
    // 删除tag
    handleClose(row, index) {
      // 根据传入的index删除数组中元素
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 删除整行销售属性
    deleteSaleAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1)
    },
    // 点击提交
    async saveOrUpdate() {
      // 使用map()方法重构一个符合要求的数组，不改变原数组
      this.spu.spuImageList = this.imgList.map(item => {
        // 返回的对象就是重构后数组的每个元素
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      try {
        await this.$API.spu.reqSaveOrUpdate(this.spu)
        this.$message.success('提交成功')
        this.$emit('closeStage', { stage: 0, update: this.spu.id })
      } catch (error) {
        this.$message.error('提交失败')
      }
      // 提交完成也要清空数据
      // 这里使用Object.assign()方法合并对象，相同的属性后面的对象覆盖前面对象，$options的data()函数中为空数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击取消
    cancel() {
      // 点击取消显示当前页信息
      this.$emit('closeStage', { stage: 0, update: 1 })
      // 每次点击取消 就清空spu中的数据
      // 这里使用Object.assign()方法合并对象，相同的属性后面的对象覆盖前面对象，$options的data()函数中为空数据
      Object.assign(this._data, this.$options.data())
    },
    // 添加spu
    async addSpu(category3Id) {
      this.spu.category3Id = category3Id
      // 获取品牌列表
      const tmList = await this.$API.spu.reqTMList()
      if (tmList.code === 200) {
        this.tradeMarkList = tmList.data
      }
      // 获取所有销售属性
      const saleAttrList = await this.$API.spu.reqSaleAttrList()
      // console.log(saleAttrList)
      if (saleAttrList.code === 200) {
        this.saleAttrList = saleAttrList.data
      }
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
