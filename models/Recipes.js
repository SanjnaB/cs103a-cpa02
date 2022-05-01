'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var movieSchema = Schema( {
  userId: ObjectId,
  Title: String,
  Director: String,
  Year: Number
} );

module.exports = mongoose.model( 'Recipe', movieSchema );