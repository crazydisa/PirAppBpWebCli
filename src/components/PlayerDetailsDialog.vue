<template>
    <q-dialog :model-value="modelValue" full-width persistent @update:model-value="updateModelValue">
    <q-card style="max-width: 1200px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Детальная информация об игроке</div>
        <q-space />
        <!-- Используем @click для закрытия -->
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section v-if="player" class="q-pt-none">
          <!-- Основная информация -->
          <div class="row q-col-gutter-md q-mb-lg">
            <!-- Аватар и основная информация -->
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <q-avatar
                    size="100px"
                    :color="player.gender === 'Male' ? 'blue' : 'pink'"
                    text-color="white"
                    class="q-mb-md"
                  >
                    {{ player.FullName.charAt(0) }}
                  </q-avatar>
                  <div class="text-h5">{{ player.FullName }}</div>
                  <div class="text-subtitle1 text-grey-7">
                    <q-icon name="place" />
                    {{ player.Region || 'Не указан' }}
                  </div>
                  <q-chip
                    :color="player.gender === 'Male' ? 'blue' : 'pink'"
                    text-color="white"
                    size="sm"
                  >
                    {{ player.Gender === 'Male' ? 'Мужчина' : 'Женщина' }}
                  </q-chip>
                </q-card-section>
              </q-card>
            </div>
  
            <!-- Рейтинг и статистика -->
            <div class="col-12 col-md-9">
              <div class="row q-col-gutter-md">
                <!-- Текущий рейтинг -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Текущий рейтинг</div>
                      <div class="text-h2 text-primary">{{ player.Rating }}</div>
                      <div class="text-caption">
                        <q-icon
                          :name="player.RatingChange > 0 ? 'trending_up' : 'trending_down'"
                          :color="player.RatingChange > 0 ? 'positive' : 'negative'"
                        />
                        {{ player.RatingChange > 0 ? '+' : '' }}{{ player.RatingChange }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- Пиковый рейтинг -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Пиковый рейтинг</div>
                      <div class="text-h2 text-warning">{{ player.PeakRating }}</div>
                      <div class="text-caption">Лучший результат</div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- Турниры -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Участие в турнирах</div>
                      <div class="text-h2 text-info">{{ player.TournamentCount }}</div>
                      <div class="text-caption">Всего сыграно</div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- Средний счет -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Средний счет</div>
                      <div class="text-h2 text-positive">{{ player.AverageScore.toFixed(2) }}</div>
                      <div class="text-caption">За турнир</div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- Среднее место -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">Среднее место</div>
                      <div class="text-h2 text-orange">{{ player.AveragePlace.toFixed(1) }}</div>
                      <div class="text-caption">Позиция в турнирах</div>
                    </q-card-section>
                  </q-card>
                </div>
  
                <!-- В топ-3 -->
                <div class="col-12 col-md-4">
                  <q-card class="text-center" flat bordered>
                    <q-card-section>
                      <div class="text-h6 text-grey-7">В топ-3</div>
                      <div class="text-h2 text-purple">{{ player.Top3Percentage.toFixed(1) }}%</div>
                      <div class="text-caption">Процент попаданий</div>
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
            <q-tab name="history" icon="timeline" label="История рейтинга" />
            <q-tab name="tournaments" icon="emoji_events" label="Турниры" />
            <q-tab name="achievements" icon="military_tech" label="Достижения" />
            <q-tab name="comparison" icon="compare" label="Сравнение" />
          </q-tabs>
  
          <q-tab-panels v-model="activeTab" animated class="q-mt-md">
            <!-- История рейтинга -->
            <q-tab-panel name="history">
              <RatingHistoryChart :player-id="player.id" />
            </q-tab-panel>
  
            <!-- Турниры -->
            <q-tab-panel name="tournaments">
              <PlayerTournamentsTable :player-id="player.id" />
            </q-tab-panel>
  
            <!-- Достижения -->
            <q-tab-panel name="achievements">
              <PlayerAchievements :player="player" />
            </q-tab-panel>
  
            <!-- Сравнение -->
            <q-tab-panel name="comparison">
              <PlayerComparison :player="player" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
  <script>
export default {
  name: 'PlayerDetailsDialog',
  
  props: {
    player: Object,
    modelValue: Boolean
  },
  
  emits: ['update:modelValue'],
  
  data() {
    return {
      activeTab: 'history'
    };
  },
  
  methods: {
    updateModelValue(value) {
      this.$emit('update:modelValue', value); // Используем this.$emit
    },
    
    closeDialog() {
      this.$emit('update:modelValue', false); // Используем this.$emit
    }
  }
};
</script>