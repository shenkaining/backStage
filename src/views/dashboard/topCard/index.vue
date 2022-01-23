<template>

  <el-row :gutter="10">
    <el-col :span="6">
      <Detail title="总销售额" number="￥126560">
        <template #charts>
          <div style="padding-bottom:10px">
            <span>周同比</span><span style="padding-left:15px">56.67%</span><i class="el-icon-caret-top" style="color:#cf260f;padding-left:5px" />
            <span style="padding-left:15px">日同比</span><span style="padding-left:15px">19.16%</span><i class="el-icon-caret-bottom" style="color:#1ef72e;padding-left:5px" />
          </div>
        </template>
        <template #footer>
          <span>日销售额￥12423</span>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="访问量" number="88460">
        <template #charts>
          <LineCharts />
        </template>
        <template #footer>
          <span>日访问量 1234</span>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="支付笔数" number="88460">
        <template #charts>
          <BarCharts />
        </template>
        <template #footer>
          <span>转化率 65%</span>
        </template>
      </Detail>
    </el-col>
    <el-col :span="6">
      <Detail title="运营活动效果" number="78%">
        <template #charts>
          <ProgressCharts />
        </template>
        <template #footer>
          <span>周同比</span><span style="padding-left:15px">12%</span><i class="el-icon-caret-top" style="color:#cf260f;padding-left:5px" />
          <span style="padding-left:15px">日同比</span><span style="padding-left:15px">11%</span><i class="el-icon-caret-bottom" style="color:#1ef72e;padding-left:5px" />
        </template>
      </Detail>
    </el-col>
  </el-row>

</template>

<script>
import Detail from './detail'
import LineCharts from './lineCharts'
import BarCharts from './barCharts'
import ProgressCharts from './progressCharts'
export default {
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts
  }
}
</script>

<style>

</style>
