<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 删除学生信息 </span>
    </template>
  </el-page-header>
  <el-table :data="tableData" style="width: 100%" max-height="250">
    <el-table-column prop="stu_name" label="学生姓名" width="120" />
    <el-table-column prop="stu_num" label="学生学号" width="120" />
    <el-table-column prop="room_num" label="学生房号" width="120" />
    <el-table-column fixed="right" label="删除" width="120">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.row)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus';

const tableData = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3000/getStudentsFromFile'); // Update the URL accordingly
    if (!response.ok) {
      throw new Error(`Failed to fetch student data (${response.status} ${response.statusText})`);
    }

    const students = await response.json();

    console.log('Received data:', students);

    // Directly assign the students array to tableData
    tableData.value = students;
  } catch (error) {
    console.error('Error fetching student data:', error);
    // Handle the error
  }
};


const deleteRow = (student) => {
  ElMessageBox.confirm(`确定要删除学生 ${student.stu_name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // Remove from UI
    const index = tableData.value.indexOf(student)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('学生删除成功')
    }
    // Remove from file
    try {
      await axios.post('http://localhost:3000/deleteStudent', student); // 修改这一行
      console.log('Student deleted from file:', student)
    } catch (error) {
      console.error('Error deleting student from file:', error)
      ElMessage.error('无法删除学生')
    }
  }).catch(() => {
    ElMessage.info('取消删除学生')
  })
}

const goBack = () => {
  window.history.back()
}

// Fetch data when the component is mounted
fetchData()
</script>

<style scoped>
/* Your styles go here */
</style>
