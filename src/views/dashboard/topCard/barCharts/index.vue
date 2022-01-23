<template>
  <div ref="barCharts" class="barCharts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    const barCharts = echarts.init(this.$refs.barCharts)
    /** @type EChartsOption */
    barCharts.setOption({
      tooltip: {},
      xAxis: {
        show: false,
        type: 'category'
        // boundaryGap: false // false代表x轴从0开始，true代表离0有一定距离
      },
      yAxis: {
        show: false,
        max: 70 // 最大显示的值
      },
      grid: { // 图表距离周围的距离
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      series: [
        {
          type: 'bar',
          data: [10, 60, 22, 40, 11, 50, 32, 8, 27]
        }
      ]
    })
    window.onresize = function() {
      barCharts.resize()
    }
  }
}
</script>

<style>
.barCharts{
  width: 100%;
  height: 100px;
}
</style>
