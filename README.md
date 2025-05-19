# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# create migrations
npm install --save-dev sequelize-cli
or globally
npm install -g sequelize-cli
npx sequelize-cli init
PS F:\Learn NodeJS\auth-service-backend> npx sequelize-cli migration:generate --name create-users
