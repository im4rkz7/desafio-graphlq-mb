import { config } from "dotenv";

config();

export const mongoConnection = process.env.CONNECTION_STRING_MONGO;
export const sessionConnection = process.env.CONNECTION_STRING_SESSION;
export const firebaseConnection = process.env.CONNECTION_URL_FIREBASE;
export const secretSession = process.env.SECRET_SESSION;
export const persistence = process.env.PERSISTENCE;
export const nodeEnv = process.env.NODEENV;
