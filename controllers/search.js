//getAll

const { response } = require("express");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Medic = require('../models/medics');

const getAll = async(req, res=response) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    /*
    const users = await User.find({name: regex});
    const hospitals = await Hospital.find({name: regex});
    const medics = await Medic.find({name: regex});
    */

    const [users, hospitals, medics] = await Promise.all([
        User.find({name: regex}),
        Hospital.find({name: regex}),
        Medic.find({name: regex})
    ]);

    res.json({
        ok: true,
        users,
        hospitals,
        medics
    });
}

const getDocumentsCollection = async(req, res=response) => {
    const table = req.params.table;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    let data = [];

    switch (table) {
        case 'users':    
            data = await User.find({name: regex});
            break;

        case 'hospitals':
            data = await Hospital.find({name: regex}).populate('user','name img');
            break;

        case 'medics':
            data = await Medic.find({name: regex}).populate('user','name img').populate('hospital','name img');
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Debe de ser una tabla registrada en la base de datos'
            });  
          
    }

    res.json({
        ok: true,
        results: data
    });
}

module.exports = {
    getAll,
    getDocumentsCollection
}