<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <LeftCard />
      </el-col>
      <el-col :span="12">
        <RightCard />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftCard from './left'
import RightCard from './right'
export default {
  components: {
    LeftCard,
    RightCard
  }
}
</script>

<style>

</style>
