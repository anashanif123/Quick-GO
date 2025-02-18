const userModel = require("../models/usermodels");

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !lastname || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = await userModel.create({
        fullname: { firstname, lastname }, // ✅ Fix fullname structure
        email,
        password,
    });

    return user;
};
