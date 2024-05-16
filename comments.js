// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

// Set up the server
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load the page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Get the comments
app.get('/comments', function(req, res) {
    fs.readFile('comments.json', (err, data) => {
        if (err) throw err;
        let comments = JSON.parse(data);
        res.send(comments);
    });
});

// Add a new comment
app.post('/comments', function(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let post = parse(body);
        fs.readFile('comments.json', (err, data) => {
            if (err) throw err;
            let comments = JSON.parse(data);
            comments.push(post);
            fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
                if (err) throw err;
                res.send('Comment added');
            });
        });
    });
});

// Start the server
app.listen(3000, function() {
    console.log('Server is running on localhost:3000');
});