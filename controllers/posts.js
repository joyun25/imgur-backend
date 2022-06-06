const handleResponse = require("../service/handleResponse");
const Post = require("../models/posts");

const posts = {
  getPosts: handleResponse.errorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPosts = await Post.find(q).populate({
      path: "user",
      select: "name photo"
    }).sort(timeSort);
    handleResponse.success(res, "資料讀取成功", allPosts);
  }),
  createPosts: handleResponse.errorAsync(async (req, res, next) => {
    const body = req.body;
    if (body.content){
      const newPost = await Post.create(body);
      handleResponse.success(res, "資料讀取成功", newPost);
    }else{
      handleResponse.errorNew(400, "內文資料未填", next);
    }
  }),
  deleteAllPosts: handleResponse.errorAsync(async (req, res, next) => {
    if (req.originalUrl === "/posts/") {
      handleResponse.errorNew(404, "無此網站路由", next);
    }else{
      await Post.deleteMany({});
      handleResponse.success(res, "刪除成功", Post);
    }
  }),
  deleteOnePost: handleResponse.errorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (await Post.findById(`${id}`) !== null){
      await Post.findByIdAndDelete(`${id}`);
      handleResponse.success(res, "刪除成功", Post);
    }else{
      handleResponse.errorNew(400, "無此筆資料", next);
    }
  }),
  updatePosts: handleResponse.errorAsync(async (req, res, next) => {
    const body = req.body;
    const name = req.body.name;
    const content = req.body.name;
    const id = req.params.id;
    if (await Post.findById(`${id}`) !== null){
      if(content){
        const updatePost = await Post.findByIdAndUpdate(`${id}`, {name, content}, {new: true, runValidators: true});
        handleResponse.success(res, "資料修改成功", updatePost);
      }else{
        handleResponse.errorNew(400, "內文資料未填", next);
      }
    }else{
      handleResponse.errorNew(400, "無此筆資料", next);
    }
  })
};

module.exports = posts;