<template>
    <div>
      <q-table
        :rows="results"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:top>
          <div class="text-h6">Результаты турнира</div>
          <q-space />
          <q-btn
            color="primary"
            icon="download"
            label="Экспорт"
            @click="exportResults"
          />
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
      }
    },
    
    setup(props) {
      const results = ref([]);
      const loading = ref(false);
      
      const columns = [
        { name: 'place', label: 'Место', field: 'place', align: 'center' },
        { name: 'player', label: 'Игрок', field: 'playerName', align: 'left' },
        { name: 'score', label: 'Счет', field: 'totalScore', align: 'center' },
        { name: 'average', label: 'Средний', field: 'averageScore', align: 'center' },
        { name: 'prize', label: 'Приз', field: 'prizeMoney', align: 'right' }
      ];
      
      const loadResults = async () => {
        loading.value = true;
        try {
          const response = await api.get(`/api/tournaments/${props.tournamentId}/results`);
          results.value = response.data.Data || [];
        } catch (error) {
          console.error('Ошибка загрузки результатов:', error);
        } finally {
          loading.value = false;
        }
      };
      
      const exportResults = () => {
        console.log('Экспорт результатов');
      };
      
      onMounted(() => {
        loadResults();
      });
      
      return {
        results,
        loading,
        columns,
        exportResults
      };
    }
  };
  </script>