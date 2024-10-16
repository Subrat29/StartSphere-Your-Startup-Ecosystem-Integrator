const Article = require("../Models/Article");
const Profile = require("../Models/Profile");

// Create a new Article
const createArticle = async (req, res) => {
  const authorId = req.params.authorId;
  const { title, content } = req.body;
  try {
    const user = await Profile.findById(authorId).select("Name Email Image Bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newArticle = new Article({
      author: user,
      title,
      content,
    });

    await newArticle.save();

    res.status(201).json({ message: "Article created successfully", Article: newArticle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an Article
const updateArticle = async (req, res) => {
  const articleId = req.params.articleId;
  const { title, content } = req.body;
  try {
    const article = await Article.findById(articleId).populate("author","Name Email Image Bio");;

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.title = title || article.title;
    article.content = content || article.content;

    await article.save();

    res.status(200).json({ message: "Article updated successfully", Article: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Articles
const searchArticles = async (req, res) => {
        const { title } = req.query;
        try {
          const article = await Article.find({$or: [{ title: { $regex: title, $options: "i" } }]})
            .populate("author", "Name Email Image Bio")
        
          res.status(200).json(article);
        } catch (error) {
          res.status(500).json({ message: "Server error", error });
        }
      
};

// Fetch a single Article
const fetchArticle = async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findById(articleId).populate("author","Name Email Image Bio");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all Articles
const fetchAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author","Name Email Image Bio");
    res.status(200).json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an Article
const deleteArticle = async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findByIdAndDelete(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  searchArticles,
  fetchArticle,
  fetchAllArticles,
  deleteArticle,
};
