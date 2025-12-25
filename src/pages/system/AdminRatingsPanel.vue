<template>
  <q-page class="q-pa-md">
    <!-- Заголовок -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <h4 class="text-h4 text-primary q-my-none">Управление рейтингами</h4>
        <div class="text-subtitle1 text-grey-7">
          Администрирование системы рейтингов Эло
        </div>
      </div>
    </div>

    <!-- Карточки статистики -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="people" size="40px" color="primary" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Игроков с рейтингом</div>
            <div class="text-h3 text-primary">{{ stats.playersWithRating || 0 }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="emoji_events" size="40px" color="positive" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Обработано турниров</div>
            <div class="text-h3 text-positive">{{ stats.tournamentsProcessed || 0 }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="update" size="40px" color="warning" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Последнее обновление</div>
            <div class="text-h6 text-warning">
              {{ formatDate(stats.lastUpdated) || 'Никогда' }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="history" size="40px" color="info" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Историй рейтингов</div>
            <div class="text-h3 text-info">{{ stats.totalRatingChanges || 0 }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Основные действия -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Основные операции</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <!-- Обновить рейтинги после турнира -->
          <div class="col-12 col-md-6">
            <q-card bordered>
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="tour" color="primary" class="q-mr-sm" />
                  Обновить рейтинги турнира
                </div>
                <div class="text-caption text-grey-7 q-mb-md">
                  Рассчитать изменения рейтингов для конкретного турнира
                </div>

                <q-select
                  v-model="selectedTournament"
                  :options="tournaments"
                  label="Выберите турнир"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  dense
                  outlined
                  :loading="loadingTournaments"
                  class="q-mb-md"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption>
                          {{ formatDate(scope.opt.startDate) }} • {{ scope.opt.city }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="scope.opt.ratingsUpdated">
                        <q-badge color="positive" rounded>Обработан</q-badge>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <q-btn
                      color="primary"
                      label="Обновить рейтинги"
                      icon="calculate"
                      :loading="updatingTournament"
                      :disable="!selectedTournament"
                      @click="updateTournamentRatings"
                      class="full-width"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      flat
                      round
                      icon="refresh"
                      @click="loadTournaments"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Полный перерасчет -->
          <div class="col-12 col-md-6">
            <q-card bordered>
              <q-card-section>
                <div class="text-h6">
                  <q-icon name="restart_alt" color="warning" class="q-mr-sm" />
                  Полный перерасчет
                </div>
                <div class="text-caption text-grey-7 q-mb-md">
                  Пересчитать ВСЕ рейтинги с нуля. Осторожно, операция может занять много времени!
                </div>

                <q-list bordered>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Будет удалено:</q-item-label>
                      <q-item-label caption>
                        Все текущие рейтинги и история изменений
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Будет пересчитано:</q-item-label>
                      <q-item-label caption>
                        Все турниры в хронологическом порядке
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Время выполнения:</q-item-label>
                      <q-item-label caption>
                        Зависит от количества турниров (≈1-10 минут)
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-dialog v-model="confirmRecalculation" persistent>
                  <q-card style="min-width: 350px">
                    <q-card-section>
                      <div class="text-h6">Подтверждение</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <div class="text-body1 q-mb-md">
                        Вы уверены, что хотите выполнить полный перерасчет всех рейтингов?
                      </div>
                      <div class="text-negative text-weight-medium">
                        ⚠️ Это действие нельзя отменить!
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat label="Отмена" color="primary" v-close-popup />
                      <q-btn 
                        label="Выполнить перерасчет" 
                        color="negative" 
                        @click="recalculateAllRatings" 
                        v-close-popup
                        :loading="recalculatingAll"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-btn
                  color="warning"
                  label="Запустить полный перерасчет"
                  icon="warning"
                  @click="confirmRecalculation = true"
                  :loading="recalculatingAll"
                  class="full-width q-mt-md"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Список последних обработанных турниров -->
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">История обновлений</div>
            <div class="text-caption text-grey-7">
              Последние 10 обработанных турниров
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              flat
              round
              icon="refresh"
              @click="loadRecentHistory"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-table
          :rows="recentHistory"
          :columns="historyColumns"
          row-key="id"
          :loading="loadingHistory"
          flat
          bordered
        >
          <template v-slot:body-cell-tournament="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.tournamentName }}</div>
              <div class="text-caption text-grey-7">
                {{ formatDate(props.row.startDate) }}
                <span v-if="props.row.city"> • {{ props.row.city }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.ratingsUpdated ? 'positive' : 'warning'"
                :label="props.row.ratingsUpdated ? 'Обработан' : 'Не обработан'"
                rounded
              />
            </q-td>
          </template>

          <template v-slot:body-cell-updated="props">
            <q-td :props="props">
              <div v-if="props.row.ratingsUpdatedDate">
                {{ formatDateTime(props.row.ratingsUpdatedDate) }}
              </div>
              <div v-else class="text-grey-6">—</div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="!props.row.ratingsUpdated"
                flat
                dense
                color="primary"
                icon="calculate"
                @click="selectTournamentForUpdate(props.row)"
                size="sm"
              >
                <q-tooltip>Обновить рейтинги</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                color="info"
                icon="visibility"
                @click="viewTournamentDetails(props.row)"
                size="sm"
              >
                <q-tooltip>Просмотреть детали</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Прогресс выполнения -->
    <q-dialog v-model="showProgressDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Выполняется перерасчет</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body1 q-mb-md">{{ progressMessage }}</div>
          
          <q-linear-progress
            v-if="progressCurrent && progressTotal"
            :value="progressCurrent / progressTotal"
            color="primary"
            class="q-mb-sm"
          />
          
          <div v-if="progressCurrent && progressTotal" class="text-center">
            {{ progressCurrent }} из {{ progressTotal }} ({{ Math.round(progressCurrent / progressTotal * 100) }}%)
          </div>
          
          <div v-if="currentOperation" class="text-caption text-grey-7 q-mt-sm">
            Текущая операция: {{ currentOperation }}
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Закрыть"
            color="primary"
            v-close-popup
            :disable="operationInProgress"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { date } from 'quasar';
import { api } from '../../services/api';
import { useQuasar } from 'quasar';
export default {
  name: 'AdminRatingsPanel',
  
  setup() {
    const $q = useQuasar();
    const loading = ref(false);
    const loadingTournaments = ref(false);
    const loadingHistory = ref(false);
    const updatingTournament = ref(false);
    const recalculatingAll = ref(false);
    
    const stats = ref({});
    const tournaments = ref([]);
    const recentHistory = ref([]);
    const selectedTournament = ref(null);
    
    const confirmRecalculation = ref(false);
    const showProgressDialog = ref(false);
    const progressMessage = ref('');
    const progressCurrent = ref(0);
    const progressTotal = ref(0);
    const currentOperation = ref('');
    const operationInProgress = ref(false);

    const historyColumns = [
      { name: 'tournament', label: 'Турнир', field: 'tournamentName', align: 'left', sortable: true },
      { name: 'status', label: 'Статус', field: 'ratingsUpdated', align: 'center', sortable: true },
      { name: 'updated', label: 'Обновлен', field: 'ratingsUpdatedDate', align: 'center', sortable: true },
      { name: 'players', label: 'Участники', field: 'playerCount', align: 'center', sortable: true },
      { name: 'actions', label: 'Действия', align: 'center' }
    ];

    // Форматирование дат
    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return date.formatDate(new Date(dateString), 'DD.MM.YYYY');
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return '—';
      return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm');
    };

    // Загрузка статистики
    const loadStats = async () => {
      try {
        const response = await api.get('/api/ratings/statistics');
        stats.value = response.data.data || {};
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    };

    // Загрузка турниров
    const loadTournaments = async () => {
      loadingTournaments.value = true;
      try {
        const response = await api.get('/api/tournaments/unprocessed', {
          params: { limit: 50 }
        });
        tournaments.value = response.data.data || [];
      } catch (error) {
        console.error('Ошибка загрузки турниров:', error);
      } finally {
        loadingTournaments.value = false;
      }
    };

    // Загрузка истории
    const loadRecentHistory = async () => {
      loadingHistory.value = true;
      try {
        const response = await api.get('/api/tournaments/recent', {
          params: { limit: 10 }
        });
        recentHistory.value = response.data.data || [];
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      } finally {
        loadingHistory.value = false;
      }
    };

    // Обновление рейтингов турнира
    const updateTournamentRatings = async () => {
      if (!selectedTournament.value) return;
      
      updatingTournament.value = true;
      operationInProgress.value = true;
      showProgressDialog.value = true;
      progressMessage.value = 'Обновление рейтингов турнира...';
      
      try {
        const response = await api.post(`/api/ratings/tournament/${selectedTournament.value}/update`);
        
        if (response.data.success) {
          // Уведомление об успехе
          if (typeof $q !== 'undefined') {
            $q.notify({
              type: 'positive',
              message: 'Рейтинги успешно обновлены',
              timeout: 3000
            });
          }
          
          // Обновляем данные
          await Promise.all([
            loadStats(),
            loadTournaments(),
            loadRecentHistory()
          ]);
        }
      } catch (error) {
        console.error('Ошибка обновления рейтингов:', error);
        
        if (typeof $q !== 'undefined') {
          $q.notify({
            type: 'negative',
            message: 'Ошибка при обновлении рейтингов',
            caption: error.message,
            timeout: 5000
          });
        }
      } finally {
        updatingTournament.value = false;
        operationInProgress.value = false;
        showProgressDialog.value = false;
      }
    };

    // Полный перерасчет
    const recalculateAllRatings = async () => {
      recalculatingAll.value = true;
      operationInProgress.value = true;
      showProgressDialog.value = true;
      progressMessage.value = 'Запущен полный перерасчет всех рейтингов...';
      currentOperation.value = 'Подготовка данных';
      
      try {
        const response = await api.post('/api/ratings/recalculate-all');
        
        if (response.data.success) {
          // Запускаем мониторинг прогресса
          startProgressMonitoring();
          
          if (typeof $q !== 'undefined') {
            $q.notify({
              type: 'info',
              message: 'Перерасчет запущен в фоновом режиме',
              caption: 'Операция может занять несколько минут',
              timeout: 5000,
              multiLine: true
            });
          }
        }
      } catch (error) {
        console.error('Ошибка запуска перерасчета:', error);
        
        if (typeof $q !== 'undefined') {
          $q.notify({
            type: 'negative',
            message: 'Ошибка при запуске перерасчета',
            caption: error.message,
            timeout: 5000
          });
        }
        
        recalculatingAll.value = false;
        operationInProgress.value = false;
        showProgressDialog.value = false;
      }
    };

    // Мониторинг прогресса (опционально - если реализовано на бэкенде)
    const startProgressMonitoring = () => {
      let checkCount = 0;
      const maxChecks = 60; // Максимум 5 минут (60 * 5 секунд)
      
      const checkProgress = async () => {
        if (checkCount >= maxChecks) {
          progressMessage.value = 'Перерасчет завершен (таймаут)';
          operationInProgress.value = false;
          return;
        }
        
        try {
          const response = await api.get('/api/ratings/recalculation-progress');
          const progress = response.data.data;
          
          if (progress.completed) {
            progressMessage.value = 'Перерасчет успешно завершен!';
            progressCurrent.value = progressTotal.value;
            currentOperation.value = 'Завершение';
            
            // Обновляем данные
            setTimeout(async () => {
              await loadStats();
              showProgressDialog.value = false;
              operationInProgress.value = false;
              recalculatingAll.value = false;
              
              if (typeof $q !== 'undefined') {
                $q.notify({
                  type: 'positive',
                  message: 'Полный перерасчет завершен',
                  timeout: 5000
                });
              }
            }, 2000);
          } else {
            progressCurrent.value = progress.current || checkCount;
            progressTotal.value = progress.total || maxChecks;
            currentOperation.value = progress.operation || 'Выполняется перерасчет...';
            checkCount++;
            setTimeout(checkProgress, 5000); // Проверяем каждые 5 секунд
          }
        } catch (error) {
          console.error('Ошибка проверки прогресса:', error);
          checkCount++;
          setTimeout(checkProgress, 5000);
        }
      };
      
      checkProgress();
    };

    // Вспомогательные функции
    const selectTournamentForUpdate = (tournament) => {
      selectedTournament.value = tournament.id;
      updateTournamentRatings();
    };

    const viewTournamentDetails = (tournament) => {
      // Реализуйте переход к деталям турнира
      console.log('View tournament:', tournament);
    };

    // Инициализация
    onMounted(async () => {
      await Promise.all([
        loadStats(),
        loadTournaments(),
        loadRecentHistory()
      ]);
    });

    return {
      loading,
      loadingTournaments,
      loadingHistory,
      updatingTournament,
      recalculatingAll,
      
      stats,
      tournaments,
      recentHistory,
      selectedTournament,
      historyColumns,
      
      confirmRecalculation,
      showProgressDialog,
      progressMessage,
      progressCurrent,
      progressTotal,
      currentOperation,
      operationInProgress,
      
      formatDate,
      formatDateTime,
      loadTournaments,
      loadRecentHistory,
      updateTournamentRatings,
      recalculateAllRatings,
      selectTournamentForUpdate,
      viewTournamentDetails
    };
  }
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>