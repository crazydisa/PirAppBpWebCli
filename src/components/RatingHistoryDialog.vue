<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" 
            full-width persistent @hide="closeDialog">
    <q-card style="min-width: 800px; max-width: 1200px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          История рейтинга 
          <span v-if="player">{{ player.FullName || player.fullName }}</span>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section>
        <!-- Табы для разных представлений -->
        <q-tabs
          v-model="activeTab"
          align="left"
          class="bg-primary text-white shadow-2"
        >
          <q-tab name="chart" icon="timeline" label="График" />
          <q-tab name="table" icon="table_chart" label="Таблица" />
          <q-tab name="stats" icon="analytics" label="Статистика" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated class="q-mt-md">
          <!-- График -->
          <q-tab-panel name="chart">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner-gears size="50px" color="primary" />
              <div class="q-mt-md">Загрузка истории рейтинга...</div>
            </div>
            <div v-else-if="!historyData.length" class="text-center q-pa-lg">
              <q-icon name="info" size="50px" color="grey" />
              <div class="q-mt-md text-grey-7">Нет данных по истории рейтинга</div>
            </div>
            <RatingHistoryChart 
              v-else
              :history-data="historyData"
              :player-name="playerName"
            />
          </q-tab-panel>

          <!-- Таблица -->
          <q-tab-panel name="table">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner-gears size="50px" color="primary" />
            </div>
            <div v-else-if="!historyData.length" class="text-center q-pa-lg">
              <div class="text-grey-7">Нет данных по истории рейтинга</div>
            </div>
            <q-table
              v-else
              :rows="historyData"
              :columns="historyColumns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: 10 }"
              class="q-mt-sm"
            >
              <template v-slot:body-cell-changeDate="props">
                <q-td :props="props">
                  {{ formatDateTime(props.row.changeDate) }}
                </q-td>
              </template>

              <template v-slot:body-cell-ratingChange="props">
                <q-td :props="props">
                  <q-badge 
                    :color="props.row.ratingChange > 0 ? 'positive' : props.row.ratingChange < 0 ? 'negative' : 'grey'"
                    :label="props.row.ratingChange > 0 ? `+${props.row.ratingChange}` : props.row.ratingChange"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Статистика -->
          <q-tab-panel name="stats">
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner-gears size="50px" color="primary" />
            </div>
            <div v-else-if="!historyData.length" class="text-center q-pa-lg">
              <div class="text-grey-7">Нет данных для статистики</div>
            </div>
            <div v-else class="q-pa-md">
              <div class="text-h6 q-mb-md">Статистика изменений рейтинга</div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-3">
                  <q-card flat bordered>
                    <q-card-section class="text-center">
                      <div class="text-h6 text-grey-7">Всего изменений</div>
                      <div class="text-h3 text-primary">{{ historyData.length }}</div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-3">
                  <q-card flat bordered>
                    <q-card-section class="text-center">
                      <div class="text-h6 text-grey-7">Макс. рост</div>
                      <div class="text-h3 text-positive">+{{ maxIncrease }}</div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-3">
                  <q-card flat bordered>
                    <q-card-section class="text-center">
                      <div class="text-h6 text-grey-7">Макс. падение</div>
                      <div class="text-h3 text-negative">{{ maxDecrease }}</div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-3">
                  <q-card flat bordered>
                    <q-card-section class="text-center">
                      <div class="text-h6 text-grey-7">Среднее</div>
                      <div class="text-h3 text-amber">{{ averageChange.toFixed(1) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <div class="row q-mt-md">
                <div class="col-12">
                  <q-list bordered separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Период изменений</q-item-label>
                        <q-item-label caption>
                          {{ formatDate(firstChangeDate) }} — {{ formatDate(lastChangeDate) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Начальный рейтинг</q-item-label>
                        <q-item-label caption>{{ initialRating }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Текущий рейтинг</q-item-label>
                        <q-item-label caption>{{ currentRating }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Общее изменение</q-item-label>
                        <q-item-label caption>
                          <q-badge :color="totalChange > 0 ? 'positive' : totalChange < 0 ? 'negative' : 'grey'">
                            {{ totalChange > 0 ? '+' : '' }}{{ totalChange }}
                          </q-badge>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Закрыть" color="primary" @click="closeDialog" />
        <q-btn 
          v-if="historyData.length > 0"
          flat 
          label="Экспорт" 
          color="secondary" 
          icon="download"
          @click="exportHistory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { date } from 'quasar';
import { api } from '../services/api';
import RatingHistoryChart from './RatingHistoryChart.vue';

export default {
  name: 'RatingHistoryDialog',
  
  components: {
    RatingHistoryChart
  },
  
  props: {
    modelValue: {  // Используем modelValue вместо isOpen для v-model
      type: Boolean,
      default: false
    },
    player: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['update:modelValue', 'close'],
  
  setup(props, { emit }) {
    const loading = ref(false);
    const historyData = ref([]);
    const activeTab = ref('chart');
    
    const historyColumns = [
      { name: 'changeDate', label: 'Дата', field: 'changeDate', align: 'left', sortable: true },
      { name: 'oldRating', label: 'Было', field: 'oldRating', align: 'center' },
      { name: 'newRating', label: 'Стало', field: 'newRating', align: 'center' },
      { name: 'ratingChange', label: 'Изменение', field: 'ratingChange', align: 'center', sortable: true },
      { name: 'reason', label: 'Причина', field: 'changeReason', align: 'left' },
      { name: 'tournament', label: 'Турнир', field: 'tournamentName', align: 'left' }
    ];
    
    // Computed свойства
    const playerName = computed(() => {
      return props.player?.FullName || props.player?.fullName || props.player?.Name || 'Игрок';
    });
    
    const playerId = computed(() => {
      return props.player?.Id || props.player?.id || props.player?.PlayerId;
    });
    
    const maxIncrease = computed(() => {
      if (!historyData.value.length) return 0;
      const increases = historyData.value.map(h => h.ratingChange).filter(c => c > 0);
      return increases.length ? Math.max(...increases) : 0;
    });
    
    const maxDecrease = computed(() => {
      if (!historyData.value.length) return 0;
      const decreases = historyData.value.map(h => h.ratingChange).filter(c => c < 0);
      return decreases.length ? Math.min(...decreases) : 0;
    });
    
    const averageChange = computed(() => {
      if (!historyData.value.length) return 0;
      const changes = historyData.value.map(h => h.ratingChange);
      return changes.reduce((sum, change) => sum + change, 0) / changes.length;
    });
    
    const totalChange = computed(() => {
      if (!historyData.value.length) return 0;
      const first = historyData.value[0];
      const last = historyData.value[historyData.value.length - 1];
      return last.newRating - first.oldRating;
    });
    
    const initialRating = computed(() => {
      if (!historyData.value.length) return '—';
      return historyData.value[0].oldRating;
    });
    
    const currentRating = computed(() => {
      if (!historyData.value.length) return '—';
      return historyData.value[historyData.value.length - 1].newRating;
    });
    
    const firstChangeDate = computed(() => {
      if (!historyData.value.length) return null;
      return historyData.value[0].changeDate;
    });
    
    const lastChangeDate = computed(() => {
      if (!historyData.value.length) return null;
      return historyData.value[historyData.value.length - 1].changeDate;
    });
    
    // Методы
    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return date.formatDate(new Date(dateString), 'DD.MM.YYYY');
    };
    
    const formatDateTime = (dateString) => {
      if (!dateString) return '—';
      return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm');
    };
    
    const loadHistory = async () => {
      if (!playerId.value) return;
      
      loading.value = true;
      try {
        const response = await api.get(`/api/ratings/player/${playerId.value}/history`, {
          params: {
            limit: 100
          }
        });
        
        // Обрабатываем разные форматы ответа
        const responseData = response.data.Data || response.data.data || response.data;
        historyData.value = responseData.history || responseData.History || responseData || [];
        
        // Сортируем по дате (от старых к новым для графика)
        historyData.value.sort((a, b) => 
          new Date(a.changeDate || a.ChangeDate) - new Date(b.changeDate || b.ChangeDate)
        );
        
        // Нормализуем данные для единообразия
        historyData.value = historyData.value.map(item => ({
          id: item.id || item.Id,
          changeDate: item.changeDate || item.ChangeDate,
          oldRating: item.oldRating || item.OldRating,
          newRating: item.newRating || item.NewRating,
          ratingChange: item.ratingChange || item.RatingChange || 
                       (item.newRating || item.NewRating) - (item.oldRating || item.OldRating),
          changeReason: item.changeReason || item.ChangeReason || 'Турнир',
          tournamentName: item.tournamentName || item.TournamentName || '—'
        }));
        
      } catch (error) {
        console.error('Ошибка загрузки истории рейтинга:', error);
        historyData.value = [];
      } finally {
        loading.value = false;
      }
    };
    
    const closeDialog = () => {
      emit('update:modelValue', false);
      emit('close');
    };
    
    const exportHistory = () => {
      console.log('Экспорт истории рейтинга:', historyData.value);
      // Реализуйте экспорт в CSV/Excel
    };
    
    // Загружаем историю при открытии диалога
    watch(() => props.modelValue, (isOpen) => {
      if (isOpen && playerId.value) {
        loadHistory();
      } else {
        historyData.value = [];
      }
    });
    
    return {
      loading,
      historyData,
      activeTab,
      historyColumns,
      playerName,
      maxIncrease,
      maxDecrease,
      averageChange,
      totalChange,
      initialRating,
      currentRating,
      firstChangeDate,
      lastChangeDate,
      formatDate,
      formatDateTime,
      closeDialog,
      exportHistory
    };
  }
};
</script>