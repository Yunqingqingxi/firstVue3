<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 修改学生信息 </span>
    </template>
  </el-page-header>
  <div>
    <h2 style="text-align: center">修改学生信息</h2>
    <el-form :model="ruleForm" ref="form" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="ruleForm.stu_name" type="text" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="ruleForm.stu_num" type="text" />
      </el-form-item>
      <el-form-item label="要修改的属性">
        <el-select v-model="ruleForm.selectedProperty" class="m-2" placeholder="Select">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="新值">
        <el-input v-model="ruleForm.newValue" placeholder="输入修改后的值" type="text" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const options = [
  { value: 'stu_name', label: '姓名' },
  { value: 'stu_num', label: '学号' },
  { value: 'room_num', label: '房号' },
];

const ruleForm = ref({
  stu_name: '',
  stu_num: '',
  selectedProperty: '',
  newValue: '',
});

const submitForm = async () => {
  try {
    const requestData = {
      stu_name: ruleForm.value.stu_name,
      stu_num: ruleForm.value.stu_num,
      selectedProperty: ruleForm.value.selectedProperty,
      newValue: ruleForm.value.newValue,
    };

    console.log('Form data before submission:', requestData);

    const response = await axios.post('http://localhost:3000/modifyStudent', requestData);

    console.log('Form submitted successfully:', response.data);

    ElMessage.success(response.data.message);
  } catch (error) {
    console.error('Error during form submission:', error);
    ElMessage.error('学生不存在或信息有误');
  }
};


const goBack = () => {
  window.history.back();
};


onMounted(() => {
  // 可以添加加载属性列表的逻辑
});
</script>

<style scoped>
</style>
