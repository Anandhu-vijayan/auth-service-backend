# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# create migrations
npm install --save-dev sequelize-cli
or globally
npm install -g sequelize-cli
npx sequelize-cli init
PS F:\Learn NodeJS\auth-service-backend> npx sequelize-cli migration:generate --name create-users
npm install ioredis
npm install nodemailer
# create seed file
npx sequelize-cli seed:generate --name seed-permissions
# run seed file
npx sequelize-cli db:seed:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate --config config/config.cjs