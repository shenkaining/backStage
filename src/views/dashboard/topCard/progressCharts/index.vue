<template>
  <div ref="progressCharts" class="progressCharts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    const progressCharts = echarts.init(this.$refs.progressCharts)
    /** @type EChartsOption */
    progressCharts.setOption({
      tooltip: {},
      xAxis: {
        max: 100,
        show: false
        // boundaryGap: false // false代表x轴从0开始，true代表离0有一定距离
      },
      yAxis: {
        show: false,
        type: 'category'
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
          data: [78],
          showBackground: true,
          barWidth: 15, // 柱条的宽度
          color: '#99ce31',
          label: { // 控制图表上是否显示标签
            show: true,
            formatter: '|', // 自定义图表标签内容
            position: 'right', // 标签显示的位置
            fontSize: 16, // 标签字体大小
            color: '#99ce31' // 标签的颜色
          }
        }
      ]
    })
    // echarts根据窗口自适应
    window.onresize = function() {
      progressCharts.resize()
    }
  }
}

</script>

<style>
.progressCharts{
  width: 100%;
  height: 100px;
}
</style>
