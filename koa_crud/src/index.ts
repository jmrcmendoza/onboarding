import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-koa';
import vendorsRoutes from './routes/vendors';
import membersRoutes from './routes/members';

import { typeDefs } from './schema';
import resolvers from './schema/resolvers';

const app = new Koa();

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
});

graphqlServer.applyMiddleware({ app });

const PORT = process.env.PORT || 3000;

app.use(bodyParser());

const uri = 'mongodb://localhost:27017/local';

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) {
      console.log(err.message);
    }
  },
);

app.use(vendorsRoutes.routes());
app.use(membersRoutes.routes());

const server = app
  .listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  });

export default server;
