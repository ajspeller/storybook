const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Story = mongoose.model('story')
const User = mongoose.model('user')

require('../models/Story');

const {
  ensureAuthenticated
} = require('../helpers/auth');

// stories index
router.get('/', (req, res) => {
  Story.find({
      status: 'public'
    })
    .populate('user')
    .then(stories => {
      console.log(stories);
      res.render('stories/index', {
        stories
      });
    });
});

// add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// process add story
router.post('/', (req, res) => {
  let allowComments;
  if (req.body.allowComment) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id,
  };

  // create story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });

});


module.exports = router;