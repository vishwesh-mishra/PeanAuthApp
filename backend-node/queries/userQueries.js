const pgPool = require('pg').Pool;
const bcrypt = require('bcryptjs');
const config = require('../configurations/config');

// Connect to database
const dbPool = new pgPool(config.db);

// Check any connection error
dbPool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
});

const getUserById = function(id, callback){
    const queryText = 'Select * from users where id=$1';
    dbPool.query(queryText, [id], (err, results) => {
        callback(err, results.rows[0]);
    });
}

const getUserByUsername = function(username, callback){
    const queryText = 'Select * from users where username=$1';
    dbPool.query(queryText, [username], (err, results) => {
        callback(err, results.rows[0]);
    });
}

const addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            const queryText = 'Insert into public.users (name, email, username, password) values ($1, $2, $3, $4)';
            const values = [newUser.name, newUser.email, newUser.username, newUser.password];
            dbPool.query(queryText, values, (err, results) => {
                callback(err, newUser);
            });
        });
    });
}

const comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

const updatePassword = function(user, newPassword, callback){
    const username = user.username;
    const email = user.email;
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(newPassword, salt, (err, hash) => {
            if(err) throw err;
            const queryText = 'Update users set password=$1 where username=$2 and email=$3';
            const values = [hash, username, email];
            dbPool.query(queryText, values, (err, results) => {
                callback(err, results);
            });
        });
    });

}

module.exports = {
    getUserById,
    getUserByUsername,
    addUser,
    comparePassword,
    updatePassword
};