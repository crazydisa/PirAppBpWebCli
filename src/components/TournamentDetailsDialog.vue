<template>
    <q-dialog :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    full-width 
    persistent>
      <q-card style="max-width: 1200px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Детальная информация о турнире</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </q-card-section>
  
        <q-card-section v-if="tournament" class="q-pt-none">
          <!-- Основная информация о турнире -->
          <div class="row q-col-gutter-md q-mb-lg">
            <!-- Левая колонка: Основные данные -->
            <div class="col-12 col-md-4">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-center q-mb-md">
                    <q-icon 
                      name="emoji_events" 
                      size="60px" 
                      color="amber" 
                      class="q-mb-sm"
                    />
                    <div class="text-h4">{{ tournament.Name }}</div>
                    <div class="text-subtitle1 text-grey-7">
                      ID: {{ tournament.Id }}
                    </div>
                  </div>
  
                  <q-list bordered separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Дата начала</q-item-label>
                        <q-item-label>{{ formatDate(tournament.StartDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Дата окончания</q-item-label>
                        <q-item-label>{{ formatDate(tournament.EndDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Город</q-item-label>
                        <q-item-label>{{ tournament.City.Title || 'Не указан' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Статус рейтингов</q-item-label>
                        <q-item-label>
                          <q-badge 
                            :color="tournament.RatingsUpdated ? 'positive' : 'warning'"
                            rounded
                          >
                            {{ tournament.RatingsUpdated ? 'Обновлены' : 'Не обновлены' }}
                          </q-badge>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="tournament.RatingsUpdatedDate">
                      <q-item-section>
                        <q-item-label caption>Дата обновления</q-item-label>
                        <q-item-label>{{ formatDateTime(tournament.RatingsUpdatedDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
  
            <!-- Правая колонка: Детали и статистика -->
            <div class="col-12 col-md-8">
              <!-- Ключевая статистика -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-6 col-md-3">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Тип</div>
                      <div class="text-h6 text-primary">{{ getTournamentType(tournament.Type) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6 col-md-3">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Формат</div>
                      <div class="text-h6 text-info">{{ getTournamentFormat(tournament.Format) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6 col-md-3">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Система</div>
                      <div class="text-h6 text-positive">{{ getScoringSystem(tournament.ScoringSystem) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6 col-md-3">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Категория</div>
                      <div class="text-h6 text-warning">{{ getTournamentGender(tournament.Gender) }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
  
              <!-- Описание турнира -->
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="text-h6">Описание</div>
                  <div class="q-mt-sm">
                    {{ tournament.Description || 'Описание отсутствует' }}
                  </div>
                </q-card-section>
              </q-card>
  
              <!-- Дополнительная информация -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Боулинг-центр</div>
                      <div class="q-mt-sm">
                        {{ tournament.BowlingCenterName || 'Не указан' }}
                      </div>
                      <div v-if="tournament.BowlingCenterAddress" class="text-caption text-grey-7">
                        {{ tournament.BowlingCenterAddress }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Масло</div>
                      <div class="q-mt-sm">
                        {{ tournament.OilName || 'Не указано' }}
                      </div>
                      <div v-if="tournament.OilPattern" class="text-caption text-grey-7">
                        Схема: {{ tournament.OilPattern }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Табы с дополнительной информацией -->
          <q-tabs
            v-model="activeTab"
            align="left"
            class="bg-primary text-white shadow-2"
          >
            <q-tab name="results" icon="list_alt" label="Результаты" />
            <q-tab name="participants" icon="people" label="Участники" />
            <q-tab name="ratings" icon="trending_up" label="Изменения рейтингов" />
            <q-tab name="documents" icon="description" label="Документы" />
          </q-tabs>
  
          <q-tab-panels v-model="activeTab" animated class="q-mt-md">
            <!-- Результаты -->
            <q-tab-panel name="results">
              <TournamentResults :tournament-id="tournament.Id" />
            </q-tab-panel>
  
            <!-- Участники -->
            <q-tab-panel name="participants">
              <TournamentParticipants :tournament-id="tournament.Id" />
            </q-tab-panel>
  
            <!-- Изменения рейтингов -->
            <q-tab-panel name="ratings">
              <TournamentRatingChanges :tournament-id="tournament.Id" />
            </q-tab-panel>
  
            <!-- Документы -->
            <q-tab-panel name="documents">
              <TournamentDocuments :tournament-id="tournament.Id" />
            </q-tab-panel>
          </q-tab-panels>
  
          <!-- Кнопки действий -->
          <div class="row q-mt-lg">
            <div class="col">
              <q-btn
                v-if="!tournament.RatingsUpdated"
                color="primary"
                icon="calculate"
                label="Обновить рейтинги"
                @click="updateRatings"
                :loading="updatingRatings"
              />
            </div>
            <div class="col text-right">
              <q-btn
                color="secondary"
                icon="edit"
                label="Редактировать"
                @click="editTournament"
                class="q-mr-sm"
              />
              <q-btn
                color="negative"
                icon="delete"
                label="Удалить"
                @click="confirmDelete"
              />
            </div>
          </div>
        </q-card-section>
  
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { date } from 'quasar';
  import { api } from '../services/api';
  import TournamentResults from './TournamentResults.vue';
  import TournamentParticipants from './TournamentParticipants.vue';
  import TournamentRatingChanges from './TournamentRatingChanges.vue';
  import TournamentDocuments from './TournamentDocuments.vue';
  
  export default {
    name: 'TournamentDetailsDialog',
    
    components: {
      TournamentResults,
      TournamentParticipants,
      TournamentRatingChanges,
      TournamentDocuments
    },
    
    props: {
        modelValue: {  // Используем стандартное имя для v-model
      type: Boolean,
      default: false
    },
    tournamentId: {
      type: Number,
      default: null
    }
    },
    
    emits: ['update:modelValue', 'update-ratings', 'edit', 'delete'],
    
    setup(props, { emit }) {
      const tournament = ref(null);
      const loading = ref(false);
      const updatingRatings = ref(false);
      const activeTab = ref('results');
  
      const formatDate = (dateString) => {
        if (!dateString) return '—';
        return date.formatDate(new Date(dateString), 'DD.MM.YYYY');
      };
  
      const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm');
      };
  
      const getTournamentType = (type) => {
        const types = {
          0: 'Индивидуальный',
          1: 'Командный',
          2: 'Смешанный',
          3: 'Неизвестный'
        };
        return types[type] || 'Неизвестный';
      };
  
      const getTournamentFormat = (format) => {
        const formats = {
          0: 'Одиночный',
          1: 'Парный',
          2: 'Тройки',
          3: 'Команда 4',
          4: 'Команда 5',
          5: 'Бейкер',
          6: 'Матчевый',
          7: 'Неизвестный'
        };
        return formats[format] || 'Неизвестный';
      };
  
      const getScoringSystem = (system) => {
        const systems = {
          0: 'Scratch',
          1: 'Гандикап',
          2: 'Очковая',
          3: 'На выбывание',
          4: 'Круговая',
          5: 'Швейцарская'
        };
        return systems[system] || 'Неизвестная';
      };
  
      const getTournamentGender = (gender) => {
        const genders = {
          0: 'Женский',
          1: 'Мужской',
          2: 'Смешанный',
          3: 'Неизвестный'
        };
        return genders[gender] || 'Неизвестный';
      };
  
      const loadTournamentDetails = async () => {
        console.log("tournamentId = ", props.tournamentId)
        if (!props.tournamentId){
            
            return
        }
        
        loading.value = true;
        try {
          const response = await api.get(`/api/tournaments/${props.tournamentId}`);
          tournament.value = response.data.Data || response.data.data;
        } catch (error) {
          console.error('Ошибка загрузки деталей турнира:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const updateRatings = async () => {
        if (!tournament.value) return;
        
        updatingRatings.value = true;
        try {
          await api.post(`/api/ratings/tournament/${tournament.value.Id}/update`);
          
          // Обновляем данные турнира
          await loadTournamentDetails();
          
          // Эмитим событие для обновления списка
          emit('update-ratings', tournament.value.Id);
        } catch (error) {
          console.error('Ошибка обновления рейтингов:', error);
        } finally {
          updatingRatings.value = false;
        }
      };
  
      const editTournament = () => {
        emit('edit', tournament.value);
      };
  
      const confirmDelete = () => {
        if (confirm(`Удалить турнир "${tournament.value?.Name}"?`)) {
          emit('delete', tournament.value.Id);
        }
      };
  
      const closeDialog = () => {
      emit('update:modelValue', false);
    };
  
      // Загружаем детали при открытии диалога
      watch(() => props.modelValue, (newValue) => {
        if (newValue && props.tournamentId) {
          loadTournamentDetails();
        } else {
          tournament.value = null;
        }
      });
  
      return {
        tournament,
        loading,
        updatingRatings,
        activeTab,
        
        formatDate,
        formatDateTime,
        getTournamentType,
        getTournamentFormat,
        getScoringSystem,
        getTournamentGender,
        
        updateRatings,
        editTournament,
        confirmDelete,
        closeDialog
      };
    }
  };
  </script>