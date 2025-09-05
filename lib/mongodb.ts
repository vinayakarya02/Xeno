import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env (MONGODB_URI)");
}

let client;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise; 