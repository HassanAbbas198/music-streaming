
# Music Streaming

Music streaming is a small CMS app that consists of authentication APIs (signup, login, etc..) and send emails service.
An authenticated user can make CRUD operations for artists, albums, tracks, as well as creating another user.

The app was developed using Nodejs, ExpressJS and MongoDB.

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm run install-dev
```

Start the server

```bash
  npm run dev
```

## Dependencies

- Node <= v16.14.1
- MongoDB credentials


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NODE_ENV
APP_PORT
APP_NAME
LOG_LEVEL
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
DB_DATABASE
JWT_SECRET
MAILGUN_APIKEY
FRONTEND_URL
```

## API Reference

#### Sign up

```http
  POST api/users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
| `password` | `string` | **Required**|
| `confirmPassword` | `string` | **Required** |
| `dateOfBirth` | `string` | **Required** |

## Authors

- [@HassanAbbas198](https://github.com/HassanAbbas198)

