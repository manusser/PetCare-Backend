import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();

const secretKey = process.env.SECRET_KEY;

interface iError {
	field: string;
	message: string;
}

router.get("/:id", async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		return res.json(user);
	} catch (error) {
		console.error("Error al obtener el usuario", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Ruta para registrar un nuevo usuario
router.post("/register", async (req: Request, res: Response) => {
	try {
		const { email, name, password, password_confirmation } = req.body;

		const errors: iError[] = [];

		// Verificar que los campos no estén vacíos
		if (!email || !name || !password || !password_confirmation) {
			errors.push({
				field: "fill_fields_message",
				message: "Por favor, rellene todos los campos.",
			});
			// return res.status(400).json({ message: "Por favor, rellene todos los campos" });
		}

		// Verificar que las contraseñas coincidan
		if (password.length < 8 || password_confirmation.length < 8) {
			errors.push({
				field: "password_length_message",
				message: "La contraseña debe tener al menos 8 caracteres.",
			});
			errors.push({
				field: "confirm_password_message",
				message: "Las contraseñas no coinciden.",
			});
			// return res.status(400).json({ message: "Las contraseñas no coinciden" });
		} else {
			// Verificar que las contraseñas coincidan
			if (password !== password_confirmation) {
				errors.push({
					field: "confirm_password_message",
					message: "Las contraseñas no coinciden.",
				});
			}
		}

		// Verificar si el usuario ya existe en la base de datos
		const existingEmail = await User.findOne({ email: email });
		if (existingEmail || email.length <= 0) {
			errors.push({
				field: "email_message",
				message: "El email ya existe o no es válido.",
			});
			// return res.status(409).json({ message: "El email ya existe" });
		}

		// Crear una nueva instancia del modelo User
		const newUser: IUser = new User({
			email: email,
			name: name,
			password: await bcrypt.hash(password, 10), // Hash de la contraseña antes de guardarla
		});

		// Verificar si hay errores

		if (errors.length > 0) {
			return res.status(400).json({ errors: errors });
		} else {
			// Guardar el usuario en la base de datos
			await newUser.save();

			res.status(201).json({
				registered: true,
				message: "Usuario registrado exitosamente.",
			});
		}
	} catch (error) {
		console.error("Error al registrar usuario:", error);
		res
			.status(500)
			.json({ registered: false, message: "Error al registrar usuario." });
	}
});

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Verificar si el usuario existe en la base de datos
		const user: IUser | null = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Credenciales inválidas" });
		}

		// Verificar la contraseña
		const isPasswordValid: boolean = await bcrypt.compare(
			password,
			user.password
		);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Credenciales inválidas" });
		}

		// Generar un token JWT
		if (secretKey) {
			const token: string = jwt.sign(
				{id: user.id, email: user.email, name: user.name },
				secretKey,
				{
					expiresIn: "7d",
				}
			);
			res.status(200).json({ token });
		} else {
			res.status(500).json({ message: "Error al iniciar sesión" });
		}
	} catch (error) {
		console.error("Error al iniciar sesión:", error);
		res.status(500).json({ message: "Error al iniciar sesión" });
	}
});

export default router;
