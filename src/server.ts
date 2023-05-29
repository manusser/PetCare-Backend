import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// Conexión a la base de datos MongoDB
mongoose
	.connect(
		"mongodb+srv://vercel-admin-user:PC9YMaNHrTelZ4rx@cluster0.is8j17j.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("Conexión exitosa a MongoDB");
	})
	.catch((error) => {
		console.error("Error al conectar a MongoDB:", error);
	});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);

app.use("/", (req, res) => {
	res.send("Bienvenido a PetCare");
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});

module.exports = app;
