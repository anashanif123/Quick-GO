const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainModel.hashpassword(password);

    // Fix: Ensure correct variable names (firstname, lastname)
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        vehicleType: vehicle.vehicleType,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
    });

    const token = captain.generateAuthToken();
    res.status(201).json({ captain, token });
};
