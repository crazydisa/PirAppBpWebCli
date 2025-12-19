<template>
  <q-form @submit="submitForm">
    <!-- Поля для дополнительных данных -->
    <q-input 
      v-model="form.tournament" 
      label="Турнир" 
      :rules="[val => !!val || 'Обязательное поле']"
      required
    />
    
    <q-input 
      v-model="form.year" 
      label="Год" 
      type="number"
      :rules="[
        val => !!val || 'Обязательное поле',
        val => val >= 1900 && val <= new Date().getFullYear() + 1 || 'Некорректный год'
      ]"
      required
    />
    
    <q-input 
      v-model="form.city" 
      label="Город" 
      :rules="[val => !!val || 'Обязательное поле']"
      required
    />
    
    <!-- Дополнительные поля по желанию -->
    <q-input 
      v-model="form.description" 
      label="Описание" 
      type="textarea"
    />
    
    <!-- Поле для файла -->
    <q-file
      v-model="pdfFile"
      label="Выберите PDF файл"
      accept=".pdf"
      :rules="[val => !!val || 'Файл обязателен']"
      required
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    
    <!-- Кнопка отправки -->
    <q-btn 
      type="submit" 
      label="Отправить" 
      color="primary" 
      :loading="loading"
    />
  </q-form>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = ref({
      tournament: '',
      year: new Date().getFullYear(),
      city: '',
      description: ''
    });
    
    const pdfFile = ref(null);
    const loading = ref(false);
    
    async function submitForm() {
      loading.value = true;
      
      const formData = new FormData();
      
      // Добавляем дополнительные данные
      Object.keys(form.value).forEach(key => {
        formData.append(key, form.value[key]);
      });
      
      // Добавляем файл с явным именем
      if (pdfFile.value) {
        formData.append('pdfFile', pdfFile.value);
      } else {
        alert('Пожалуйста, выберите файл');
        loading.value = false;
        return;
      }
      
      try {
        const response = await axios.post(
          'http://localhost:5038/universal/upload-data', 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        );
        
        console.log('Успешно отправлено', response.data);
        alert('Данные успешно отправлены!');
        
        // Сброс формы
        form.value = {
          tournament: '',
          year: new Date().getFullYear(),
          city: '',
          description: ''
        };
        pdfFile.value = null;
        
      } catch (error) {
        console.error('Ошибка отправки', error);
        
        if (error.response) {
          alert(`Ошибка: ${error.response.data.title || error.response.data}`);
        } else {
          alert('Ошибка сети или сервера');
        }
      } finally {
        loading.value = false;
      }
    }
    
    return {
      form,
      pdfFile,
      loading,
      submitForm
    };
  }
}
</script>