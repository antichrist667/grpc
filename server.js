const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('example.proto', {});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const users = {};

const server = new grpc.Server();

server.addService(exampleProto.UserService.service, {
  GetUserById: (call, callback) => {
    const user = users[call.request.id];
    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "User not found"
      });
    }
  },
  CreateUser: (call, callback) => {
    const user = call.request;
    users[user.id] = user;
    callback(null, user);
  },
  UpdateUser: (call, callback) => {
    const user = call.request;
    users[user.id] = user;
    callback(null, user);
  },
  DeleteUser: (call, callback) => {
    const userId = call.request.id;
    if (users[userId]) {
      delete users[userId];
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "User not found"
      });
    }
  }
});

const port = process.env.PORT || 50051; 
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  server.start();
});

