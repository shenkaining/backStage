<template>
  <el-card>
    <div slot="header" class="header">
      <span style="color:#222">销售额类别占比</span>
      <div class="radio">
        <el-radio-group v-model="radio" size="small">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
    </div>
    <div ref="pie" class="pie" />
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      radio: '',
      pieTitle: {
        name: '搜索引擎',
        value: 300
      },
      pieCharts: null
    }
  },
  mounted() {
    this.pieCharts = echarts.init(this.$refs.pie)
    /** @type EChartsOption */
    this.pieCharts.setOption({
      title: {
        text: this.pieTitle.name,
        subtext: this.pieTitle.value,
        left: 'center',
        top: 120,
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        },
        subtextStyle: {
          fontSize: 30
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          avoidLabelOverlap: false,
          radius: ['40%', '75%'],
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          },
          data: [
            { value: 300, name: '视频广告' },
            { value: 484, name: '联盟广告' },
            { value: 580, name: '邮件营销' },
            { value: 735, name: '直接访问' },
            { value: 1048, name: '搜索引擎' }
          ]
        }
      ]
    })
    // 给echas图表绑定鼠标事件，将参数传入methods中的函数
    this.pieCharts.on('mouseOver', (params) => {
      this.pieEvent(params)
    })
  },
  methods: {
    pieEvent(params) {
      // 接收echarts图表事件传递过来的参数，包含了图表的一系列数据
      this.pieCharts.setOption({
        title: {
          text: params.data.name,
          subtext: params.data.value
        }
      })
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.radio {
  position: absolute;
  right: 0;
  top: -5px;
}
.pie {
  width: 100%;
  height: 300px;
}
</style>
