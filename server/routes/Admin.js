const express = require('express');
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");

router.get('/test', expressAsyncHandler(async (req, res) => {
    try {
      const admin = await AdminModel.find();
      console.log(admin)
      res.json(admin);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }));