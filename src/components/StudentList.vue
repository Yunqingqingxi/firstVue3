<!-- StudentList.vue -->
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 添加学生信息 </span>
    </template>
  </el-page-header>
    <div class="text-align">
      <h2>添加学生信息</h2>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="stu_name">
          <el-input v-model="ruleForm.stu_name" type="text" autocomplete="off" />
        </el-form-item>

        <el-form-item label="学号" prop="stu_num">
          <el-input v-model="ruleForm.stu_num" type="text" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="房号" prop="room_num">
          <el-input v-model.number="ruleForm.room_num" />
        </el-form-item>

        <el-form-item>
          <el-button :plain="true" type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, h} from 'vue'
import type { FormInstance, FormRules,  } from 'element-plus'
import useMessage from 'element-plus'
import { ElMessage }  from 'element-plus'
import axios from 'axios'

const goBack = () =>{
  window.history.back();
}

const openMessage = () => {
  ElMessage({
    message: '添加成功',
    type: "success",
  });
}

const errorMessage = () =>{
  ElMessage({
    message:'添加失败',
    type: "error",
  });
}


const ruleFormRef = ref<FormInstance>()

const checkNum = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入房号'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      callback()
    }
  }, 1000)
}

const validateStu_name = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入姓名'))
  } else {
    if (ruleForm.stu_name !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('stu_num', () => null)
    }
    callback()
  }
}
const validateStu_num = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入学号'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  stu_name: '',
  stu_num: '',
  room_num: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  stu_name: [{ validator: validateStu_name, trigger: 'blur' }],
  stu_num: [{ validator: validateStu_num, trigger: 'blur' }],
  room_num: [{ validator: checkNum, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    // 验证表单
    const valid = await formEl.validate()

    if (valid) {
      // 表单验证通过，发送数据到后端
      const response = await axios.post('http://localhost:3000/addStudent', ruleForm)

      // 处理后端的响应
      console.log(response.data.message)

      // 重置表单
      resetForm(formEl)

      // 得到信息
      openMessage()
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    useMessage().error('提交表单时发生错误')
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const students = ref([]);

// 获取学生信息的方法
const getStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/getStudents');
    students.value = response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

// 刷新学生列表的方法
const refreshStudentList = () => {
  getStudents();
};

onMounted(() => {
  // 页面加载时获取学生信息
  getStudents();
});

</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.text-align{
  h2{
    text-align: center;
  }
}
</style>