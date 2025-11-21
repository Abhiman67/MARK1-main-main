import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local as MONGODB_URI');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options as any);
clientPromise = client.connect();

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) global._mongoClientPromise = clientPromise;
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
