const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require("../helpers/update-Image");

const fileUpload = (req, res=response) => {
    const type = req.params.type;
    const id = req.params.id;

    //Revisar que sea un tipo de colección valida a la cuál subir
    const validTypes = ['users','hospitals','medics'];
    if(!validTypes.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'Tipo seleccionado no es válido'
        })
    }

    //Revisar que se haya un archivo que se quiera subir (usa middleware de expressFileUpload)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subió ningún archivo'
        })
    }

    //Conseguir el archivo
    const file = req.files.image;

    //Conseguir la extensión del archivo
    const splitedName = file.name.split('.');
    const extension = splitedName[splitedName.length - 1];

    //Validar que el archivo sea una extensión válida
    const validExtensions = ['png','jpg','jpeg','gif','pdf'];
    if(!validExtensions.includes(extension)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión válida'
        })
    }

    //Generar nuevo nombre del archivo para poder subirse (usa npm uuid)
    const fileName = `${uuidv4()}.${extension}`;

    //Crear el camino y subir la imagen a dicho camino
    const path = `./uploads/${type}/${fileName}`;

    file.mv(path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imágen'
            });
        }

        //Actualizar base de datos (usa helpers)
        updateImage(type, id, fileName);
    
        res.json({
            ok: true,
            fileName,
            msg: 'Archivo se ha subido'
        })
    });
}

const returnImage = (req, res=response) => {
    const type = req.params.type;
    const image = req.params.image;

    const pathImg = path.join(__dirname, `../uploads/${type}/${image}`);

    //Imagen por defecto (usa fs de node)
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, '../uploads/no-img.jpg');
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    returnImage
}