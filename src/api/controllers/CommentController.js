const Comment = require("../../models/Comment");

exports.listAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewComment = async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.editComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const updatedComment = req.body;
    const comment = await Comment.findByIdAndUpdate(commentId, updatedComment, { new: true });
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByIdAndRemove(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).send(err);
  }
};