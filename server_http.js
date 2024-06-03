const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
const PORT = process.env.PORT || 3000;
const GRPC_PORT = process.env.GRPC_PORT || 50051;

// Load gRPC package definition
const packageDefinition = protoLoader.loadSync('example.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

// Create gRPC client
const client = new exampleProto.UserService(`0.0.0.0:${GRPC_PORT}`, grpc.credentials.createInsecure());

app.use(bodyParser.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// CreateUser route
app.post('/CreateUser', (req, res) => {
  console.log("CreateUser called with data: ", req.body);
  client.CreateUser(req.body, (error, response) => {
    if (error) {
      console.error("Error creating user:", error);
      res.status(500).send(error);
    } else {
      console.log("User created:", response);
      res.json(response);
    }
  });
});

// GetUserById route
app.post('/GetUserById', (req, res) => {
  console.log("GetUserById called with data: ", req.body);
  client.GetUserById(req.body, (error, response) => {
    if (error) {
      console.error("Error getting user:", error);
      res.status(500).send(error);
    } else {
      console.log("User found:", response);
      res.json(response);
    }
  });
});

// UpdateUser route
app.post('/UpdateUser', (req, res) => {
  console.log("UpdateUser called with data: ", req.body);
  client.UpdateUser(req.body, (error, response) => {
    if (error) {
      console.error("Error updating user:", error);
      res.status(500).send(error);
    } else {
      console.log("User updated:", response);
      res.json(response);
    }
  });
});

// DeleteUser route
app.post('/DeleteUser', (req, res) => {
  console.log("DeleteUser called with data: ", req.body);
  client.DeleteUser(req.body, (error, response) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.status(500).send(error);
    } else {
      console.log("User deleted:", response);
      res.json(response);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
});
