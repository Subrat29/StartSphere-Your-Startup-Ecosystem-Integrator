// models/Article.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: [
    {
      type: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  author: { type: Schema.Types.ObjectId, ref: 'Profile', required: true }
});

module.exports = mongoose.model('Article', ArticleSchema);
