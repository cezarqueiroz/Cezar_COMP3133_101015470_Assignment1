const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    gender: {type: String, required: false},
    designation: {type: String, required: true},
    salary: {type: Number, required: true, biggerThanOneThousand: true},
    date_of_joining: {type: Date, default: Date.now},
    department: {type: String, required: true},
    employee_photo: {type: String, required: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Employee', employeeSchema);