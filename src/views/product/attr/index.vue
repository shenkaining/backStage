<template>
  <div>
    <!-- card 上 -->
    <el-card>
      <!-- 三级分类组件 -->
      <Category :show="!isShowTab" @sendCategoryId="getCategoryId" />
    </el-card>
    <!-- card 下 -->
    <el-card style="margin-top:20px">
      <!-- 展示信息的页面 -->
      <div v-show="isShowTab">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:5px" :disabled="!categoryId.category3Id" @click="addAttr">添加属性</el-button>
        <el-table
          :data="list"
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
            prop="attrName"
            label="属性名称"
            width="200"
          />
          <el-table-column
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{row}">
              <el-tag v-for="attr in row.attrValueList" :key="attr.id" type="success" style="margin-left:20px">{{ attr.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
          >
            <template slot-scope="{row}">
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="editAttr(row)" />
              <el-button type="danger" size="mini" icon="el-icon-delete" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性值的页面 -->
      <div v-show="!isShowTab">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input v-model.trim="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTab=true">取消</el-button>
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%;margin:20px 0"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model.trim="row.valueName" placeholder="请输入属性值" size="mini" @blur="toLookModel(row,$index)" @keyup.native.enter="toLookModel(row,$index)" />
              <span v-else style="display:block" @click="toEditModel(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTab=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      // 三级Id请求得到的数据列表
      list: [],
      // 从子组件传递过来的三级Id
      categoryId: {},
      // 显示数据列表/添加属性页面
      isShowTab: true,
      // 收集添加的属性值
      attrInfo: {
        attrName: '',
        attrValueList: [

        ],
        categoryId: 0, // 三级categoryId
        categoryLevel: 3 // 三级level
      }
    }
  },
  methods: {
    // 通过子组件Category自定义事件传递过来的三级Id
    getCategoryId(val) {
      this.categoryId = { ...val }
      this.attrInfo.categoryId = val.category3Id
      this.getData()
    },
    // 获取显示页列表信息
    async getData() {
      const res = await this.$API.attr.reqAttrList(this.categoryId)
      if (res.code === 200) {
        this.list = res.data
      }
    },
    // 添加属性值
    addAttrValue() {
      // 每次点击添加属性值，让表格动态增加
      this.attrInfo.attrValueList.push({
        // 服务器返回的attrValue中的attrId应该与attrInfo的id相同，对于自己添加的属性，因为没有id所以是 undefined
        attrId: this.attrInfo.id,
        valueName: '',
        // 给每个新增的属性值添加一个flag用来切换编辑模式/查看模式
        flag: true
      })
      // 每次添加属性值，其实就是数组最后一个元素的index自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 点击添加属性
    addAttr() {
      this.isShowTab = false
      // 每次添加属性前都要先清空添加属性页面
      this.attrInfo = {
        attrName: '',
        attrValueList: [

        ],
        categoryId: this.categoryId.category3Id, // 三级categoryId
        categoryLevel: 3 // 三级level
      }
    },
    // 修改属性
    editAttr(row) {
      this.isShowTab = false
      // row对象中包含数组，数组中又包含对象，所以浅拷贝没办法解决深层的对象引用问题
      // this.attrInfo = { ...row }
      // 方法一：借助lodash插件的cloneDeep进行深拷贝
      this.attrInfo = cloneDeep(row)
      // 方法二：通过JSON将对象先转换成字符串，再转换成对象，这样就不再是原始对象
      // this.attrInfo = JSON.parse(JSON.stringify(row))
      // 给服务器返回的attrValueList中的元素都添加flag属性，用于切换编辑/查看模式
      this.attrInfo.attrValueList.forEach(item => {
        // 直接添加的属性 非响应式的
        // item.flag = false
        // 使用$set()方法添加响应式属性，增加一个flag属性用来切换input/span
        this.$set(item, 'flag', false)
      })
    },
    // 切换到查看模式
    toLookModel(row, $index) {
      // input切换成span前要先进行验证是否为空
      if (row.valueName.trim() === '') {
        this.$message.error('请输入正确的属性值')
        return
      }
      // 切换成span前要先检查是否为重复的属性值，要先筛选出除自身以外的item
      const isRepeat = this.attrInfo.attrValueList.filter((item, index) => index !== $index).some(item => {
        if (item.valueName === row.valueName) {
          this.$message.error('请勿输入重复的属性值')
          return true // some()方法有返回值，所以这里return并不能中止函数的向下执行
        }
      })
      if (isRepeat) {
        return false // 如果出现重复的属性值就通过some()返回的值判断中止
      }
      // 将input切换成span
      row.flag = false
    },
    // 切换到编辑模式
    toEditModel(row, index) {
      row.flag = true
      // 通过每个input不同的$index来区分不同的input
      // input与span的切换渲染有延迟，所以要使用$nextTick
      this.$nextTick(() => {
        // console.log(this.$refs[index])
        this.$refs[index].focus() // 对象属性为变量要使用[]
      })
    },
    // 泡泡确认框的确定按钮的回调，删除属性值
    deleteAttrValue(index) {
      // 根据$index删除相应的属性值
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 点击保存按钮向服务器发送请求
    async addOrUpdateAttr() {
      // 请求前要先对数据进行筛选
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        delete item.flag // 提交给服务器前要使用 关键字delete 删除我们自己加上去的flag属性
        return item.valueName !== '' // 删选出valueName不为空的元素
      })
      try {
        //  向服务器提交新的属性
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 提交成功后跳转到显示页面
        this.isShowTab = true
        //  提示成功信息
        this.$message.success('保存成功')
        // 重新获取显示页面的列表信息
        this.getData()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style>

</style>
