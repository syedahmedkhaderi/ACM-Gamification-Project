# MongoDB Connection Issue

## Current Problem

The MONGODB_URI secret has an **incomplete cluster URL**:
```
Current: mongodb+srv://user:pass@cluster.mongodb.net/questcraft
```

## Required Format

A valid MongoDB Atlas connection string should look like:
```
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/questcraft
```

Where `xxxxx` is your cluster's unique identifier (e.g., `abc123`, `o4s5m`, etc.)

## How to Fix

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login to your account
3. Click "Connect" on your cluster
4. Select "Connect your application"
5. Copy the COMPLETE connection string
6. Update the MONGODB_URI secret in Replit with the complete string

## Temporary Workaround

The app will attempt to run without MongoDB, but database features won't work until this is fixed.

Once fixed, run:
```bash
npm run init-db
```

To initialize the database with admin user and sample data.
