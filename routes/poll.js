const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '706897',
    key: '56251c3c7ece26f0c87d',
    secret: '8a88ec1c688f584bcc14',
    cluster: 'eu',
    encrypted: true
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true,
    votes: votes}));
});

router.post('/', (req, res) => {
    const newVote = {
        pet: req.body.pet,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('pet-poll', 'pet-vote', {
            points: parseInt(vote.points),
            pet: vote.pet
        });
    
        return res.json({ success: true, message: 'Thank you for voting' });
    });

    
});

module.exports = router;