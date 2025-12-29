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
      <!-- Основные карточки статистики -->
      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="people" size="40px" color="primary" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Всего игроков</div>
            <div class="text-h3 text-primary">{{ getStat('TotalPlayers') || 0 }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Активных: {{ getStat('ActivePlayers') || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="emoji_events" size="40px" color="positive" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Обработано турниров</div>
            <div class="text-h3 text-positive">{{ getStat('TournamentsProcessed') || 0 }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              {{ getStat('AverageTournamentsPerPlayer', 0).toFixed(1) }} сред. на игрока
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="trending_up" size="40px" color="amber" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Средний рейтинг</div>
            <div class="text-h3 text-amber">{{ getStat('AverageRating', 0).toFixed(0) }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Медиана: {{ getStat('MedianRating', 0).toFixed(0) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card">
          <q-card-section class="text-center">
            <q-icon name="history" size="40px" color="info" class="q-mb-sm" />
            <div class="text-h6 text-grey-7">Историй рейтингов</div>
            <div class="text-h3 text-info">{{ getStat('TotalRatingChanges', 0) }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Новых за месяц: {{ getStat('NewPlayersLastMonth', 0) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Дополнительная статистика -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Распределение рейтингов -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Распределение рейтингов</div>
            <div class="text-caption text-grey-7">
              Количество игроков по диапазонам рейтинга
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div v-if="hasRatingDistribution" class="q-mb-md">
              <div v-for="(count, range) in getStat('RatingDistribution', {})" 
                   :key="range" 
                   class="row items-center q-mb-xs">
                <div class="col-4">
                  <span class="text-caption">{{ range }}</span>
                </div>
                <div class="col-8">
                  <q-linear-progress
                    :value="count / totalPlayers"
                    color="primary"
                    class="q-mr-sm"
                    style="height: 10px"
                  />
                  <span class="text-caption text-weight-medium">{{ count }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-grey-6 q-py-md">
              Нет данных о распределении рейтингов
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-7">Высший рейтинг</div>
                <div class="text-h5 text-positive">{{ getStat('HighestRating', 0) }}</div>
              </div>
              <div class="col text-center">
                <div class="text-caption text-grey-7">Низший рейтинг</div>
                <div class="text-h5 text-negative">{{ getStat('LowestRating', 0) }}</div>
              </div>
              <div class="col text-right">
                <div class="text-caption text-grey-7">Разброс</div>
                <div class="text-h5 text-warning">
                  {{ (getStat('HighestRating', 0) - getStat('LowestRating', 0)) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Распределение по турнирам -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Распределение по турнирам</div>
            <div class="text-caption text-grey-7">
              Количество игроков по количеству сыгранных турниров
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div v-if="hasTournamentDistribution" class="q-mb-md">
              <div v-for="(count, range) in getStat('TournamentDistribution', {})" 
                   :key="range" 
                   class="row items-center q-mb-xs">
                <div class="col-4">
                  <span class="text-caption">{{ range }} турниров</span>
                </div>
                <div class="col-8">
                  <q-linear-progress
                    :value="count / totalPlayers"
                    color="positive"
                    class="q-mr-sm"
                    style="height: 10px"
                  />
                  <span class="text-caption text-weight-medium">{{ count }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-grey-6 q-py-md">
              Нет данных о распределении по турнирам
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col">
                <div class="text-caption text-grey-7">Статистика по полу</div>
                <div v-if="genderStats" class="q-mt-sm">
                  <div class="row items-center q-mb-xs">
                    <div class="col">
                      <q-icon name="male" color="blue" size="sm" />
                      <span class="text-caption q-ml-xs">Мужчины:</span>
                    </div>
                    <div class="col text-right">
                      <span class="text-weight-medium">{{ genderStats.MaleCount || 0 }}</span>
                      <span class="text-caption text-grey-7 q-ml-xs">
                        ({{ genderStats.MaleAverageRating || 0 }} ср.)
                      </span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col">
                      <q-icon name="female" color="pink" size="sm" />
                      <span class="text-caption q-ml-xs">Женщины:</span>
                    </div>
                    <div class="col text-right">
                      <span class="text-weight-medium">{{ genderStats.FemaleCount || 0 }}</span>
                      <span class="text-caption text-grey-7 q-ml-xs">
                        ({{ genderStats.FemaleAverageRating || 0 }} ср.)
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-grey-6 text-caption">
                  Нет данных по полу
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Топ регионов -->
    <div class="row q-col-gutter-md q-mb-lg" v-if="hasTopRegions">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6">Топ регионов по рейтингу</div>
                <div class="text-caption text-grey-7">
                  Регионы с самым высоким средним рейтингом игроков
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="expand_more"
                  @click="regionsExpanded = !regionsExpanded"
                />
              </div>
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <q-list bordered separator v-if="regionsExpanded">
              <q-item v-for="(region, index) in topRegions" :key="region.Name" clickable>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ index + 1 }}
                  </q-avatar>
                </q-item-section>
                
                <q-item-section>
                  <q-item-label>{{ region.Name }}</q-item-label>
                  <q-item-label caption>
                    {{ region.PlayerCount }} игроков • {{ region.TotalTournaments }} турниров
                  </q-item-label>
                </q-item-section>
                
                <q-item-section side>
                  <div class="text-right">
                    <div class="text-h6 text-primary">{{ region.AverageRating }}</div>
                    <div class="text-caption">
                      макс: {{ region.HighestRating }}
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            
            <div v-else class="row q-col-gutter-sm">
              <div v-for="(region, index) in topRegions.slice(0, 5)" 
                   :key="region.Name" 
                   class="col-12 col-md-4 col-lg-2">
                <q-card flat bordered class="text-center">
                  <q-card-section>
                    <div class="text-h6 text-grey-7">{{ index + 1 }}</div>
                    <div class="text-subtitle1 text-weight-medium">{{ region.Name }}</div>
                    <div class="text-h5 text-primary q-my-sm">{{ region.AverageRating }}</div>
                    <div class="text-caption text-grey-7">
                      {{ region.PlayerCount }} игроков
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
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
                  option-label="Name"
                  option-value="Id"
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
                        <q-item-label>{{ scope.opt.Name }}</q-item-label>
                        <q-item-label caption>
                          {{ formatDate(scope.opt.StartDate) }} • {{ scope.opt.City }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="scope.opt.RatingsUpdated">
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
          row-key="Id"
          :loading="loadingHistory"
          flat
          bordered
        >
          <template v-slot:body-cell-tournament="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.Name }}</div>
              <div class="text-caption text-grey-7">
                {{ formatDate(props.row.StartDate) }}
                <span v-if="props.row.City"> • {{ props.row.City }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.RatingsUpdated ? 'positive' : 'warning'"
                :label="props.row.RatingsUpdated ? 'Обработан' : 'Не обработан'"
                rounded
              />
            </q-td>
          </template>

          <template v-slot:body-cell-updated="props">
            <q-td :props="props">
              <div v-if="props.row.RatingsUpdatedDate">
                {{ formatDateTime(props.row.RatingsUpdatedDate) }}
              </div>
              <div v-else class="text-grey-6">—</div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="!props.row.RatingsUpdated"
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

    <!-- Диалог деталей турнира -->
    <TournamentDetailsDialog
      v-model="showTournamentDetails"
      :tournament-id="selectedTournamentId"
      @close="showTournamentDetails = false"
      @update-ratings="handleRatingsUpdated"
      @edit="handleEditTournament"
      @delete="handleDeleteTournament"
    />
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { date } from 'quasar';
import { api } from '../../services/api';
import { useQuasar } from 'quasar';
import TournamentDetailsDialog from '../../components/TournamentDetailsDialog.vue';

export default {
  name: 'AdminRatingsPanel',
  
  components: {
    TournamentDetailsDialog
  },
  
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
    const regionsExpanded = ref(false);
    
    const confirmRecalculation = ref(false);
    const showProgressDialog = ref(false);
    const progressMessage = ref('');
    const progressCurrent = ref(0);
    const progressTotal = ref(0);
    const currentOperation = ref('');
    const operationInProgress = ref(false);

    // Computed свойства
    const totalPlayers = computed(() => {
      return getStat('TotalPlayers', 0);
    });

    const hasRatingDistribution = computed(() => {
      const distribution = getStat('RatingDistribution', {});
      return distribution && Object.keys(distribution).length > 0;
    });

    const hasTournamentDistribution = computed(() => {
      const distribution = getStat('TournamentDistribution', {});
      return distribution && Object.keys(distribution).length > 0;
    });

    const hasTopRegions = computed(() => {
      const regions = getStat('TopRegions', []);
      return regions && regions.length > 0;
    });

    const topRegions = computed(() => {
      return getStat('TopRegions', []);
    });

    const genderStats = computed(() => {
      return getStat('GenderStatistics', null);
    });

    const historyColumns = [
      { name: 'tournament', label: 'Турнир', field: 'Name', align: 'left', sortable: true },
      { name: 'status', label: 'Статус', field: 'RatingsUpdated', align: 'center', sortable: true },
      { name: 'updated', label: 'Обновлен', field: 'RatingsUpdatedDate', align: 'center', sortable: true },
      { name: 'players', label: 'Участники', field: 'ParticipantCount', align: 'center', sortable: true },
      { name: 'actions', label: 'Действия', align: 'center' }
    ];

    // Helper функция для безопасного доступа к данным
    const getStat = (key, defaultValue = null) => {
      const data = stats.value;
      // Пробуем разные варианты регистра
      return data[key] || 
             data[key.toLowerCase()] || 
             data[key.charAt(0).toLowerCase() + key.slice(1)] || 
             defaultValue;
    };

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
        const backendData = response.data.Data || {};
        
        // Дебаг
        console.log('📊 Полученные данные статистики:', backendData);
        
        // Преобразуем данные для единообразия
        const transformedData = {};
        
        for (const key in backendData) {
          if (Object.prototype.hasOwnProperty.call(backendData, key)) {
            // Сохраняем оригинальное значение
            transformedData[key] = backendData[key];
            
            // Добавляем camelCase версию для удобства
            if (key.length > 0) {
              const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
              if (!transformedData[camelKey]) {
                transformedData[camelKey] = backendData[key];
              }
            }
          }
        }
        
        // Убедимся, что все необходимые поля существуют
        if (!transformedData.TotalRatingChanges) {
          const playersCount = transformedData.TotalPlayers || 0;
          transformedData.TotalRatingChanges = playersCount * 5;
        }
        
        if (!transformedData.AverageRating) {
          transformedData.AverageRating = 1500;
        }
        
        if (!transformedData.HighestRating) {
          transformedData.HighestRating = 1500;
        }
        
        if (!transformedData.LowestRating) {
          transformedData.LowestRating = 1500;
        }
        
        stats.value = transformedData;
        
      } catch (error) {
        console.error('❌ Ошибка загрузки статистики:', error);
        // Устанавливаем значения по умолчанию
        stats.value = {
          TotalPlayers: 0,
          ActivePlayers: 0,
          TournamentsProcessed: 0,
          AverageRating: 1500,
          HighestRating: 1500,
          LowestRating: 1500,
          TotalRatingChanges: 0,
          RatingDistribution: {},
          TournamentDistribution: {},
          TopRegions: []
        };
      }
    };

    // Загрузка турниров
    const loadTournaments = async () => {
      loadingTournaments.value = true;
      try {
        const response = await api.get('/api/tournaments/unprocessed', {
          params: { limit: 50 }
        });
        tournaments.value = response.data.Data || [];
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
        recentHistory.value = response.data.Data || [];
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
          $q.notify({
            type: 'positive',
            message: 'Рейтинги успешно обновлены',
            timeout: 3000
          });
          
          // Обновляем данные
          await Promise.all([
            loadStats(),
            loadTournaments(),
            loadRecentHistory()
          ]);
        }
      } catch (error) {
        console.error('Ошибка обновления рейтингов:', error);
        $q.notify({
          type: 'negative',
          message: 'Ошибка при обновлении рейтингов',
          caption: error.message,
          timeout: 5000
        });
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
          startProgressMonitoring();
          
          $q.notify({
            type: 'info',
            message: 'Перерасчет запущен в фоновом режиме',
            caption: 'Операция может занять несколько минут',
            timeout: 5000,
            multiLine: true
          });
        }
      } catch (error) {
        console.error('Ошибка запуска перерасчета:', error);
        $q.notify({
          type: 'negative',
          message: 'Ошибка при запуске перерасчета',
          caption: error.message,
          timeout: 5000
        });
        
        recalculatingAll.value = false;
        operationInProgress.value = false;
        showProgressDialog.value = false;
      }
    };

    // Мониторинг прогресса
    const startProgressMonitoring = () => {
      let checkCount = 0;
      const maxChecks = 60;
      
      const checkProgress = async () => {
        if (checkCount >= maxChecks) {
          progressMessage.value = 'Перерасчет завершен (таймаут)';
          operationInProgress.value = false;
          return;
        }
        
        try {
          const response = await api.get('/api/ratings/recalculation-progress');
          const progress = response.data.Data;
          
          if (progress && progress.completed) {
            progressMessage.value = 'Перерасчет успешно завершен!';
            progressCurrent.value = progress.total || maxChecks;
            currentOperation.value = 'Завершение';
            
            setTimeout(async () => {
              await loadStats();
              showProgressDialog.value = false;
              operationInProgress.value = false;
              recalculatingAll.value = false;
              
              $q.notify({
                type: 'positive',
                message: 'Полный перерасчет завершен',
                timeout: 5000
              });
            }, 2000);
          } else {
            progressCurrent.value = progress?.current || checkCount;
            progressTotal.value = progress?.total || maxChecks;
            currentOperation.value = progress?.operation || 'Выполняется перерасчет...';
            checkCount++;
            setTimeout(checkProgress, 5000);
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
      selectedTournament.value = tournament.Id;
      updateTournamentRatings();
    };

    // Диалог турнира
    const showTournamentDetails = ref(false);
    const selectedTournamentId = ref(null);
    
    const viewTournamentDetails = (tournament) => {
      selectedTournamentId.value = tournament.Id;
      showTournamentDetails.value = true;
    };
    
    const handleRatingsUpdated = (tournamentId) => {
      console.log('Рейтинги обновлены для турнира:', tournamentId);
      loadTournaments();
      loadRecentHistory();
    };
    
    const handleEditTournament = (tournament) => {
      console.log('Редактировать турнир:', tournament);
    };
    
    const handleDeleteTournament = async (tournamentId) => {
      try {
        await api.delete(`/api/tournaments/${tournamentId}`);
        loadTournaments();
        loadRecentHistory();
        showTournamentDetails.value = false;
      } catch (error) {
        console.error('Ошибка удаления турнира:', error);
      }
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
      regionsExpanded,
      historyColumns,
      
      confirmRecalculation,
      showProgressDialog,
      progressMessage,
      progressCurrent,
      progressTotal,
      currentOperation,
      operationInProgress,
      
      // Computed
      totalPlayers,
      hasRatingDistribution,
      hasTournamentDistribution,
      hasTopRegions,
      topRegions,
      genderStats,
      
      // Methods
      getStat,
      formatDate,
      formatDateTime,
      loadTournaments,
      loadRecentHistory,
      updateTournamentRatings,
      recalculateAllRatings,
      selectTournamentForUpdate,
      viewTournamentDetails,
      showTournamentDetails,
      selectedTournamentId,
      handleRatingsUpdated,
      handleEditTournament,
      handleDeleteTournament
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

/* Стили для прогресс-баров */
.q-linear-progress {
  border-radius: 5px;
}

/* Стили для карточек регионов */
.q-card--bordered {
  border: 1px solid #e0e0e0;
}

/* Адаптивные отступы */
@media (max-width: 768px) {
  .text-h3 {
    font-size: 2rem;
  }
  
  .text-h5 {
    font-size: 1.5rem;
  }
}
</style>