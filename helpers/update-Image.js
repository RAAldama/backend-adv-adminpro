const fs = require('fs');
const User = require('../models/user');
const Hospital = require("../models/hospital");
const Medic = require('../models/medics');
const { use } = require('../routes/auth');

const deleteOldImage = (path) => {
    if(fs.existsSync(path)){
        //Eliminar vieja imágen
        fs.unlinkSync(path);
    }
}

const updateImage = async(type, id, fileName) => {
    let oldPath = '';

    switch (type) {
        case 'users':
            //Encontrar médico con ese id
            const user = await User.findById(id);
            if(!user){
                console.log('No se encontró usuario')
                return false;
            }

            //Encontrar si ya tiene una imágen previa (Usa fs de node)
            oldPath = `./uploads/users/${user.img}`
            deleteOldImage(oldPath);

            user.img = fileName;
            await user.save();

            return true;

        case 'hospitals':
            //Encontrar médico con ese id
            const hospital = await Hospital.findById(id);
            if(!hospital){
                console.log('No se encontró hospital')
                return false;
            }

            //Encontrar si ya tiene una imágen previa (Usa fs de node)
            oldPath = `./uploads/hospitals/${hospital.img}`
            deleteOldImage(oldPath);

            hospital.img = fileName;
            await hospital.save();

            return true;

        case 'medics':
            //Encontrar médico con ese id
            const medic = await Medic.findById(id);
            if(!medic){
                console.log('No se encontró médico')
                return false;
            }

            //Encontrar si ya tiene una imágen previa (Usa fs de node)
            oldPath = `./uploads/medics/${medic.img}`
            deleteOldImage(oldPath);

            medic.img = fileName;
            await medic.save();

            return true;
    
        default:
            break;
    }
}

module.exports = {
    updateImage
}