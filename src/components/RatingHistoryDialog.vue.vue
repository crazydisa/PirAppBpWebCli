<template>
    <div>
      <div ref="chart" style="height: 400px;"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
  
  export default {
    name: 'RatingHistoryChart',
    props: {
      playerId: Number,
      historyData: Array // Добавляем пропс для данных
    },
    
    setup(props) {
      const chart = ref(null);
      let chartInstance = null;
      
      // Функция для инициализации графика
      const initChart = (historyData) => {
        if (!chart.value || !historyData || historyData.length === 0) return;
        
        if (chartInstance) {
          chartInstance.dispose();
        }
        
        chartInstance = echarts.init(chart.value);
        
        const dates = historyData.map(h => 
          new Date(h.changeDate).toLocaleDateString('ru-RU')
        );
        const ratings = historyData.map(h => h.newRating);
        
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>Рейтинг: {c}'
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: 'Рейтинг'
          },
          series: [{
            data: ratings,
            type: 'line',
            smooth: true,
            areaStyle: {},
            markLine: {
              data: [
                { type: 'average', name: 'Средний' }
              ]
            }
          }]
        };
        
        chartInstance.setOption(option);
      };
      
      // Обработчик ресайза
      const handleResize = () => {
        if (chartInstance) {
          chartInstance.resize();
        }
      };
      
      onMounted(() => {
        // Инициализируем график при монтировании
        initChart(props.historyData);
        
        // Добавляем обработчик ресайза
        window.addEventListener('resize', handleResize);
      });
      
      // Следим за изменением данных
      watch(() => props.historyData, (newData) => {
        initChart(newData);
      });
      
      onUnmounted(() => {
        // Удаляем обработчик ресайза
        window.removeEventListener('resize', handleResize);
        
        // Уничтожаем экземпляр графика
        if (chartInstance) {
          chartInstance.dispose();
          chartInstance = null;
        }
      });
      
      return { 
        chart,
        initChart // Экспортируем функцию, чтобы она использовалась
      };
    }
  };
  </script>