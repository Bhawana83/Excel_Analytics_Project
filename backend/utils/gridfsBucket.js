const mongoose = require("mongoose");

let gfsBucket = null;

/**
 * Initialize native GridFSBucket. Must be called after mongoose connection is ready.
 * Attaches bucket to app.locals.gfsBucket.
 */
function initGridFSBucket(app) {
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose is not connected. Call connectDB first.");
  }

  const db = mongoose.connection.db;
  gfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  app.locals.gfsBucket = gfsBucket;

  console.log("✅ GridFSBucket initialized");
}

/* Getter if needed outside request context. */
function getGFSBucket() {
  if (!gfsBucket) {
    throw new Error("GridFSBucket not initialized. Call initGridFSBucket(app) first.");
  }
  return gfsBucket;
}

module.exports = {
  initGridFSBucket,
  getGFSBucket,
};