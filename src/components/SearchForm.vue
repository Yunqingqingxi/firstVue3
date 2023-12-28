<!-- SearchForm.vue -->
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 查询学生信息 </span>
    </template>
  </el-page-header>
  <div>
    <h2 style="text-align: center">查询学生信息</h2>
    <div class="mt-4">
      <el-input v-model="query" placeholder="输入要查询的内容" @keyup.enter="search">
        <template #prepend>
          <el-select v-model="searchType" placeholder="选择查询类型" style="width: 115px">
            <el-option label="姓名" value="stu_name" />
            <el-option label="学号" value="stu_num" />
            <el-option label="房号" value="room_num" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="search"  />
        </template>
      </el-input>
    </div>

    <!-- 显示查询结果 -->
    <div class="mt-4">
      <h3>查询结果：</h3>
      <ul>
        <li v-for="result in searchResults" :key="result.id">
          姓名:{{ result.stu_name }} -学号: {{ result.stu_num }} -房号: {{ result.room_num }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { Search } from "@element-plus/icons-vue";

const query = ref('');
const searchType = ref('stu_name'); // 默认查询类型为姓名

// 执行搜索操作
const searchResults = ref([]);

const goBack = () =>{
  window.history.back();
}

// 执行搜索操作
const search = async () => {
  try {
    const response = await axios.get('http://localhost:3000/getStudents');
    const searchTerm = query.value.toLowerCase();
    const type = searchType.value;

    // 根据查询类型和输入条件过滤学生信息
    const filteredStudents = response.data.filter((student) => {
      const fieldValue = String(student[type]).toLowerCase();
      return fieldValue === searchTerm; // 使用全等于进行匹配
    });

    if (filteredStudents.length === 0) {
      alert('未找到匹配的学生信息');
    }

    searchResults.value = filteredStudents;
  } catch (error) {
    console.error('Error searching students:', error);
    alert('搜索学生信息时发生错误');
  }
};



// 在每次搜索时清空结果
const clearResults = () => {
  searchResults.value = [];
};

</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
