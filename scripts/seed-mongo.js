#!/usr/bin/env node
/*
  Simple seed script to create a test user in MongoDB.
  Usage:
    1. Add `MONGODB_URI` to `.env.local`.
    2. Run: `node scripts/seed-mongo.js`
*/
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const email = 'test@example.com';
    const existing = await users.findOne({ email });
    if (existing) {
      console.log('Test user already exists:', existing._id.toString());
      return;
    }

    const passwordHash = await bcrypt.hash('Password123!', 10);
    const res = await users.insertOne({
      email,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
    });

    console.log('Inserted test user with id:', res.insertedId.toString());
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
