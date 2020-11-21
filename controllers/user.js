const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {
    const from = Number(req.query.from) || 0;

    /*
    const users = await User.find({}, 'name email role google').skip(from).limit(5);
    const total = await User.count();
    */

    const [users, total] = await Promise.all([
        User.find({}, 'name email role google img').skip(from).limit(5),
        User.countDocuments()
    ])

    res.json({
        ok: true,
        users,
        total
    });
}

const createUser = async(req, res = response) => {
    const {password, email} = req.body;

    try {
        const emailExists = await User.findOne({email});

        if(emailExists){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }

        const user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }

}

const updateUser = async(req, res=response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);
        
        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario en la base de datos con es ID'
            })
        }

        const {password, google, email, ...fields} = req.body;

        if(userDB.email !== email){
            const emailExists = await User.findOne({email});

            if(emailExists){
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya se encuentra registrado'
                })
            }
        }

        if(!userDB.google){
            fields.email = email;
        }else if(userDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar el correo'
            })
        }
        const updatedUser = await User.findByIdAndUpdate(uid, fields, {new: true});

        res.json({
            ok: true,
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        })
    }
}

const deleteUser = async(req, res=response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);
        
        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario en la base de datos con es ID'
            })
        }

        await User.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar consola'
        });
    }

}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};