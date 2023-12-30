// server.cjs
const express = require('express');
const { writeFile, mkdir } = require('fs/promises');
const { readFile } = require('fs/promises');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// 处理根路径的路由
app.get('/', (req, res) => {
    res.send('欢迎进入宿舍学生信息管理系统');
});

async function readFileContent(filePath) {
    try {
        const fileContent = await readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

// 将数据写入文件
async function writeToFile(filePath, data) {
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2), { flag: 'w' });
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
        throw error;
    }
}

// 添加学生信息
app.post('/addStudent', async (req, res) => {
    try {
        const studentInfo = req.body;
        const filePath = path.join('D:', 'Codefile1', 'student.dat');

        // 确保数据文件存在,如果不存在则创建文件
        const directoryPath = path.dirname(filePath);
        await ensureDirectoryExists(directoryPath);

        // 如果不存在则创建一个文件来读取
        let students = await readFileContent1(filePath);

        // 添加学生到数组中
        students.push(studentInfo);

        // 对学生数组进行排序,按照学号进行排序
        const sortedStudents = bubbleSortByStuNum(students);

        // 将排序后的学生数组写入文件,如果文件不存在则创建文件并写入数据,如果文件已存在则直接写入数据
        await writeToFile(filePath, sortedStudents);

        res.status(200).json({ message: '学生添加成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '网络连接错误' });
    }
});

// 删除学生信息
app.post('/removeStudent', async (req, res) => {
    try {
        const { stu_name, stu_num } = req.body;

        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        let students = await readFileContent(filePath);

        // 如果不存在则创建一个文件来读取
        if (!Array.isArray(students)) {
            students = [];
        }

        // 确保学生信息存在
        const studentIndex = students.findIndex(student => student.stu_name === stu_name && student.stu_num === stu_num);

        if (studentIndex !== -1) {
            // 删除学生信息
            students.splice(studentIndex, 1);

            // 对学生数组进行排序,按照学号进行排序
            await writeToFile(filePath, students);

            res.status(200).json({ message: '学生信息删除成功' });
        } else {
            res.status(404).json({ message: '未找到学生' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '网络错误' });
    }
});

// 修改学生信息,如果学生信息不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如果
app.post('/modifyStudent', async (req, res) => {
    try {
        const { stu_name, stu_num, selectedProperty, newValue } = req.body;

        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        let students = await readFileContent(filePath);

        // 如果不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如果文件已存在则直接写
        if (!Array.isArray(students)) {
            students = [];
        }

        // 确保学生信息存在,如果不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如果文件
        const studentIndex = students.findIndex(student => student.stu_name === stu_name && student.stu_num === stu_num);

        if (studentIndex !== -1) {
            // 修改学生信息,如果学生信息不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如
            students[studentIndex][selectedProperty] = newValue;

            // 对学生数组进行排序,按照学号进行排序
            await writeToFile(filePath, students);

            res.status(200).json({ message: '学生信息修改成功', modifiedStudent: students[studentIndex] });
        } else {
            res.status(404).json({ message: '未找到学生' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// 查询学生信息
app.get('/getStudents', async (req, res) => {
    try {
        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        let students = await readFileContentWithFallback(filePath);

        const { queryType, queryValue } = req.query;

        if (queryType && queryValue) {
            // Perform the specified query based on the queryType
            switch (queryType) {
                case 'name':
                case 'stuNum':
                case 'roomNum':
                    // 先排序
                    students = bubbleSortByStuNum(students);
                    // 执行二分查找
                    const index = binarySearch(students, queryValue, queryType);
                    if (index !== -1) {
                        res.status(200).json(students[index]);
                        return;
                    } else {
                        res.status(404).json({ message: '未找到匹配的学生' });
                        return;
                    }
                default:
                    res.status(400).json({ message: 'Invalid query type' });
                    return;
            }
        }

        // Log the parsed students for debugging
        console.log('Parsed Students:', students);

        res.status(200).json(students);
    } catch (error) {
        console.error('Error reading student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 删除学生信息,如果学生信息不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据
app.post('/deleteStudent', async (req, res) => {
    try {
        const { stu_name, stu_num } = req.body;

        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        let students = await readFileContent(filePath);

        // 确保学生存在
        if (!Array.isArray(students)) {
            students = [];
        }

        // 找到对应学生
        const studentIndex = students.findIndex(student => student.stu_name === stu_name && student.stu_num === stu_num);

        if (studentIndex !== -1) {
            // Remove the student from the array and extract the deleted student
            const deletedStudent = students.splice(studentIndex, 1)[0];

            // Write the modified array back to the file
            await writeToFile(filePath, students);

            // Respond with success and the deleted student
            res.status(200).json({ message: '学生信息删除成功', deletedStudent });
        } else {
            // Respond with a 404 status if the student was not found
            res.status(404).json({ message: '未找到学生' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 获取所有学生信息,如果不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如果文件已存�
app.get('/getStudentsFromFile', async (req, res) => {
    try {
        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        const fileContent = await readFile(filePath, 'utf-8');
        const students = JSON.parse(fileContent);

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '网络错误' });
    }
});

// 确保文件存在
async function ensureDirectoryExists(directoryPath) {
    try {
        await mkdir(directoryPath, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${directoryPath}:`, error);
        throw error;
    }
}

// 如果不存在则创建一个文件来读取,如果文件不存在则创建文件并写入数据,如果文件已存在则直接写
async function readFileContent1(filePath) {
    try {
        const fileContent = await readFile(filePath, 'utf-8');
        return fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (error) {
        // 处理由于文件不存在导致的问题
        if (error.code === 'ENOENT') {
            // 创建文件
            await writeToFile(filePath, []);
            // 回到空数组
            return [];
        }

        console.error(`无法读取文件 ${filePath}:`, error);
        throw error;
    }
}

// 用冒泡法对学生数组进行排序,按照学号进行排序
function bubbleSortByStuNum(students) {
    const n = students.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (students[j].stu_num.localeCompare(students[j + 1].stu_num, undefined, { numeric: true, sensitivity: 'base' }) > 0) {
                // Swap the elements if they are in the wrong order
                const temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
            }
        }
    }
    return students;
}

async function readFileContentWithFallback(filePath) {
    try {
        const fileContent = await readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
    }
}

// 在 bubbleSortByStuNum 函数后添加这个函数
function binarySearch(students, key, searchProperty) {
    let low = 0;
    let high = students.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const currentStudent = students[mid];

        if (currentStudent[searchProperty] === key) {
            return mid; // 返回匹配的索引
        } else if (currentStudent[searchProperty] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1; // 没有找到
}


app.listen(PORT, () => {
    console.log(`服务器开启在:http://localhost:${PORT}`);
});
