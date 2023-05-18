import dotenv from "dotenv";
dotenv.config();

module.exports = {
	SECRET_KEY: process.env.SECRET_KEY,
};
