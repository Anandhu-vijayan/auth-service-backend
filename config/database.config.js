import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import pg from 'pg'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') })
} else {
  dotenv.config()
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectModule: pg,
    logging: console.log,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default connectDB;
export { sequelize };