<template>
  <div>
    <q-table
      :rows="results"
      :columns="columns"
      row-key="Id"
      :loading="loading"
      flat
      bordered
      :pagination="pagination"
    >
      <template v-slot:top>
        <div class="text-h6">Результаты турнира (индивидуальные)</div>
        <q-space />
        <q-btn
          color="primary"
          icon="download"
          label="Экспорт"
          @click="exportResults"
        />
      </template>

      <!-- Кастомное отображение игр -->
      <template v-slot:body-cell-games="props">
        <q-td :props="props">
          <div class="row no-wrap">
            <q-badge v-for="(score, index) in getGameScores(props.row)" 
                     :key="index"
                     :color="getGameBadgeColor(score)"
                     class="q-mx-xs"
                     :label="score"
            />
          </div>
        </q-td>
      </template>

      <!-- Детализация строки -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="place" :props="props">{{ props.row.place }}</q-td>
          <q-td key="player" :props="props">
            <div class="text-weight-medium">{{ props.row.playerName }}</div>
            <div class="text-caption text-grey-7">{{ props.row.playerRegion }}</div>
          </q-td>
          <q-td key="totalScore" :props="props" class="text-center">
            <div class="text-h6">{{ props.row.totalScore }}</div>
          </q-td>
          <q-td key="averageScore" :props="props" class="text-center">
            {{ props.row.formattedAverage }}
          </q-td>
          <!-- Игры как отдельные колонки -->
          <q-td key="game1" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.game1)">
              {{ props.row.game1 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.game2)">
              {{ props.row.game2 || '-' }}
            </q-badge>
          </q-td>
          <!-- ... остальные игры ... -->
          <q-td key="strikes" :props="props" class="text-center">
            {{ props.row.strikeCount }}
          </q-td>
          <q-td key="spares" :props="props" class="text-center">
            {{ props.row.spareCount }}
          </q-td>
        </q-tr>
        
        <!-- Развернутая строка с деталями -->
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="q-pa-md">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="text-subtitle2 q-mb-sm">Детальная статистика:</div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Лучшая игра:</q-item-section>
                      <q-item-section side>
                        <strong>{{ props.row.highGame }}</strong>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Худшая игра:</q-item-section>
                      <q-item-section side>
                        <strong>{{ props.row.lowGame }}</strong>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Консистентность:</q-item-section>
                      <q-item-section side>
                        <strong>{{ props.row.consistency?.toFixed(2) }}</strong>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-6">
                  <div class="text-subtitle2 q-mb-sm">Результаты по играм:</div>
                  <div class="row">
                    <div v-for="(score, index) in getGameScores(props.row)" 
                         :key="index"
                         class="col-2 text-center"
                    >
                      <div class="text-caption">Игра {{ index + 1 }}</div>
                      <div class="text-h6">{{ score || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

export default {
  name: 'TournamentResults',
  
  props: {
    tournamentId: {
      type: Number,
      required: true
    },
    resultsType: {
      type: String,
      default: 'individual' // 'individual' или 'team'
    }
  },
  
  setup(props) {
    const results = ref([]);
    const loading = ref(false);
    const pagination = ref({
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    });
    
    const columns = ref([
      { name: 'place', label: 'Место', field: 'place', align: 'center', sortable: true },
      { name: 'player', label: 'Игрок', field: 'playerName', align: 'left', sortable: true },
      { name: 'totalScore', label: 'Счет', field: 'totalScore', align: 'center', sortable: true },
      { name: 'averageScore', label: 'Средний', field: 'formattedAverage', align: 'center', sortable: true },
      { name: 'game1', label: '1', field: 'game1', align: 'center' },
      { name: 'game2', label: '2', field: 'game2', align: 'center' },
      { name: 'game3', label: '3', field: 'game3', align: 'center' },
      { name: 'game4', label: '4', field: 'game4', align: 'center' },
      { name: 'game5', label: '5', field: 'game5', align: 'center' },
      { name: 'game6', label: '6', field: 'game6', align: 'center' },
      { name: 'strikes', label: 'Страйки', field: 'strikeCount', align: 'center' },
      { name: 'spares', label: 'Спэры', field: 'spareCount', align: 'center' }
    ]);
    
    const getGameScores = (row) => {
      return [row.game1, row.game2, row.game3, row.game4, row.game5, row.game6];
    };
    
    const getGameBadgeColor = (score) => {
      if (!score) return 'grey';
      if (score >= 250) return 'positive';
      if (score >= 200) return 'primary';
      if (score >= 150) return 'warning';
      return 'negative';
    };
    
    const getSingleGameBadgeColor = (score) => {
      if (!score) return 'grey';
      if (score === 300) return 'amber';
      if (score >= 250) return 'positive';
      if (score >= 200) return 'primary';
      if (score >= 150) return 'warning';
      return 'negative';
    };
    
    const loadResults = async () => {
      loading.value = true;
      try {
        const endpoint = props.resultsType === 'team' 
          ? `/api/tournamentresults/tournament/${props.tournamentId}/team`
          : `/api/tournamentresults/tournament/${props.tournamentId}/individual`;
        console.log("endpoint = ",endpoint)  
        const response = await api.get(endpoint, {
          params: {
            page: pagination.value.page,
            pageSize: pagination.value.rowsPerPage
          }
        });
        console.log("response = ",response)
        results.value = response.data.Data?.Results || response.data.data?.Results || [];
        pagination.value.rowsNumber = response.data.Data?.totalCount || response.data.data?.totalCount || 0;
        
        // Добавляем вычисляемые свойства
        results.value = results.value.map(result => ({
          ...result,
          formattedAverage: result.averageScore?.toFixed(2) || '0.00',
          gamesSummary: `${result.game1}/${result.game2}/${result.game3}/${result.game4}/${result.game5}/${result.game6}`
        }));
        
      } catch (error) {
        console.error('Ошибка загрузки результатов:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const exportResults = () => {
      console.log('Экспорт результатов');
      // Реализуйте экспорт в CSV/Excel
    };
    
    onMounted(() => {
      console.log("onMounted")
      loadResults();
    });
    
    return {
      results,
      loading,
      columns,
      pagination,
      getGameScores,
      getGameBadgeColor,
      getSingleGameBadgeColor,
      exportResults
    };
  }
};
</script>