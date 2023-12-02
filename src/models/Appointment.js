const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    dateTime: { type: Date, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    specialty: { type: String },
    status: { type: String, default: 'Programada' },
    patientNotes: { type: String },
    doctorNotes: { type: String }
  });

module.exports = mongoose.model('Appointment', appointmentSchema);
