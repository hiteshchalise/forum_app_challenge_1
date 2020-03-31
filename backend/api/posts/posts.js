const express = require('express');
const uuid = require('uuid');
const posts = require('../../Posts')

const router = express.Router();

router.get('/', (req, res) => res.json(posts));

router.post('/', (req, res) => {
    const newPost = {
        id: uuid.v4(),
        post_title: req.body.post_title,
        post_body: req.body.post_body
    }
    if(!newPost.post_title || !newPost.post_body){
        res.status(400).json({msg: 'Please include post\'s title and body'});
    }

    posts.push(newPost);
    res.json(posts);    
});

router.get('/:postId', (req, res) => {
    console.log(req.params.postId); 
    const foundPost = posts.some(post => post.id===req.params.postId);

    if(foundPost){
        res.json(posts.filter(post => post.id===req.params.postId));
    } else{
        res.status(404).json({
            msg: "There is no post with such ID."
        })
    }
})

module.exports = router;