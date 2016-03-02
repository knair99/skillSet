/**
 * Created by kprasad on 3/1/16.
 */


var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    title: String,
    phone: String,
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }]
});

mongoose.model('Employees', EmployeeSchema);