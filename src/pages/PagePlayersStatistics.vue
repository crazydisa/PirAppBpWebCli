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
                option-label="Title"      
                option-value="Title"        
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
              <div class="text-h2 text-primary">{{ stats.TotalPlayers || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Средний рейтинг</div>
              <div class="text-h2 text-positive">{{ stats.AverageRating || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Топ-10 игроков</div>
              <div class="text-h2 text-warning">{{ stats.Top10Players || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-3">
          <q-card class="stat-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-grey-7">Активных</div>
              <div class="text-h2 text-info">{{ stats.ActivePlayers || 0 }}</div>
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
          row-key="Id"
          :loading="loading"
          :filter="filter.search"
          v-model:pagination="pagination"
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
                :color="getPlaceColor(props.row.Place)"
                class="q-px-sm q-py-xs"
              >
                {{ props.row.Place }}
              </q-badge>
            </q-td>
          </template>
  
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-bold">{{ props.row.Rating }}</div>
                  <div class="text-caption text-grey-6">
                    <q-icon name="trending_up" v-if="props.row.RatingChange > 0" />
                    <q-icon name="trending_down" v-else-if="props.row.RatingChange < 0" />
                    <span v-if="props.row.RatingChange !== 0">
                      {{ props.row.RatingChange > 0 ? '+' : '' }}{{ props.row.RatingChange }}
                    </span>
                  </div>
                </div>
                <div class="col-auto">
                  <q-circular-progress
                    v-if="props.row.RatingProgress"
                    :value="props.row.RatingProgress"
                    size="30px"
                    :thickness="0.2"
                    color="primary"
                    class="q-ml-xs"
                  >
                    {{ Math.round(props.row.RatingProgress) }}%
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
                  :color="props.row.Gender === 'Male' ? 'blue' : 'pink'"
                  text-color="white"
                >
                  {{ props.row.FullName.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-weight-medium">{{ props.row.FullName }}</div>
                  <div class="text-caption text-grey-6">
                    <q-icon name="place" size="xs" />
                    {{ props.row.Region || 'Не указан' }}
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
                  <span>{{ props.row.TournamentCount }} турниров</span>
                </div>
                <div class="row items-center">
                  <q-icon name="star" size="16px" class="q-mr-xs" />
                  <span>Среднее: {{ props.row.AverageScore.toFixed(2) }}</span>
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
                  @click="filterByRegion(region.RegionName)"
                >
                  <q-item-section avatar>
                    <q-badge :color="getRegionColor(index)" class="q-pa-sm">
                      {{ index + 1 }}
                    </q-badge>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ region.RegionName }}</q-item-label>
                    <q-item-label caption>{{ region.PlayerCount }} игроков</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold">
                      {{ region.AverageRating }}
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
  
      <!-- Диалог истории рейтинга
      <q-dialog v-model="showHistoryDialog" full-width>
        <RatingHistoryDialog
          :player="selectedPlayer"
          @close="showHistoryDialog = false"
        />
      </q-dialog> -->
      <!-- Кнопка для открытия истории рейтинга -->
    <q-btn
      label="История рейтинга"
      icon="timeline"
      color="info"
      @click="openRatingHistory(player)"
    />
    
    <!-- Диалог истории рейтинга -->
  <RatingHistoryDialog
    v-model="showHistoryDialog"
    :player="selectedPlayer"
    @close="showHistoryDialog = false"
  />
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
      rowsNumber: 0,
    });

    // Колонки таблицы
    const columns = [
      {
        name: 'place',
        label: '#',
        field: 'Place',
        align: 'center',
        sortable: true,
        width: '60px'
      },
      {
        name: 'player',
        label: 'Игрок',
        field: 'FullName',
        align: 'left',
        sortable: true
      },
      {
        name: 'rating',
        label: 'Рейтинг',
        field: 'Rating',
        align: 'center',
        sortable: true,
        width: '120px'
      },
      {
        name: 'peakRating',
        label: 'Пиковый',
        field: 'PeakRating',
        align: 'center',
        sortable: true,
        width: '100px'
      },
      {
        name: 'stats',
        label: 'Статистика',
        field: 'TournamentCount',
        align: 'left',
        sortable: true
      },
      {
        name: 'region',
        label: 'Регион',
        field: 'Region',
        align: 'left',
        sortable: true
      },
      {
        name: 'gender',
        label: 'Пол',
        field: 'Gender',
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
            page: pagination.value.page,
            pageSize: pagination.value.rowsPerPage,
            sortBy: pagination.value.sortBy,
            search: filter.value.search,
            descending: pagination.value.descending,
            top: filter.value.limit,
            region: filter.value.region,
            gender: filter.value.gender,
            includeInactive: !filter.value.onlyActive
          }
        });
        
        players.value = response.data.Data.Players.map((player, /*index*/) => ({
          ...player,
          //Place: index + 1,
          RatingProgress: Math.min(100, (player.Rating / 2500) * 100),
          RatingChange: Math.floor(Math.random() * 21) - 10 // Для демо
        }));
        
        // Загружаем статистику
        const statsResponse = await api.get('/api/ratings/statistics');
        stats.value = statsResponse.data.Data;
        
        // Загружаем регионы
        const regionsResponse = await api.get('/api/regions');
        console.log("regionsResponse ",regionsResponse)
        regions.value = regionsResponse.data.Items;
        
        // Загружаем топ регионов
        const topRegionsResponse = await api.get('/api/statistics/top-regions');
        topRegions.value = topRegionsResponse.data.Data;
        
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
        { value: stats.value.RatingDistribution?.['<1300'] || 0, name: '<1300' },
        { value: stats.value.RatingDistribution?.['1300-1499'] || 0, name: '1300-1499' },
        { value: stats.value.RatingDistribution?.['1500-1699'] || 0, name: '1500-1699' },
        { value: stats.value.RatingDistribution?.['1700-1899'] || 0, name: '1700-1899' },
        { value: stats.value.RatingDistribution?.['1900-2099'] || 0, name: '1900-2099' },
        { value: stats.value.RatingDistribution?.['2100+'] || 0, name: '2100+' }
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
    const openRatingHistory = (player) => {
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
      //pagination.value = props.pagination;
      console.log("Событие таблицы:", props);
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
       // Клонируем объект, чтобы обновить все свойства
      pagination.value = {
        ...pagination.value,
        page,
        rowsPerPage,
        sortBy,
        descending
      };
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
      openRatingHistory,
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