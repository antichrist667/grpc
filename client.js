const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('example.proto', {});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const client = new exampleProto.UserService('localhost:50051', grpc.credentials.createInsecure());

const userId = '1';
const newUser = { id: '1', name: 'John Doe' };

client.CreateUser(newUser, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('User created:', response);

    client.GetUserById({ id: userId }, (error, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log('User fetched:', response);

        const updatedUser = { id: '1', name: 'John Smith' };
        client.UpdateUser(updatedUser, (error, response) => {
          if (error) {
            console.error(error);
          } else {
            console.log('User updated:', response);

            client.DeleteUser({ id: userId }, (error, response) => {
              if (error) {
                console.error(error);
              } else {
                console.log('User deleted:', response);
              }
            });
          }
        });
      }
    });
  }
});
