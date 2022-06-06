const express = require('express');
const router = express.Router();
const postsControllers = require("../controllers/posts");

router.get('/', postsControllers.getPosts);
router.post('/', postsControllers.createPosts);
router.delete('/', postsControllers.deleteAllPosts);
router.delete('/:id', postsControllers.deleteOnePost);
router.patch('/:id', postsControllers.updatePosts);

module.exports = router;