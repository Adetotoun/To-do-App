const User = require('../models/user.models');
const Todo = require('../models/todo.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const signup = async (req,res) => {
    const {name,email,password} = req.body;
    try {
       if(name == "" || email == "" || password ==""){
        return res.status(400).json({message: "All fields required"});
       }
       const existingUser = await User.findOne({email})
       if(existingUser){
        return res.status(400).json({message: "User already exist"})
       }

       const hashedPassword = await bcrypt.hash(password,10);

       const newSignup = new User({
            name,
            email,
            password: hashedPassword
       });

       await newSignup.save();
       return res.status(201).json(`${name} Signup successful`);
    } catch (error) {
        console.error("Error signing up", error);
        return res.status(500).json("Internal server error");
    }
}

const login = async (req,res) => {
    const {email,password} = req.body;
    try {
        if(email =="" || password == ""){
            return res.status(400).json({message: "All fields are reqquired"});
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json("User not found");
            }
        
        const comparePassword = await bcrypt.compare(password, user.password);

        if(!comparePassword){
            return res.status(404).json("Invalid Credentials");
        }

        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "24hr"});

        return res.status(200).json({message: "login successful", token});
        }catch (error) {
        console.error('Error during login', error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const myTodo = async (req,res) => {
    const {title,description}=req.body;
    const {userId} = req.user;
    try {
        if(title =="" || description ==""){
            return res.status(400).json("All fields required");
        }
        const idUser = await User.findById(userId);
        const userTodo = new Todo({
            title,
            description,
            user: idUser
        });

        await userTodo.save();
        return res.status(201).json({message: "To-do list created successfuly!", userTodo});
    } catch (error) {
        console.error("Error creating To-do list", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const allTodo = async (req,res) => {
    const {userId} = req.user;
    try{
    const todos = await Todo.find({ user: userId });
    return res.status(200).json({todos, count: todos.length});    
  } catch (error) {
    console.error("Error getting all to-do lists", error)
    res.status(500).json({ message: "Internal Server error" });
  }
}

const todoById = async (req, res) => {
    const {id} = req.params;
    const {userId} = req.user;
    try{
    const todo =await Todo.findOne({
        _id: id,
        user: userId
    });

    if (!todo) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(todo);
  } catch (error) {
    console.error("Error searching to-do",error);
    return res.status(500).json({ message: " Internal Server error" });
  }
}

const todoSearch = async (req,res) => {
    const {title} = req.query;
    const {userId} = req.user;
    try {
        const todo =await Todo.findOne({
        title,
        user: userId
    });

    if (!todo) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json(todo);
    } catch (error) {
        console.error("Error searching to-do",error);
        return res.status(500).json({ message: " Internal Server error" });
    }
}

const todoUpdate = async (req,res) => {
    const {id} = req.params;
    const {userId} = req.user;
    const{title, description, completed} = req.body;
    try{
        const update = await Todo.findOneAndUpdate(
            {_id: id, user: userId},
            {title,description,completed},
            {new: true}
        )
        if(!update){
            return res.status(404).json({message: "Unauthorized update"});
        }
        return res.status(200).json({message: "To-do updated successfully", update});
    }catch(error){
        console.error("Error updating to-do",error)
        return res.status(500).json({ message: " Internal Server error" });
    }
}



const todoDelete = async (req,res) => {
    const {id} =  req.params;
    const {userId} = req.user;
    try {
        const ownTodo = await Todo.findOneAndDelete({
            _id: id,
            user: userId
        });

        if(!ownTodo){
            return res.status(404).json("Aunothorised delete");
        }

        return res.status(200).json({message: "To-do deleted successfully", ownTodo});
    } catch (error){
        console.error("Error deleting to-do",error)
        return res.status(500).json({ message: " Internal Server error" });
    }
    
}

const deleteUser = async (req,res) => {
    const {userId} = req.user;
    const {id} = req.params;
    try {
    const adminUser = await User.findById(userId)
    if(adminUser.role !== "admin"){
        return res.status(404).json({message: "Access denied"});
    }
    const userDelete = await User.findByIdAndDelete(id);
    if(!userDelete){
        return res.status(400).json({message: "User not found"});
    }
    return res.status(200).json({message: "User deleted successfully!", userDelete});
    } catch (error) {
        console.error("Error deleting user",error)
        return res.status(500).json({ message: " Internal Server error" });
    }
}


module.exports = {
    signup,
    login,
    myTodo,
    allTodo,
    todoById,
    todoSearch,
    todoUpdate,
    todoDelete,
    deleteUser
};