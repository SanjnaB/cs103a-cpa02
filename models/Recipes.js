'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var recipeSchema = Schema( {
  userId: ObjectId,
  Title: String,
  Cuisine: String,
} );

module.exports = mongoose.model( 'Recipe', recipeSchema );