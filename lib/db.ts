import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type GlobalMongoose = typeof globalThis & {
  _mongooseConn?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose | null> | null;
  };
};

const globalCache = globalThis as GlobalMongoose;

if (!globalCache._mongooseConn) {
  globalCache._mongooseConn = { conn: null, promise: null };
}

export function isDbConfigured() {
  return Boolean(MONGODB_URI && MONGODB_URI.startsWith("mongodb"));
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!isDbConfigured()) {
    return null;
  }

  const cache = globalCache._mongooseConn ?? (globalCache._mongooseConn = { conn: null, promise: null });

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .then((instance) => {
        cache.conn = instance;
        return instance;
      })
      .catch((error) => {
        console.error("[db] MongoDB connection failed:", error?.message ?? error);
        cache.promise = null;
        return null;
      });
  }

  return cache.promise;
}
