const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path'); // Importa el módulo path

const packageDefinition = protoLoader.loadSync('example.proto', {});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const app = express();
app.use(bodyParser.json());

const client = new exampleProto.UserService('localhost:50051', grpc.credentials.createInsecure());

app.post('/CreateUser', (req, res) => {
  client.CreateUser(req.body, (error, response) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(response);
    }
  });
});

app.post('/GetUserById', (req, res) => {
  client.GetUserById(req.body, (error, response) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(response);
    }
  });
});

app.post('/UpdateUser', (req, res) => {
  client.UpdateUser(req.body, (error, response) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(response);
    }
  });
});

app.post('/DeleteUser', (req, res) => {
  client.DeleteUser(req.body, (error, response) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(response);
    }
  });
});

// Agrega una ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

