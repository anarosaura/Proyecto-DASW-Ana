const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userController = require("./controllers/UserController");
const doctorController = require("./controllers/DoctorController");
const commentController = require("./controllers/CommentController");
const appointmentController = require("./controllers/AppointmentController");
const medicalhistoryController = require("./controllers/MedicalHistoryController");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const mongoose = require("mongoose");
const uri = "mongodb+srv://medical_admin:5UUxV5uwNHp4n3Pm@cluster0.wt5joqu.mongodb.net/";
const dbName = "ProyectoDASW";
// upload files
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Obtener el ID del usuario del cuerpo de la solicitud (req.body.userId)
        const userId = req.body.userId;

        if (!userId) {
            return cb(new Error('El ID del usuario no está definido.'));
        }

        // Crear la ruta de destino basada en el ID del usuario
        const userUploadsPath = path.join(__dirname, '../../public/uploads', String(userId));
        try {
            // Intentar crear la carpeta de manera síncrona
            fs.mkdirSync(userUploadsPath, { recursive: true });
        } catch (error) {
            console.error('Error al crear el directorio:', error);
        }
        

        cb(null, userUploadsPath);
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId;
        // Generar un nombre de archivo único (puedes usar una lógica diferente según tus necesidades)
        const uniqueFileName = userId;

        // Usar el nombre de archivo único
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) =>{
    const isValid = file.mimetype.startsWith('image/');
    cb(null, isValid);
}

const uploadMiddleware = multer({storage, fileFilter});
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conectado a la base de datos:", dbName);
});

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app
    .route("/User/:userId")
    .delete(userController.deleteUser)
    .get(userController.getUserById);

app
    .route("/User")
    .get(userController.listAllUsers)
    .post(userController.createNewUser)
    .put(userController.editUser);


app
    .route("/Doctor/:doctorId")
    .delete(doctorController.deleteDoctor)
    .get(doctorController.getDoctorById);

app
    .route("/Doctor")
    .get(doctorController.listAllDoctors)
    .post(doctorController.createNewDoctor)
    .put(doctorController.editDoctor);

app
    .route('/Doctor/specialty/:specialty')
    .get(doctorController.listDoctorsBySpecialty);

app
    .route("/Comment/:commentId")
    .delete(commentController.deleteComment)
    .get(commentController.getCommentById);

app
    .route("/Comment")
    .get(commentController.listAllComments)
    .post(commentController.createNewComment)
    .put(commentController.editComment);

app
    .route("/Appointment/:appointmentId")
    .delete(appointmentController.deleteAppointment)
    .put(appointmentController.editAppointment)
    .get(appointmentController.getAppointmentById);
app
    .route("/Appointment")
    .get(appointmentController.listAllAppointments)
    .post(appointmentController.createNewAppointment);

app
    .route("/Appointment/patient/:patientId")
    .get(appointmentController.getAppointmentsByPatientId);


app
    .route("/Appointment/doctor/:doctorId")
    .get(appointmentController.getAppointmentsByDoctorId); 
/*app
    .route("/MedicalHistory/:medicalhistoryId")
    .delete(medicalhistoryController.deleteMedicalHistory)
    .get(medicalhistoryController.getMedicalHistoryById);*/
app
    .route("/MedicalHistory")
    .get(medicalhistoryController.listAllMedicalHistories)
    .post(medicalhistoryController.createNewMedicalHistory)
    .put(medicalhistoryController.editMedicalHistory);

app
    .route("/MedicalHistory/:userId")
    .get(medicalhistoryController.getMedicalHistoryByUserId);

// Middleware para verificar tokens
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.error("Token no proporcionado");
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    // Dividir la cadena de encabezado de autorización para obtener solo el token
    const token = authHeader.split(' ')[1];

    console.log("Token recibido en la solicitud:", token);

    jwt.verify(token, "tu_secreto", (err, user) => {
        if (err) {
            console.error("Error al verificar el token:", err);
            return res.status(403).json({ message: "Token no válido" });
        }

        req.user = user;
        next();
    });
}

// Upload files
app.post('/upload', uploadMiddleware.single('archivo'), (req, res) => {
    try {
        console.log('File:', req.file);
        if (req.file) {
            console.log('body: ', req.body);
            const imgArray = req.file.path.split('/');
            // Enviar el nombre del archivo como respuesta
            res.send(req.file.filename);

        } else {
            res.status(400).send('invalid format');
        }
    } catch (error) {
        console.error("Error al procesar la carga de archivos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'public', 'uploads')));

app.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar en la colección User
        const user = await User.findOne({ email, password }).exec();

        // Si no se encuentra en la colección User, buscar en la colección Doctor
        if (!user) {
            const doctor = await Doctor.findOne({ email, password }).exec();

            if (!doctor) {
                // Ningún usuario ni doctor encontrado
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            // Usuario encontrado en la colección Doctor
            const token = jwt.sign({ email, userId: doctor._id, userType: 'doctor' }, "tu_secreto", {
                expiresIn: "1h",
            });

            // Imprime el token en la consola para verificar
            console.log("Token generado para doctor:", token);

            // Enviar la URL de redirección en la respuesta JSON
            return res.json({ token, redirect: '../../public/pages/doctors/index_doctor.html' });
        }

        // Usuario encontrado en la colección User
        const token = jwt.sign({ email, userId: user._id, userType: 'user' }, "tu_secreto", {
            expiresIn: "1h",
        });

        // Imprime el token en la consola para verificar
        console.log("Token generado para usuario:", token);

        // Enviar la URL de redirección en la respuesta JSON
        res.json({ token, redirect: '../../public/pages/users/index_user.html' });
    } catch (error) {
        console.error("Error al autenticar:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Rutas protegidas con el middleware de verificación
app.use("/User", verifyToken);
app.use("/Doctor", verifyToken);
app.use("/Comment", verifyToken);
app.use("/Appointment", verifyToken);
app.use("/MedicalHistory", verifyToken);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
