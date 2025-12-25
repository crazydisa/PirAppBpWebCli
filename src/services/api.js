// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5038',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
   withCredentials: true 
});

// Перехватчики для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Редирект на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ratingsApi = {
  // Рейтинги
  getGlobalRankings(params) {
    return api.get('/api/ratings/global', { params });
  },
  
  getPlayerRating(playerId) {
    return api.get(`/api/ratings/player/${playerId}`);
  },
  
  getRatingStatistics() {
    return api.get('/api/ratings/statistics');
  },
  
  getPlayerRatingHistory(playerId, params) {
    return api.get(`/api/ratings/player/${playerId}/history`, { params });
  },
  
  // Турниры
  getPlayerTournaments(playerId, params) {
    return api.get(`/api/players/${playerId}/tournaments`, { params });
  },
  
  // Статистика
  getTopRegions() {
    return api.get('/api/statistics/top-regions');
  },
  
  getRatingDistribution() {
    return api.get('/api/statistics/rating-distribution');
  },
  // Административные методы
  updateTournamentRatings(tournamentId) {
    return api.post(`/api/ratings/tournament/${tournamentId}/update`);
  },
  
  recalculateAllRatings() {
    return api.post('/api/ratings/recalculate-all');
  },
  
  getRecalculationProgress() {
    return api.get('/api/ratings/recalculation-progress');
  },
  
  // Турниры для админа
  getUnprocessedTournaments(params) {
    return api.get('/api/tournaments/unprocessed', { params });
  },
  
  getRecentTournaments(params) {
    return api.get('/api/tournaments/recent', { params });
  }
};

export { api };