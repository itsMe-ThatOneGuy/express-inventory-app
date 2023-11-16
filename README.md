# Inventory App

A inventory application that could be used for a game store.

## Getting Started

### Environment Variables

You will need your own environment variables to run this app.

**Backend**

`MONGODB_URI`

This would be your MongoDB connection, and can be added to an .env in the project root.

### Install and Run

```bash
git clone https://github.com/itsMe-ThatOneGuy/express-inventory-app.git
cd express-inventory-app
npm install
node populatedb '<MONGODB_URI>'
npm run serverstart
```

## Built With

- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [Pug](https://pugjs.org/api/getting-started.html)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/docs/)
