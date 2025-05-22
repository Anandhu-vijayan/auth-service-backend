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

// Define the function to connect to the database
const connectDB = async () => {
  try {
    // Attempt to authenticate with the database
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    // Log the error and exit the process if connection fails
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the application if the database connection fails
  }
};

// Export the connectDB function as the default export
export default connectDB;

// Optionally, export the sequelize instance if you need to use it directly for models
// export { sequelize };