<template>
  <q-form @submit="submitForm">
    <q-input v-model="form.turnir" label="Имя" />
    
    
    <q-file
      v-model="pdfFile"
      label="Выберите PDF файл"
      accept=".pdf"
    />
    
    <q-btn type="submit" label="Отправить" />
  </q-form>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = ref({
      firstName: '',
     
    });
    
    const pdfFile = ref(null);
    
    async function submitForm() {
      const formData = new FormData();
      
      // Добавляем данные формы
      Object.keys(form.value).forEach(key => {
        formData.append(key, form.value[key]);
      });
      
      // Добавляем файл
      if (pdfFile.value) {
        formData.append('pdfFile', pdfFile.value);
      }
      
      try {
        const response = await axios.post('http://localhost:5038/universa/upload-data', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }, );
        console.log('Успешно отправлено', response.data);
      } catch (error) {
        console.error('Ошибка отправки', error);
      }
    }
    
    return {
      form,
      pdfFile,
      submitForm
    };
  }
}
</script>