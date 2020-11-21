const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res=response) => {
    const {email, password} = req.body;
    
    try {
        const userDB = await User.findOne({email});

        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, userDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        const token = await generateJWT(userDB.id);

        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        });
    }
}

const googleSignIn = async(req, res=response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const userDB = await User.findOne({email});
        let user;
        if(!userDB){
            user = new User({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            user = userDB;
            user.google = true;
        }

        await user.save();
        const token = await generateJWT(user.id);

        res.status(200).json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Token inválido'
        });
    }

}

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    const token = await generateJWT(uid);

    const user = await User.findById(uid);

    res.status(200).json({
        ok: true,
        token,
        user
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}