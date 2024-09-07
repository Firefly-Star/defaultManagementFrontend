<template>
    <div>
        <!-- 年份选择 -->
        <div class="year-selector">
            <el-date-picker
                v-model="selectedYear"
                type="year"
                placeholder="选择年份"
                @change="fetchStatistics"
            />
        </div>

        <!-- 图表展示 -->
        <div class="chart-container">
            <!-- 行业统计饼图 -->
            <div class="chart" ref="industryChart"></div>
            <!-- 区域统计饼图 -->
            <div class="chart" ref="areaChart"></div>
        </div>
        <div class="chart-container">
            <!-- 总违约统计折线图 -->
            <div class="chart" ref="totalClaimChart"></div>
            <!-- 总复苏统计折线图 -->
            <div class="chart" ref="rebirthClaimChart"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart, PieChart, BarChart } from 'echarts/charts'; 
import { CanvasRenderer } from 'echarts/renderers'; 

// 注册所需的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    PieChart,
    BarChart, // 注册 BarChart
    CanvasRenderer // 如果需要使用 CanvasRenderer
]);


export default{

    name : 'StaticsComponent',
    data() {
        return {
            selectedYear: new Date('2024-01-01'),  // 默认选择当前年份
            industryData: [],
            areaData: [],
            totalClaimData: [],
            rebirthClaimData: [],
        }
    },
    methods : {
        async fetchStatistics() {
            console.log('useded');
            const adminToken = localStorage.getItem('adminToken'); // 获取 token

            try {
                // 获取行业统计数据
                const industryResponse = await fetch('http://localhost:8080/api/admin/analysis/industry', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'adminToken': adminToken
                    },
                    body: JSON.stringify(this.selectedYear.getFullYear())
                });
                const industryData = await industryResponse.json();
                this.industryData = industryData.data;
                

                // 获取区域统计数据
                const areaResponse = await fetch('http://localhost:8080/api/admin/analysis/area', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'adminToken': adminToken
                    },
                    body: JSON.stringify(this.selectedYear.getFullYear())
                });
                const areaData = await areaResponse.json();
                this.areaData = areaData.data;

                // 获取总统计数据
                const totalResponse = await fetch('http://localhost:8080/api/admin/analysis/total', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'adminToken': adminToken
                    }
                });
                const totalClaimData = await totalResponse.json();
                this.totalClaimData = totalClaimData.data;

                console.log(totalClaimData);

                // 重新绘制图表
                this.drawIndustryChart();
                this.drawAreaChart();
                this.drawTotalClaimChart();
                this.drawRebirthClaimChart();

            } catch (error) {
                console.error('请求统计数据失败: ' + error);
            }
        },
        
        // 绘制行业饼图
        drawIndustryChart() {
            const chart = echarts.init(this.$refs.industryChart);
            const option = {
                title: { text: '行业违约统计' },
                tooltip: { trigger: 'item' },
                series: [{
                    type: 'pie',
                    data: this.industryData.map(item => ({
                        name: item.industry,
                        value: item.totalDefaultClaim
                    }))
                }]
            };
            chart.setOption(option);
        },

        // 绘制区域饼图
        drawAreaChart() {
            const chart = echarts.init(this.$refs.areaChart);
            const option = {
                title: { text: '区域违约统计' },
                tooltip: { trigger: 'item' },
                series: [{
                    type: 'pie',
                    data: this.areaData.map(item => ({
                        name: item.area,
                        value: item.totalDefaultClaim
                    }))
                }]
            };
            chart.setOption(option);
        },

        // 绘制总违约柱状图
        drawTotalClaimChart() {
            const sortedData = this.totalClaimData.slice().sort((a, b) => a.year - b.year);
            const newChart = echarts.init(this.$refs.totalClaimChart);
            const option = {
                title: { text: '总违约统计' },
                xAxis: { type: 'category', data: sortedData.map(item => item.year) },
                yAxis: { type: 'value' },
                series: [{
                    type: 'bar', // 更改为柱状图
                    data: this.totalClaimData.map(item => item.totalDefaultClaims)
                }]
            };
            newChart.setOption(option);
        },

        // 绘制总复苏柱状图
        drawRebirthClaimChart() {
            const sortedData = this.totalClaimData.slice().sort((a, b) => a.year - b.year);
            const chart = echarts.init(this.$refs.rebirthClaimChart);
            const option = {
                title: { text: '总复苏统计' },
                xAxis: { 
                    type: 'category', 
                    data: sortedData.map(item => item.year) 
                },
                yAxis: { 
                    type: 'value' 
                },
                series: [{
                    type: 'bar', // 改为柱状图
                    data: this.totalClaimData.map(item => item.totalRebirthClaims)
                }]
            };
            chart.setOption(option);
        },
    },
    mounted() {
        this.fetchStatistics();
    }
}
</script>

<style scoped>
.chart-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.chart {
    width: 45%;
    height: 400px;
}

.year-selector {
    text-align: center;
    margin-top: 20px;
}
</style>