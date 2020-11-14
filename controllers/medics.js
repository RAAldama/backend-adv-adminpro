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

const updateMedic = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const medic = await Medic.findById(id);

        if(!medic){
            return res.status(404).json({
                ok: false,
                msg: 'Ningún médico existe con ese id'
            })
        }

        const medicChanges = {
            ...req.body,
            user: uid
        }

        const updatedMedic = await Medic.findByIdAndUpdate(id, medicChanges, {new: true});

        res.json({
            ok: true,
            medic: updatedMedic
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

const deleteMedic = async(req, res = response) => {
    const id = req.params.id;

    try {
        const medic = await Medic.findById(id);

        if(!medic){
            return res.status(404).json({
                ok: false,
                msg: 'Ningún médico existe con ese id'
            })
        }

        await Medic.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

module.exports = {
    getMedics,
    createMedic,
    updateMedic,
    deleteMedic
}