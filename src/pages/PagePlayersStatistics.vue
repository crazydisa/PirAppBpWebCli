<template>
    <q-page class="q-pa-md">
      <!-- Заголовок и фильтры -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <h4 class="text-h4 text-primary q-my-none">Статистика игроков</h4>
          <div class="text-subtitle1 text-grey-7">Аналитика и рейтинги игроков боулинга</div>
        </div>
        
        <div class="col-auto">
          <q-btn color="primary" icon="refresh" label="Обновить" @click="refreshData" />
        </div>
      </div>
  
      <!-- Фильтры -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Поиск -->
            <div class="col-12 col-md-4">
              <q-input
                v-model="filter.search"
                label="Поиск игрока"
                placeholder="Введите имя или регион"
                clearable
                dense
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            
            <!-- Фильтр по региону -->
            <div class="col-12 col-md-3">
              <q-select
                v-model="filter.region"
                :options="regions"
                label="Регион"
                clearable
                dense
                outlined
                emit-value
                map-options
              />
            </div>
            
            <!-- Фильтр по полу -->
            <div class="col-12 col-md-3">
              <q-select
                v-model="filter.gender"
                :options="genderOptions"
                label="Пол"
                clearable
                dense
                outlined
                emit-value
                map-options
              />
            </div>
            
            <!-- Количество записей -->
            <div class="col-12 col-md-2">
              <q-select
                v-model="filter.limit"
                :options="[50, 100, 200, 500]"
                label="Показывать"
                dense
                outlined
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
  
      <!-- Основная статистика -->
      <div class="row q-col-gutter-md">
        <!-- Карточки с общей статистикой -->
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Всего игроков</div>
              <div class="text-h2 text-primary">{{ stats.totalPlayers || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Средний рейтинг</div>
              <div class="text-h2 text-positive">{{ stats.averageRating || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Топ-10 игроков</div>
              <div class="text-h2 text-warning">{{ stats.top10Players || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Активных</div>
              <div class="text-h2 text-info">{{ stats.activePlayers || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <!-- Таблица игроков -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Рейтинг игроков</div>
        </q-card-section>
        
        <q-table
          :rows="players"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter.search"
          :pagination="pagination"
          @request="onRequest"
          class="sticky-header-table"
        >
          <!-- Заголовок таблицы с дополнительными действиями -->
          <template v-slot:top>
            <div class="row full-width items-center">
              <div class="col">
                <q-toggle
                  v-model="filter.onlyActive"
                  label="Только активные"
                  color="primary"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="file_download"
                  @click="exportToExcel"
                >
                  <q-tooltip>Экспорт в Excel</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="filter_list"
                  @click="showAdvancedFilters = !showAdvancedFilters"
                >
                  <q-tooltip>Дополнительные фильтры</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
  
          <!-- Дополнительные фильтры -->
          <template v-slot:body-top>
            <q-tr v-if="showAdvancedFilters">
              <q-td colspan="100%">
                <div class="row q-col-gutter-md q-pa-sm">
                  <div class="col-12 col-md-3">
                    <q-input
                      v-model.number="filter.minRating"
                      type="number"
                      label="Мин. рейтинг"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-input
                      v-model.number="filter.maxRating"
                      type="number"
                      label="Макс. рейтинг"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-input
                      v-model.number="filter.minTournaments"
                      type="number"
                      label="Мин. турниров"
                      dense
                      outlined
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-btn
                      color="primary"
                      label="Применить"
                      @click="applyAdvancedFilters"
                      dense
                    />
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
  
          <!-- Кастомизация ячеек -->
          <template v-slot:body-cell-place="props">
            <q-td :props="props">
              <q-badge
                :color="getPlaceColor(props.row.place)"
                class="q-px-sm q-py-xs"
              >
                {{ props.row.place }}
              </q-badge>
            </q-td>
          </template>
  
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-bold">{{ props.row.rating }}</div>
                  <div class="text-caption text-grey-6">
                    <q-icon name="trending_up" v-if="props.row.ratingChange > 0" />
                    <q-icon name="trending_down" v-else-if="props.row.ratingChange < 0" />
                    <span v-if="props.row.ratingChange !== 0">
                      {{ props.row.ratingChange > 0 ? '+' : '' }}{{ props.row.ratingChange }}
                    </span>
                  </div>
                </div>
                <div class="col-auto">
                  <q-circular-progress
                    v-if="props.row.ratingProgress"
                    :value="props.row.ratingProgress"
                    size="30px"
                    :thickness="0.2"
                    color="primary"
                    class="q-ml-xs"
                  >
                    {{ Math.round(props.row.ratingProgress) }}%
                  </q-circular-progress>
                </div>
              </div>
            </q-td>
          </template>
  
          <template v-slot:body-cell-player="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="40px"
                  class="q-mr-sm"
                  :color="props.row.gender === 'Male' ? 'blue' : 'pink'"
                  text-color="white"
                >
                  {{ props.row.fullName.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-weight-medium">{{ props.row.fullName }}</div>
                  <div class="text-caption text-grey-6">
                    <q-icon name="place" size="xs" />
                    {{ props.row.region || 'Не указан' }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>
  
          <template v-slot:body-cell-stats="props">
            <q-td :props="props">
              <div class="column">
                <div class="row items-center">
                  <q-icon name="emoji_events" size="16px" class="q-mr-xs" />
                  <span>{{ props.row.tournamentCount }} турниров</span>
                </div>
                <div class="row items-center">
                  <q-icon name="star" size="16px" class="q-mr-xs" />
                  <span>Среднее: {{ props.row.averageScore.toFixed(2) }}</span>
                </div>
              </div>
            </q-td>
          </template>
  
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="visibility"
                color="primary"
                @click="showPlayerDetails(props.row)"
              >
                <q-tooltip>Подробнее</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="timeline"
                color="secondary"
                @click="showRatingHistory(props.row)"
              >
                <q-tooltip>История рейтинга</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
  
      <!-- Графики статистики -->
      <div class="row q-col-gutter-md q-mt-md">
        <!-- График распределения рейтингов -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Распределение рейтингов</div>
            </q-card-section>
            <q-card-section>
              <div ref="ratingChart" style="height: 300px;"></div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Топ игроков по регионам -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Топ регионов по среднему рейтингу</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item
                  v-for="(region, index) in topRegions"
                  :key="index"
                  clickable
                  @click="filterByRegion(region.name)"
                >
                  <q-item-section avatar>
                    <q-badge :color="getRegionColor(index)" class="q-pa-sm">
                      {{ index + 1 }}
                    </q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ region.name }}</q-item-label>
                    <q-item-label caption>{{ region.playerCount }} игроков</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold">
                      {{ region.averageRating }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <!-- Диалог с детальной информацией -->
      <q-dialog v-model="showPlayerDialog" full-width>
        <PlayerDetailsDialog
          v-model="showPlayerDialog"
          :player="selectedPlayer"
        />
      </q-dialog>
  
      <!-- Диалог истории рейтинга -->
      <q-dialog v-model="showHistoryDialog" full-width>
        <RatingHistoryDialog
          :player="selectedPlayer"
          @close="showHistoryDialog = false"
        />
      </q-dialog>
    </q-page>
  </template>
  
  <script>
import { ref, onMounted, watch } from 'vue';
//import { useQuasar } from 'quasar';
import * as echarts from 'echarts';
import PlayerDetailsDialog from '../components/PlayerDetailsDialog.vue';
import RatingHistoryDialog from '../components/RatingHistoryDialog.vue';
import { api } from '../services/api';

export default {
  name: 'PlayersStatistics',
  components: {
    PlayerDetailsDialog,
    RatingHistoryDialog
  },
  
  setup() {
    //const $q = useQuasar();
    const loading = ref(false);
    const players = ref([]);
    const stats = ref({});
    const regions = ref([]);
    const topRegions = ref([]);
    const showPlayerDialog = ref(false);
    const showHistoryDialog = ref(false);
    const showAdvancedFilters = ref(false);
    const selectedPlayer = ref(null);
    const ratingChart = ref(null);
    let chartInstance = null;

    // Фильтры
    const filter = ref({
      search: '',
      region: null,
      gender: null,
      limit: 100,
      onlyActive: true,
      minRating: null,
      maxRating: null,
      minTournaments: null
    });

    // Настройки пагинации
    const pagination = ref({
      sortBy: 'rating',
      descending: true,
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0
    });

    // Колонки таблицы
    const columns = [
      {
        name: 'place',
        label: '#',
        field: 'place',
        align: 'center',
        sortable: true,
        width: '60px'
      },
      {
        name: 'player',
        label: 'Игрок',
        field: 'fullName',
        align: 'left',
        sortable: true
      },
      {
        name: 'rating',
        label: 'Рейтинг',
        field: 'rating',
        align: 'center',
        sortable: true,
        width: '120px'
      },
      {
        name: 'peakRating',
        label: 'Пиковый',
        field: 'peakRating',
        align: 'center',
        sortable: true,
        width: '100px'
      },
      {
        name: 'stats',
        label: 'Статистика',
        field: 'tournamentCount',
        align: 'left',
        sortable: true
      },
      {
        name: 'region',
        label: 'Регион',
        field: 'region',
        align: 'left',
        sortable: true
      },
      {
        name: 'gender',
        label: 'Пол',
        field: 'gender',
        align: 'center',
        sortable: true,
        width: '80px'
      },
      {
        name: 'actions',
        label: 'Действия',
        align: 'center',
        width: '100px'
      }
    ];

    // Опции для фильтра по полу
    const genderOptions = [
      { label: 'Мужской', value: 'Male' },
      { label: 'Женский', value: 'Female' },
      { label: 'Не указан', value: 'Unknown' }
    ];

    // Загрузка данных
    const loadData = async () => {
      loading.value = true;
      try {
        // Загружаем игроков
        const response = await api.get('/api/ratings/global', {
          params: {
            top: filter.value.limit,
            region: filter.value.region,
            gender: filter.value.gender,
            includeInactive: !filter.value.onlyActive
          }
        });
        
        players.value = response.data.data.map((player, index) => ({
          ...player,
          place: index + 1,
          ratingProgress: Math.min(100, (player.rating / 2500) * 100),
          ratingChange: Math.floor(Math.random() * 21) - 10 // Для демо
        }));
        
        // Загружаем статистику
        const statsResponse = await api.get('/api/ratings/statistics');
        stats.value = statsResponse.data.data;
        
        // Загружаем регионы
        const regionsResponse = await api.get('/api/regions');
        regions.value = regionsResponse.data.data;
        
        // Загружаем топ регионов
        const topRegionsResponse = await api.get('/api/statistics/top-regions');
        topRegions.value = topRegionsResponse.data.data;
        
        // Инициализируем график
        initChart();
        
      } catch (error) {
        console.log("er loading")
      } finally {
        loading.value = false;
      }
    };

    // Инициализация графика
    const initChart = () => {
      if (!ratingChart.value) return;
      
      if (chartInstance) {
        chartInstance.dispose();
      }
      
      chartInstance = echarts.init(ratingChart.value);
      
      // Данные для графика
      const data = [
        { value: stats.value.ratingDistribution?.['<1300'] || 0, name: '<1300' },
        { value: stats.value.ratingDistribution?.['1300-1499'] || 0, name: '1300-1499' },
        { value: stats.value.ratingDistribution?.['1500-1699'] || 0, name: '1500-1699' },
        { value: stats.value.ratingDistribution?.['1700-1899'] || 0, name: '1700-1899' },
        { value: stats.value.ratingDistribution?.['1900-2099'] || 0, name: '1900-2099' },
        { value: stats.value.ratingDistribution?.['2100+'] || 0, name: '2100+' }
      ];
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Распределение рейтингов',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      
      chartInstance.setOption(option);
      
      // Адаптация при ресайзе
      window.addEventListener('resize', () => {
        chartInstance.resize();
      });
    };

    // Вспомогательные методы
    const getPlaceColor = (place) => {
      if (place === 1) return 'gold';
      if (place <= 3) return 'silver';
      if (place <= 10) return 'bronze';
      return 'grey';
    };

    const getRegionColor = (index) => {
      const colors = ['primary', 'secondary', 'accent', 'positive', 'warning'];
      return colors[index % colors.length];
    };

    const showPlayerDetails = (player) => {
      selectedPlayer.value = player;
      showPlayerDialog.value = true;
    };

    const showRatingHistory = (player) => {
      selectedPlayer.value = player;
      showHistoryDialog.value = true;
    };

    const filterByRegion = (region) => {
      filter.value.region = region;
      loadData();
    };

    const applyAdvancedFilters = () => {
      loadData();
    };

    const refreshData = () => {
      loadData();
      
    };

    

    const onRequest = (props) => {
      pagination.value = props.pagination;
      loadData();
    };

    // Наблюдатели
    watch(() => filter.value.limit, loadData);
    watch(() => filter.value.onlyActive, loadData);

    // Хуки жизненного цикла
    onMounted(() => {
      loadData();
    });

    return {
      loading,
      players,
      stats,
      regions,
      topRegions,
      filter,
      pagination,
      columns,
      genderOptions,
      showPlayerDialog,
      showHistoryDialog,
      showAdvancedFilters,
      selectedPlayer,
      ratingChart,
      getPlaceColor,
      getRegionColor,
      showPlayerDetails,
      showRatingHistory,
      filterByRegion,
      applyAdvancedFilters,
      refreshData,
      //exportToExcel,
      onRequest
    };
  }
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.sticky-header-table {
  height: 600px;
}

/* Анимация загрузки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>