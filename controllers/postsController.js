const postModels = require("../models/postModels");

const getAllPosts = async (req, res) => {
  const result = await postModels.getAllPosts();

  if (!result) return res.json({ msg: "Someting went wrong" });

  return res.json(result);
}

const sendNewPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) return res.json({ msg: "fill all blanks" });

  try {
    await postModels.createNewPost(title, content);
    return res.json({ msg: "done" });
  } catch (error) {
    return res.json({ msg: "error" });
  }
}

const getCustomPostData = async (req, res) => {
  try {
    const data = await postModels.getPostData(req.params.id); 

    if (!data) return res.json({ msg: "No post with this id" });

    return res.json(data[0])
  } catch {
    res.json({ msg: "Oh no ther is no post with this id" });
  }
}

const getCustomPostComments = async (req, res) => {
  try {
    const data = await postModels.getPostComments(req.params.id);

    if (!data) return res.json({ msg: "No comments yet" });
    
    return res.json(data)
  } catch {
    res.json({ msg: "Someting went wrong" });
  }
}

const sendComment = async (req, res) => {
  const { comment } = req.body;

  if (!comment) return res.json({ msg: "Fill All Blanks Please" });

  try {
    await postModels.addComment(req.params.id, req.usermail, comment);
    return res.json({ msg: "sent!" });
  } catch (error) {
    return res.json({ msg: "Someting went wrong" });
  }
}

module.exports = { getAllPosts, sendNewPost, getCustomPostData, getCustomPostComments, sendComment };