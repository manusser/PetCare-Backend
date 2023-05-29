import { Request, Response, Router } from "express";
import { Error } from "mongoose";
import { IService } from "../models/Service";
import Service from "../models/Service";

const router: Router = Router();

// Ruta para obtener todos los servicios
router.get("/", (req: Request, res: Response) => {
	Service.find({})
		.then((services: IService[]) => {
			res.json(services);
		})
		.catch((err: Error) => {
			res.status(500).json({ error: err.message });
		});
});

// Ruta para obtener un servicio por su ID
router.get("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	const service = await Service.findById(id).exec();

	if (!service) {
		return res.status(404).json({ message: "Servicio no encontrado" });
	}

	res.json(service);
});

// Ruta para crear un nuevo servicio
router.post("/", (req: Request, res: Response) => {
	const { name, description, price, user } = req.body;
	const newService: IService = new Service({
		name,
		description,
		price,
		user,
	});

	newService
		.save()
		.then((service: IService) => {
			res.status(201).json(service);
		})
		.catch((err: Error) => {
			res.status(500).json({ error: err.message });
		});
});

// Ruta para actualizar un servicio existente
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const updatedService = req.body;

	Service.findByIdAndUpdate(
		id,
		updatedService,
		(err: Error, service: IService) => {
			if (err) {
				res.status(500).json({ error: err.message });
			} else if (!service) {
				res.status(404).json({ message: "Servicio no encontrado" });
			} else {
				res.json(service);
			}
		}
	);
});

// Ruta para eliminar un servicio
router.delete("/:id", (req: Request, res: Response) => {
	Service.findByIdAndRemove(req.params.id, (err: Error, service: IService) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else if (!service) {
			res.status(404).json({ message: "Servicio no encontrado" });
		} else {
			res.json({ message: "Servicio eliminado correctamente" });
		}
	});
});

export default router;
