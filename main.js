const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(express.json())

function read(path) {
    const data = fs.readFileSync(path, 'utf-8')
    return JSON.parse(data)
}

function write(path, data) {
    data = JSON.stringify(data)
    fs.writeFileSync(path, data)
}

const filePath = path.join(__dirname, '/users.json')
//1 http://localhost:3000/user
app.post('/user', (req, res) => {
    const { name, age, email } = req.body;
    const data = read(filePath);
    for (const user of data.users) {
        if (user.email === email) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
    }
    const id = data.users.length + 1;
    data.users.push({ id, name, age, email });
    write(filePath, data);
    res.status(201).json({
        message: "User added successfully"
    });
});
//2 http://localhost:3000/user/:id
app.patch('/user/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = req.body;
    const data = read(filePath);

    const userIndex = data.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User ID not found"
        });
    }
    Object.assign(data.users[userIndex], user);
    write(filePath, data);
    res.status(200).json({
        message: "User updated successfully"
    });
});
//3 http://localhost:3000/user/:id
app.delete('/user/:id', (req, res) => {
    const id = Number(req.params.id);

    try {
        let users = read(filePath);

        let user = users.users.find(user => user.id === id);

        if (user) {
            users.users = users.users.filter(u => u !== user);

            write(filePath, users);

            return res.status(200).json({
                message: "User deleted successfully",
                users: users.users
            });
        } else {
            return res.status(404).json({
                message: "User ID not found"
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: "Error"
        });
    }

});

//4 http://localhost:3000/user/getByName?name=John
app.get('/user/getByName', (req, res) => {
    const name = req.query.name;
    const data = read(filePath);

    const users = data.users.filter(user => user.name === name);

    if (!users) {
        return res.status(400).json({ message: "User name not found" });
    }
    res.status(200).json({ users });

});

//5 http://localhost:3000/users
app.get('/users', (req, res) => {
    const data = read(filePath);
    // console.log(data);
    res.status(200).json({ users: data.users });
});



//6 http://localhost:3000/user/minAge=:age
app.get('/user/minAge=:age', (req, res) => {
    const minAge = parseInt(req.params.age);
    const data = read(filePath);
    const users = data.users.filter(user => user.age >= minAge);
    if (!users) {
        return res.status(400).json({ message: "No users found" });
    }
    res.status(200).json({ users });
});

//7 http://localhost:3000/user/:id
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = read(filePath);
    const user = data.users.find(user => user.id === id);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ user });

})
app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
})