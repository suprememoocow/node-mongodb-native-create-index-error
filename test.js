'use strict';

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

var db, collection;

return MongoClient.connect(process.env.MONGODB_CONNECT_URL || 'mongodb://localhost:27017/test')
  .then(function(_db) {
    db = _db;
    // Ensure a fresh collection every time we run this...
    return db.dropCollection('index_test_collection')
      .catch(function() { })
  })
  .then(function() {
    return db.createCollection('index_test_collection');
  })
  .then(function(_collection) {
    collection = _collection;
    return collection.ensureIndex({ 'a.one': 1, 'a.two': 1 }, { name: 'n1', partialFilterExpression: { 'a.two': { $exists: true } } });
  })
  .then(function() {
    return collection.ensureIndex({ 'a.one': 1, 'a.two': 1 }, { name: 'n2', partialFilterExpression: { 'a.too': { $exists: true } } });
  })
  .catch(function(err) {
    console.log(err.stack || err);
    process.exit(1);
  })
  .then(function() {
    if (db) {
      return db.close();
    }
  });
