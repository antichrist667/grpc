const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const server = new grpc.Server();
const PORT = process.env.GRPC_PORT || 50051;

// Load protobuf
const packageDefinition = protoLoader.loadSync('example.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

// Implement the CreateUser RPC method
const users = [];

function createUser(call, callback) {
  console.log('Received CreateUser request:', call.request);
  const user = {
    id: users.length + 1,
    ...call.request
  };
  users.push(user);
  callback(null, user);
}

// Implement the GetUserById RPC method
function getUserById(call, callback) {
  console.log('Received GetUserById request:', call.request);
  const user = users.find(u => u.id == call.request.id);
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  }
}

// Implement the UpdateUser RPC method
function updateUser(call, callback) {
  console.log('Received UpdateUser request:', call.request);
  const userIndex = users.findIndex(u => u.id == call.request.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...call.request };
    callback(null, users[userIndex]);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  }
}

// Implement the DeleteUser RPC method
function deleteUser(call, callback) {
  console.log('Received DeleteUser request:', call.request);
  const userIndex = users.findIndex(u => u.id == call.request.id);
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    callback(null, deletedUser[0]);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  }
}

// Define the server with the methods
server.addService(exampleProto.UserService.service, {
  CreateUser: createUser,
  GetUserById: getUserById,
  UpdateUser: updateUser,
  DeleteUser: deleteUser,
});

// Start the gRPC server
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running at http://0.0.0.0:${PORT}`);
  server.start();
});
