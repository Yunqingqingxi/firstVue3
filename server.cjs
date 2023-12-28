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

// 处理根路径的路由
app.get('/', (req, res) => {
    res.send('Welcome to the Student Management System');
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

// Write data to the file without additional stringification
async function writeToFile(filePath, data) {
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2), { flag: 'w' });
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
        throw error;
    }
}

app.post('/addStudent', async (req, res) => {
    try {
        const studentInfo = req.body;
        const filePath = path.join('D:', 'Codefile1', 'student.dat');

        // Ensure the directory exists
        const directoryPath = path.dirname(filePath);
        await ensureDirectoryExists(directoryPath);

        // Read existing students from the file
        let students = await readFileContent(filePath);

        // Add the new student to the array
        students.push(studentInfo);

        // Bubble sort the array by student number
        const sortedStudents = bubbleSortByStuNum(students);

        // Write the sorted array back to the file
        await writeToFile(filePath, sortedStudents);

        res.status(200).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/modifyStudent', async (req, res) => {
    try {
        const { stu_name, stu_num, selectedProperty, newValue } = req.body;

        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        let students = await readFileContent(filePath);

        // Ensure that students is an array
        if (!Array.isArray(students)) {
            students = [];
        }

        // Find the student to modify
        const studentIndex = students.findIndex(student => student.stu_name === stu_name && student.stu_num === stu_num);

        if (studentIndex !== -1) {
            // Modify the selected property
            students[studentIndex][selectedProperty] = newValue;

            // Write the modified array back to the file
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



async function ensureDirectoryExists(directoryPath) {
    try {
        await mkdir(directoryPath, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${directoryPath}:`, error);
        throw error;
    }
}

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

async function readFileContentWithFallback(filePath) {
    try {
        const fileContent = await readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
    }
}

app.get('/getStudents', async (req, res) => {
    try {
        const filePath = path.join('D:', 'Codefile1', 'student.dat');
        const students = await readFileContentWithFallback(filePath);

        // Log the parsed students for debugging
        console.log('Parsed Students:', students);

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Handle modifying student information
// app.post('/modifyStudent', async (req, res) => {
//     try {
//         const { stu_name, stu_num, selectedProperty, newValue } = req.body;
//
//         const filePath = path.join('D:', 'Codefile1', 'student.dat');
//         let students = await readFileContent(filePath);
//
//         // Ensure that students is an array
//         if (!Array.isArray(students)) {
//             students = [];
//         }
//
//         // Find the student to modify
//         const studentIndex = students.findIndex(student => student.stu_name === stu_name && student.stu_num === stu_num);
//
//         if (studentIndex !== -1) {
//             // Modify the selected property
//             students[studentIndex][selectedProperty] = newValue;
//
//             // Write the modified array back to the file
//             await writeFile(filePath, JSON.stringify(students), { flag: 'w' });
//
//             res.status(200).json({ message: 'Student information modified successfully', modifiedStudent: students[studentIndex] });
//         } else {
//             res.status(404).json({ message: 'Student not found' });
//         }
//     } catch (error) {
//         console.error(error);
//
//         // Send a more detailed error response
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });
