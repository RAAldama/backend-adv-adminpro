const { response } = require("express");
const Hospital = require("../models/hospital");

const getHospitals = async(req, res = response) => {
    const hospitals = await Hospital.find().populate('user','name img');

    res.json({
        ok: true,
        hospitals
    })
}

const createHospial = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({user: uid, ...req.body});

    try {

        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

const updateHospital = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospital = await Hospital.findById(id);

        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Ningún hospital existe con ese id'
            })
        }

        const hospitalChanges = {
            ...req.body,
            user: uid
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(id, hospitalChanges, {new: true});

        res.json({
            ok: true,
            hospital: updatedHospital
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

const deleteHospital = async(req, res = response) => {
    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id);

        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Ningún hospital existe con ese id'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitals,
    createHospial,
    updateHospital,
    deleteHospital
}