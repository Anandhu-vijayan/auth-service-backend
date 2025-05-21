// config/database.js
import { Sequelize } from 'sequelize'; // Make sure you have sequelize installed
import pg from 'pg';
console.log("DB Config:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
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