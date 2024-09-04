# How to install

**First :**

```bash
Open CLI (Command Line Interface)

Clone Repo

git clone https://github.com/Dhumall/Messaging_Service.git
```

```bash
cd Messaging_Service
```

```bash
install node js

npm install
```

```bash
Add .env
```

```bash
Set ENV

NODE_ENV = "development"
AUTHORIZATION = "0e4f1786-daed-3ead-ad6c-3bdc37d39256"
JWT_EXPIRES_IN = "3600s"
PORT = "3003"
```

**Second :**

```bash
Run apps

npm run start:nodemon

Endpoint Project
http://localhost:3003
```

# Environment

**Programming Language:**

TypeScript with Code [Code](https://www.typescriptlang.org/).

**JavaScript runtime:**

JavaScript runtime with Node JS [Node JS](https://nodejs.org/en/) version v21.6.1.

**Framework Backend:**

This project was generated with [Express JS](https://expressjs.com/en/starter/installing.html) version 4.19.2.

Addon Plugin

Framework Express [Framework Express](https://expressjs.com/en/starter/installing.html).

```bash
mkdir myapp
cd myapp

npm init
npm install express
```

Build an Authentication API with JWT Token [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

```bash
npm install jsonwebtoken
```

(CORS) Cross Origin Resource Sharing [CORS](https://expressjs.com/en/resources/middleware/cors.html).

```bash
npm install cors
```

sequelize [sequelize](https://sequelize.org/).

```bash
npm install sequelize
```

# How to Deploy

Change .env
NODE_ENV = "staging"
NODE_ENV = "production"

**First:**

```bash
npm run build

npm run start:prod
```

After your success build, can try run production

**If You use Docker:**

```bash
FROM node:12.22.1-alpine3.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY dist .

EXPOSE 3003
CMD ["node","server.js"]
```