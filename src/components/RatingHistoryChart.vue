<template>
  <div>
    <div v-if="!historyData || historyData.length === 0" class="text-center q-pa-lg">
      <q-icon name="show_chart" size="60px" color="grey" />
      <div class="q-mt-md text-grey-7">Нет данных для графика</div>
    </div>
    <div v-else>
      <div ref="chart" style="height: 400px; width: 100%;"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'RatingHistoryChart',
  
  props: {
    historyData: {
      type: Array,
      default: () => []
    },
    playerName: {
      type: String,
      default: 'Игрок'
    }
  },
  
  setup(props) {
    const chart = ref(null);
    let chartInstance = null;
    
    // Функция для инициализации графика
    const initChart = () => {
      if (!chart.value || !props.historyData || props.historyData.length === 0) {
        return;
      }
      
      // Уничтожаем старый экземпляр, если есть
      if (chartInstance) {
        chartInstance.dispose();
      }
      
      // Создаем новый экземпляр
      chartInstance = echarts.init(chart.value);
      
      // Подготавливаем данные
      const dates = props.historyData.map(h => {
        const date = new Date(h.changeDate);
        return date.toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit',
          year: 'numeric'
        });
      });
      
      const ratings = props.historyData.map(h => h.newRating);
      //const changes = props.historyData.map(h => h.ratingChange);
      
      // Рассчитываем минимальное и максимальное значение для оси Y
      const minRating = Math.min(...ratings) - 50;
      const maxRating = Math.max(...ratings) + 50;
      
      const option = {
        title: {
          text: `История рейтинга: ${props.playerName}`,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const dataIndex = params[0].dataIndex;
            const data = props.historyData[dataIndex];
            const date = new Date(data.changeDate).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const change = data.ratingChange;
            const changeText = change > 0 ? 
              `<span style="color:#4CAF50">+${change}</span>` : 
              change < 0 ? 
              `<span style="color:#F44336">${change}</span>` : 
              `<span style="color:#9E9E9E">${change}</span>`;
            
            return `
              <div style="font-weight: bold; margin-bottom: 5px;">${date}</div>
              <div>Было: <b>${data.oldRating}</b></div>
              <div>Стало: <b>${data.newRating}</b></div>
              <div>Изменение: ${changeText}</div>
              ${data.tournamentName && data.tournamentName !== '—' ? 
                `<div>Турнир: ${data.tournamentName}</div>` : ''}
            `;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45,
            interval: Math.max(1, Math.floor(dates.length / 10))
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Рейтинг',
          min: Math.max(0, minRating),
          max: maxRating,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: 'Рейтинг',
            type: 'line',
            data: ratings,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#1976D2'
            },
            itemStyle: {
              color: '#1976D2',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(25, 118, 210, 0.3)' },
                { offset: 1, color: 'rgba(25, 118, 210, 0.05)' }
              ])
            },
            markPoint: {
              data: [
                { type: 'max', name: 'Максимум', symbolSize: 50 },
                { type: 'min', name: 'Минимум', symbolSize: 50 }
              ],
              label: {
                color: '#fff',
                fontSize: 12,
                fontWeight: 'bold'
              }
            },
            markLine: {
              data: [
                { 
                  type: 'average', 
                  name: 'Средний',
                  lineStyle: {
                    type: 'dashed',
                    color: '#FF9800'
                  },
                  label: {
                    position: 'end',
                    formatter: 'Средний: {c}'
                  }
                }
              ]
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            minValueSpan: 10
          },
          {
            show: true,
            type: 'slider',
            bottom: '1%',
            start: 0,
            end: 100,
            minValueSpan: 10
          }
        ]
      };
      
      // Устанавливаем опции
      chartInstance.setOption(option);
      
      // Обработчик ресайза
      const handleResize = () => {
        chartInstance.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Сохраняем обработчик для удаления
      chartInstance.__resizeHandler = handleResize;
    };
    
    // Инициализируем график при монтировании
    onMounted(() => {
      nextTick(() => {
        initChart();
      });
    });
    
    // Следим за изменением данных
    watch(() => props.historyData, () => {
      nextTick(() => {
        initChart();
      });
    }, { deep: true });
    
    // Очищаем при уничтожении компонента
    onUnmounted(() => {
      if (chartInstance) {
        // Удаляем обработчик ресайза
        if (chartInstance.__resizeHandler) {
          window.removeEventListener('resize', chartInstance.__resizeHandler);
        }
        // Уничтожаем экземпляр
        chartInstance.dispose();
        chartInstance = null;
      }
    });
    
    return { 
      chart
    };
  }
};
</script>

<style scoped>
/* Стили для адаптивности */
@media (max-width: 768px) {
  div[ref="chart"] {
    height: 300px;
  }
}
</style>