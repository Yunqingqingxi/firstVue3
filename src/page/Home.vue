<!-- Home.vue -->
<template>
  <h1 style="text-align: center">宿舍信息管理系统</h1>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content ep-bg-purple"/>
      <router-link to="/Search"><el-link :icon="Search">查询学生信息</el-link></router-link>
    </el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /><router-link to="/StudentList">
      <el-link :icon="Plus">添加学生信息</el-link></router-link></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" />
      <router-link to="/ManageForm"><el-link :icon="Edit">修改学生信息</el-link></router-link></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" />
      <router-link to="/deleteFile"><el-link :icon="Files">导入学生信息</el-link></router-link></el-col>
  </el-row>
</template>

<script lang="js" setup>
import { Search ,Edit, Plus,Files,Management } from '@element-plus/icons-vue'
</script>


<style>
.el-link {
  margin-right: 8px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>