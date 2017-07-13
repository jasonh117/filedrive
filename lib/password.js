const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.hashPassword = password => bcrypt.hashSync(password, saltRounds);

exports.comparePassword = (pw1, pw2) => bcrypt.compareSync(pw1, pw2);
