const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Role = require('../models/role');


router.get('/', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    let vars = {cPage: "settings", searchOptions: req.query};
    vars.title = "Settings";
    
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }

    vars.adminName = process.env.ADMIN_NAME;

    const roles = await Role.find();
    vars.roles = roles;


    res.render('settings/index', vars);
});

//get roles
router.get('/roles_List', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    const list = [];
    const roles = await Role.find({}, 'name');
    for(const i in roles) {
        const users = await User.find({roles: roles[i]._id}, 'username');
        list.push({name: roles[i].name, users: users});
    }

    res.send({roles: list});
});

//add role
router.post('/roles_List', checkAuthenticatedAccess, checkIsAdmin, validateRoleName, async (req, res) => {
    //check if role exists
    let role = await Role.findOne({name: new RegExp(req.body.roleName, "i")});
    if(role) return res.send({res: 'Error', msg: 'Role already exists'});

    //if not, create role
    role = new Role({
        name: req.body.roleName
    });
    await role.save();
    res.send({res: 'Success', msg: 'Role created'});
});

//edit role
router.put('/roles_List', checkAuthenticatedAccess, checkIsAdmin, validateRoleName, async (req, res) => {
    //check if role exists
    let role = await Role.findOne({name: new RegExp(req.body.oldRoleName, "i")});
    if(!role) return res.send({res: 'Error', msg: 'Role does not exists'});

    //if it does, edit it (only if roleName isn't equal to new roleName)
    if(role.name !== req.body.roleName) {
        role.name = req.body.roleName;
        await role.save();
    }
    res.send({res: 'Success', msg: 'Role edited'});
});

//delete role
router.delete('/roles_List', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    //check if role exists
    const role = await Role.findOne({name: new RegExp(req.body.roleName, "i")});
    if(!role) return res.send({res: 'Error', msg: 'Role does not exist'});

    //if it does, remove it
    await role.remove();
    res.send({res: 'Success', msg: 'Role deleted'});
});

router.put('/api/update_last_seen', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    const passkey = req.body.passkey? req.body.passkey : "pass";
    try {
        if(await bcrypt.compare(passkey, process.env.ADMIN_KEY)) {
            async function updateLastSeen() {
                let msg = '';
                const users = await User.find({lastSeen: null}, 'username lastSeen updatedAt');
                users.forEach(async user => {
                    msg += `${user.username}&NewLine;`;
                    user.lastSeen = user.updatedAt;
                    await user.save();
                });
                return msg;
            }
            const msg = await updateLastSeen();
            res.send({res: 'Success', msg: `Success:&NewLine;${msg}`});
        } else {
            res.send({res: 'Error', msg: 'Access Denied.'})
        }
    } catch (e) {
        res.send({res: 'Error', msg: 'Error Occurred.'});
        console.log("Message:", e.message);
    }
});

router.delete('/api/reset_user_roles', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    if(await bcrypt.compare(req.body.passkey, process.env.ADMIN_KEY)) {
        async function resetUserRoles() {
            const users = await User.find({}, 'roles');
            users.forEach(async user => {
                user.roles = [];
                user.markModified('roles');
                await user.save();
            });
        }
        await resetUserRoles();
        res.send({res: 'Success', msg: 'Roles resetted.'});
    } else {
        res.send({res: 'Error', msg: 'Access Denied.'})
    }
});

router.post('/api/add_role_to_user', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    const roleName = req.body.roleName;
    const userName = req.body.userName;
    try {
        const role = await Role.findOne({name: new RegExp(roleName, "i")}, 'name');
        if(!role) return res.send({res: 'Error', msg: `Role not found: ${roleName}`});
        const user = await User.findOne({username: new RegExp(userName, "i")}, 'roles');
        if(!user) return res.send({res: 'Error', msg: `User not found: ${userName}`});

        const roleExists = user.roles.some(obj => obj.equals(role._id));
        if(roleExists) return res.send({res: 'Error', msg: `${userName} already has role: ${roleName}`});

        //add role now
        user.roles.push(role._id);
        user.markModified('roles');
        await user.save();

        res.send({res: 'Success', msg: `Added role ${roleName} to ${userName}.`});
    } catch (e) {
        res.send({res: 'Error', msg: 'Error Occurred.'});
        console.log("Message:", e.message);
    }
});


//(async()=>console.log(await bcrypt.hash('', 10)))()
// (async()=>{ 
//     const role = await Role.findOne({name: "Mod"}, 'name');
//     const profile = await User.find({roles: role}, 'username');
//     console.log(profile);
// })()

