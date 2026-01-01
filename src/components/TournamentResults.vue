<template>
  <div>
    <q-table
      :rows="results"
      :columns="columns"
      row-key="Id"
      :loading="loading"
      flat
      bordered
      v-model:pagination="pagination"
      @request="onRequest"
      :rows-per-page-options="[10, 20, 50, 100]"
      binary-state-sort
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
          <q-td key="place" :props="props">{{ props.row.Place }}</q-td>
          <q-td key="player" :props="props">
            <div class="text-weight-medium">{{ props.row.PlayerName }}</div>
            <div class="text-caption text-grey-7">{{ props.row.PlayerRegion }}</div>
          </q-td>
          <q-td key="totalScore" :props="props" class="text-center">
            <div class="text-h6">{{ props.row.TotalScore }}</div>
          </q-td>
          <q-td key="averageScore" :props="props" class="text-center">
            {{ props.row.FormattedAverage }}
          </q-td>
          <!-- Игры как отдельные колонки -->
          <q-td key="game1" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.gGame1)">
              {{ props.row.Game1 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.Game2)">
              {{ props.row.Game2 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.Game3)">
              {{ props.row.Game3 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.Game4)">
              {{ props.row.Game4 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.Game5)">
              {{ props.row.Game5 || '-' }}
            </q-badge>
          </q-td>
          <q-td key="game2" :props="props" class="text-center">
            <q-badge :color="getSingleGameBadgeColor(props.row.Game6)">
              {{ props.row.Game6 || '-' }}
            </q-badge>
          </q-td>
          <!-- ... остальные игры ... -->
          <q-td key="strikes" :props="props" class="text-center">
            {{ props.row.StrikeCount }}
          </q-td>
          <q-td key="spares" :props="props" class="text-center">
            {{ props.row.SpareCount }}
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
                        <strong>{{ props.row.HighGame }}</strong>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Худшая игра:</q-item-section>
                      <q-item-section side>
                        <strong>{{ props.row.LowGame }}</strong>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>Консистентность:</q-item-section>
                      <q-item-section side>
                        <strong>{{ props.row.Consistency?.toFixed(2) }}</strong>
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
import { ref, onMounted, watch  } from 'vue';
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
      sortBy: 'Place',
      descending: true,
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    });
    const onRequest = (props) => {
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
      
      loadResults(page, rowsPerPage, sortBy, descending);
    };
    const columns = ref([
      { name: 'place', label: 'Место', field: 'Place', align: 'center', sortable: true },
      { name: 'player', label: 'Игрок', field: 'PlayerName', align: 'left', sortable: true },
      { name: 'totalScore', label: 'Счет', field: 'TotalScore', align: 'center', sortable: true },
      { name: 'averageScore', label: 'Средний', field: 'FormattedAverage', align: 'center', sortable: true },
      { name: 'game1', label: '1', field: 'Game1', align: 'center' },
      { name: 'game2', label: '2', field: 'Game2', align: 'center' },
      { name: 'game3', label: '3', field: 'Game3', align: 'center' },
      { name: 'game4', label: '4', field: 'Game4', align: 'center' },
      { name: 'game5', label: '5', field: 'Game5', align: 'center' },
      { name: 'game6', label: '6', field: 'Game6', align: 'center' },
      { name: 'strikes', label: 'Страйки', field: 'StrikeCount', align: 'center' },
      { name: 'spares', label: 'Спэры', field: 'SpareCount', align: 'center' }
    ]);
    
    const getGameScores = (row) => {
      return [row.Game1, row.Game2, row.Game3, row.Game4, row.Game5, row.Game6];
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
    
    const loadResults = async (page = 1, pageSize = 20, sortField = 'Place', sortDesc = false) => {
      loading.value = true;
      try {
        const endpoint = props.resultsType === 'team' 
          ? `/api/tournamentresults/tournament/${props.tournamentId}/team`
          : `/api/tournamentresults/tournament/${props.tournamentId}/individual`;
        
        console.log("Загрузка результатов:", { 
          endpoint, 
          page, 
          pageSize, 
          sortField, 
          sortDesc 
        });
        
        const response = await api.get(endpoint, {
          params: {
            page: page,
            pageSize: pageSize,
            sortBy: sortField,
            descending: sortDesc
          }
        });
        
        console.log("Ответ сервера:", response.data);
        
        // Проверяем разные возможные структуры ответа
        const responseData = response.data.Data || response.data.data || response.data;
        const resultsData = responseData.Results || responseData.results || responseData;
        const totalCount = responseData.TotalCount || responseData.totalCount || resultsData.length;
        
        results.value = Array.isArray(resultsData) ? resultsData : [];
        pagination.value.rowsNumber = totalCount;
        pagination.value.page = page;
        pagination.value.rowsPerPage = pageSize;
        pagination.value.sortBy = sortField;
        pagination.value.descending = sortDesc;
        
        // Добавляем вычисляемые свойства
        results.value = results.value.map(result => ({
          ...result,
          FormattedAverage: result.AverageScore ? result.AverageScore.toFixed(2) : '0.00',
          GamesSummary: `${result.Game1 || 0}/${result.Game2 || 0}/${result.Game3 || 0}/${result.Game4 || 0}/${result.Game5 || 0}/${result.Game6 || 0}`
        }));
        
        console.log("Загружено результатов:", results.value.length);
        
      } catch (error) {
        console.error('Ошибка загрузки результатов:', error);
        results.value = [];
        pagination.value.rowsNumber = 0;
      } finally {
        loading.value = false;
      }
    };
    
    const exportResults = () => {
      console.log('Экспорт результатов');
      // Реализуйте экспорт в CSV/Excel
    };
    
   // Следим за изменением tournamentId
    watch(() => props.tournamentId, (newId, oldId) => {
      if (newId && newId !== oldId) {
        console.log("TournamentId изменился:", newId);
        loadResults(pagination.value.page, pagination.value.rowsPerPage);
      }
    });
    
    onMounted(() => {
      console.log("Компонент TournamentResults смонтирован, tournamentId:", props.tournamentId);
      if (props.tournamentId) {
        loadResults(pagination.value.page, pagination.value.rowsPerPage);
      }
    });
    
    return {
      results,
      loading,
      columns,
      pagination,
      getGameScores,
      getGameBadgeColor,
      getSingleGameBadgeColor,
      exportResults,
      onRequest
    };
  }
};
</script>