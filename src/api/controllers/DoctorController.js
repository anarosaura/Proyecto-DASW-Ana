const Doctor = require("../../models/Doctor");

exports.listAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewDoctor = async (req, res) => {
  const newDoctor = new Doctor(req.body);
  try {
    const doctor = await newDoctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.editDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const updatedDoctor = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, updatedDoctor, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findByIdAndRemove(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Médico no encontrado.' });
    }

    // Devolver la información del médico, incluyendo el campo 'name'
    res.status(200).json({
      _id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone,
    });
  } catch (err) {
    console.error('Error al obtener médico por ID:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.listDoctorsBySpecialty = async (req, res) => {
  try {
    const specialty = req.params.specialty;
    const doctors = await Doctor.find({ specialty: specialty });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).send(err);
  }
};