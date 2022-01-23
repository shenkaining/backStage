<template>
  <div class="container-category">
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="categoryForm.category1Id" :disabled="show" placeholder="请选择" @change="changeC1">
          <el-option v-for="c1 in category1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryForm.category2Id" :disabled="show" placeholder="请选择" @change="changeC2">
          <el-option v-for="c2 in category2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryForm.category3Id" :disabled="show" placeholder="请选择" @change="changeC3">
          <el-option v-for="c3 in category3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      categoryForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      category1: [],
      category2: [],
      category3: []
    }
  },
  mounted() {
    this.getCategoryList1()
  },
  methods: {
    // 获取一级分类的列表信息
    async getCategoryList1() {
      const res = await this.$API.attr.reqCategoryList1()
      if (res.code === 200) {
        this.category1 = res.data
      }
    },
    // 当一级分类改变了才能获取相应的二级分类的信息
    async changeC1() {
      // 每次一级分类改变，二级、三级分类就应该清空
      this.category2 = []
      this.categoryForm.category2Id = ''
      this.category3 = []
      this.categoryForm.category3Id = ''
      const res = await this.$API.attr.reqCategoryList2(this.categoryForm.category1Id)
      if (res.code === 200) {
        this.category2 = res.data
      }
    },
    // 当二级分类发生改变才能获取相应的三级分类信息
    async changeC2() {
      // 每次二级分类改变，三级分类就应该清空
      this.category3 = []
      this.categoryForm.category3Id = ''
      const res = await this.$API.attr.reqCategoryList3(this.categoryForm.category2Id)
      if (res.code === 200) {
        this.category3 = res.data
      }
    },
    // 当三级分类改变时就应该获取具体的产品信息了
    changeC3() {
      this.$emit('sendCategoryId', this.categoryForm)
    }
  }
}
</script>

<style>

</style>
