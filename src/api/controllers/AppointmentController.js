const Appointment = require("../../models/Appointment");

exports.listAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewAppointment = async (req, res) => {
  const newAppointment = new Appointment(req.body);
  try {
    const appointment = await newAppointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.editAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const updatedAppointment = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, updatedAppointment, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrado' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findByIdAndRemove(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrado' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patient: patientId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).send(err);
  }
};