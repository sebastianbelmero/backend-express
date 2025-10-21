import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE as "mysql",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "root",
    database: process.env.DATABASE_NAME || "web_challenge",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
