require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var Book = require('./models/book');
var Review = require('./models/review');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.get('/api/v1/reviews', function(request, response) {
  Review.fetchAll().then(function(reviews) {
    response.json(reviews);
  });

  // eager load
  // new SongsCollection().fetch({ withRelated: ['artist'] }).then(function(songs) {
  //   response.json(songs);
  // });
});

// lazy load
// app.get('/api/songs', function(request, response) {
//   Song
//     .fetchAll()
//     .then(function(songs) {
//       var artists = songs.map(function(song) {
//         return song.related('artist').fetch();
//       });

//       return Promise.all(artists);
//     })
//     .then(function(artists) {
//       response.json(artists);
//     });
// });

app.get('/api/v1/books/:id', function(request, response) {
  Book.where('id', request.params.id).fetch({
      require: true,
      withRelated: ['author', 'publisher']
    })
    .then(function(book) {
      response.json(book);
    }, function(e) {
      response.status(404).json({
        error: {
          message: 'Book not found'
        }
      });
    });
});

app.post('/api/v1/reviews', function(request, response) {
  var review = new Review({
    book_id: request.body.book_id,
    body: request.body.body,
    headline: request.body.headline,
    rating: request.body.rating
  });

  review.save().then(function() {
    response.json(review);
  });
});

app.listen(8000);
