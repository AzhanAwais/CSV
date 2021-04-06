const express = require('express');
const app = express();
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Age:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        required:true
    }
});

const Data = new mongoose.model('Data',dataSchema);
module.exports =  Data;
