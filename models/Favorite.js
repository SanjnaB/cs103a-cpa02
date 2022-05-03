'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var favoriteSchema = Schema( {
  userId: ObjectId,
  Title: String
} );

module.exports = mongoose.model( 'Favorite', favoriteSchema );