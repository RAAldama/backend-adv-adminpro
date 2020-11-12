const { response } = require("express");
const Medic = require('../models/medics');

const getMedics = async(req, res = response) => {
    const medics = await Medic.find().populate('user','name img').populate('hospital','name img');

    res.json({
        ok: true,
        medics
    })
}

const createMedic = async(req, res = response) => {
    const uid = req.uid;
    const medic = new Medic({user: uid, ...req.body});

    try {
        const medicDB = await medic.save();

        res.json({
            ok: true,
            medic: medicDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

const updateMedic = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Update Medic'
    })
}

const deleteMedic = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Borrar Medico'
    })
}

module.exports = {
    getMedics,
    createMedic,
    updateMedic,
    deleteMedic
}