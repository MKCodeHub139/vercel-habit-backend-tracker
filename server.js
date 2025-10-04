import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { ApolloServer } from '@apollo/server';
import  {expressMiddleware} from '@apollo/server/express4'
import typeDefs from './services/graphql/typeDefs.js';
import resolvers from './services/graphql/resolvers.js';
import cookieParser from 'cookie-parser';
import { validateUser } from './services/jwt/auth.js';
import mongoose from 'mongoose';

const app =express()
let isConnected = false;
async function connectToMongoDb() {
   if (isConnected || mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error
  }
}


// CORS
const allowedOrigins = [
  "https://vercel-frontend-habit-tracker.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    // For server-to-server or Postman (no origin)
    if(!origin) return callback(null, true); 
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Make sure OPTIONS preflight also returns correct headers
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
async function startApolloServer() {
const server = new ApolloServer({
    typeDefs:typeDefs,
    resolvers:resolvers,
    introspection: true,
})
  await server.start()
app.use('/graphql',express.json(),expressMiddleware(server,{
   context: async({req,res})=> {
    try {
      await connectToMongoDb();
       let token =null
      const isIntrospection = req.body?.operationName === 'IntrospectionQuery';
    if (isIntrospection) return { req, res };
    token =req?.cookies?.token
    if(token){
        const user = await validateUser(token)
        if(!user) throw new Error('user not exists')
            return {req,res,user}
    }
    return {req,res}
    } catch (error) {
   console.error("GraphQL context error:", error);
   throw new Error("Internal Server Error");
}
          }
}   
))
}
startApolloServer().catch((err) =>
  console.error('Apollo Server initialization error:', err)
);

export default app
