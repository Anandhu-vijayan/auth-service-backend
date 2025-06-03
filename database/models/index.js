import { sequelize } from '../../config/database.config.js'; // Import the singleton instance
import { DataTypes } from 'sequelize';
import userModel from './user.model.js';
import roleModel from './role.model.js';
import refreshTokenModel from './refreshToken.js';
// Initialize models
const User = userModel(sequelize, DataTypes);
const Role = roleModel(sequelize, DataTypes);
const RefreshToken = refreshTokenModel(sequelize, DataTypes);

// Set up associations
if (User.associate) User.associate({ Role });
if (Role.associate) Role.associate({ User });

export { sequelize, User, Role , RefreshToken };
export default { sequelize, User, Role , RefreshToken };