router.delete('/api/remove_role_from_user', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    const roleName = req.body.roleName;
    const userName = req.body.userName;
    try {
        const role = await Role.findOne({name: new RegExp(roleName, "i")}, 'name');
        if(!role) return res.send({res: 'Error', msg: `Role not found: ${roleName}`});
        const user = await User.findOne({username: new RegExp(userName, "i")}, 'roles');
        if(!user) return res.send({res: 'Error', msg: `User not found: ${userName}`});

        const roleExists = user.roles.some(obj => obj.equals(role._id));
        if(!roleExists) return res.send({res: 'Error', msg: `${userName} does not have role: ${roleName}`});

        //remove role now
        const roleIndex = user.roles.indexOf(role._id);
        user.roles.splice(roleIndex, 1);
        user.markModified('roles');
        await user.save();

        res.send({res: 'Success', msg: `Added role ${roleName} to ${userName}.`});
    } catch (e) {
        res.send({res: 'Error', msg: 'Error Occurred.'});
        console.log("Message:", e.message);
    }
});

router.post('/api/add_role_to_all_users', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    if(await bcrypt.compare(req.body.passkey, process.env.ADMIN_KEY)) {
        const roleName = req.body.roleName;
        try {
            const role = await Role.findOne({name: new RegExp(roleName, "i")}, 'name');
            if(!role) return res.send({res: 'Error', msg: `Role not found: ${roleName}`});

            
            async function addRoleToAllUsers() {
                //find all without role
                const usersWithout = await User.find({$nor:[{roles: role._id}]}, 'roles');
                usersWithout.forEach(async user => {
                    //add role to each
                    user.roles.push(role._id);
                    user.markModified('roles');
                    await user.save();
                });
            }
            await addRoleToAllUsers();

            res.send({res: 'Success', msg: `Added role ${roleName} to all users.`});
        } catch (e) {
            res.send({res: 'Error', msg: 'Error Occurred.'});
            console.log("Message:", e.message);
        }
    } else {
        res.send({res: 'Error', msg: 'Access Denied.'})
    }
});

router.delete('/api/remove_role_from_all_users', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    if(await bcrypt.compare(req.body.passkey, process.env.ADMIN_KEY)) {
        const roleName = req.body.roleName;
        try {
            const role = await Role.findOne({name: new RegExp(roleName, "i")}, 'name');
            if(!role) return res.send({res: 'Error', msg: `Role not found: ${roleName}`});

            
            async function removeRoleFromAllUsers() {
                //find all with role
                const usersWith = await User.find({roles: role._id}, 'roles');
                usersWith.forEach(async (user) => {
                    //remove role from each
                    const roleIndex = user.roles.indexOf(role._id);
                    user.roles.splice(roleIndex, 1);
                    user.markModified('roles');
                    await user.save();
                });
            }

            await removeRoleFromAllUsers();

            res.send({res: 'Success', msg: `Removed role ${roleName} from all users.`});
        } catch (e) {
            res.send({res: 'Error', msg: 'Error Occurred.'});
            console.log("Message:", e.message);
        }
    } else {
        res.send({res: 'Error', msg: 'Access Denied.'})
    }
});


router.use('/*', (req, res) => {
    res.redirect('/settings');
})


function validateRoleName(req, res, next) {
    let error = false;

    //roleName validation
    const roleName = req.body.roleName;
    let message = "";
    if(roleName.length < 3 || roleName.length > 15) {
        message += "-Must be 3-15 characters long";
        error = true;
    } else {
        if(roleName.charAt(0).match(/^[a-z]+$/ig) === null) {
            message += "-Role must start with a letter\n";
            error = true;
        } else if(roleName.match(/^[a-z][a-z\d]+$/ig) === null) {
            message += "-Symbols/Spaces not allowed";
            error = true;
        } 
    }

    if (error)
        return res.send({res: 'Error', msg: message});

    next();
}

function checkAuthenticatedAccess(req, res, next) {
    if(!req.isAuthenticated()) { //unauthenticated user
        // req.flash('outsert', {message: 'Access denied.', note: true});
        return res.redirect('/');
    }
    next();
}

async function checkIsAdmin(req, res, next) {
    const isAdmin = req.user.username.toLowerCase() === process.env.ADMIN_NAME;

    if(!isAdmin) { //unauthorized user    
        // req.flash('outsert', {message: 'Access denied.', note: true});
        return res.redirect(`/`);
    }
    next();
}



module.exports = router;