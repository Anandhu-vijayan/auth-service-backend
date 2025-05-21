// user.model.js
export const User= (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
     roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles', // 👈 must match the actual roles table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  };

  return User;
};
