const express = require('express');
const { signup, login, myTodo, allTodo, todoById, todoSearch, todoUpdate, todoDelete, deleteUser } = require('../controller/todo.controller');
const isAuth = require('../config/auth')
const router = express.Router();


router.post("/signup", signup);
router.post('/login', login);
router.post('/mytodo', isAuth, myTodo);
router.get('/all-todo', isAuth, allTodo);
router.get('/todoid/:id', isAuth, todoById);
router.get('/todo-search', isAuth, todoSearch);
router.put('/todo-update/:id', isAuth, todoUpdate);
router.delete('/todo-delete/:id', isAuth, todoDelete);
router.delete('/delete-user/:id', isAuth, deleteUser);







module.exports = router