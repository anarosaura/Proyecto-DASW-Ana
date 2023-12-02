const mongoose = require('mongoose');
const MedicalHistory = require("../../models/MedicalHistory");
const ObjectId = mongoose.Types.ObjectId;

exports.listAllMedicalHistories = async (req, res) => {
  try {
    const medicalhistories = await MedicalHistory.find({});
    res.status(200).json(medicalhistories);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewMedicalHistory = async (req, res) => {
  if (typeof req.body.patient !== 'string') {
    return res.status(400).json({ message: 'El campo "patient" debe ser una cadena.' });
  }

  const newMedicalHistory = new MedicalHistory(req.body);

  try {
    const medicalhistory = await newMedicalHistory.save();
    res.status(201).json(medicalhistory);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.editMedicalHistory = async (req, res) => {
  try {
    const medicalhistoryId = req.params.medicalhistoryId;
    const updatedMedicalHistory = req.body;
    const medicalhistory = await MedicalHistory.findByIdAndUpdate(medicalhistoryId, updatedMedicalHistory, { new: true });
    if (!medicalhistory) {
      return res.status(404).json({ message: 'Historia Médica no encontrado' });
    }
    res.status(200).json(medicalhistory);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteMedicalHistory = async (req, res) => {
  try {
    const medicalhistoryId = req.params.medicalhistoryId;
    const medicalhistory = await MedicalHistory.findByIdAndRemove(medicalhistoryId);
    if (!medicalhistory) {
      return res.status(404).json({ message: 'Historia Médica no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getMedicalHistoryById = async (req, res) => {
  try {
    const medicalhistoryId = req.params.medicalhistoryId;
    const medicalhistory = await MedicalHistory.findById(medicalhistoryId);
    if (!medicalhistory) {
      return res.status(404).json({ message: 'Historia Médica no encontrado' });
    }
    res.status(200).json(medicalhistory);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getMedicalHistoryByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Convierte el ID a String
    const userIdString = userId.toString();

    // Busca todos los historiales médicos relacionados con el ID del usuario en el campo 'patient'
    const medicalHistory = await MedicalHistory.find({ patient: userIdString });

    if (!medicalHistory || medicalHistory.length === 0) {
      return res.status(404).json({ message: 'Historial médico no encontrado para el usuario con ID ' + userId });
    }

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error('Error al buscar historial médico por ID de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

