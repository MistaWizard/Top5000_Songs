require("dotenv").config();


const inquirer = require("inquirer");
const mysql = require("mysql");
const keys = require("./keys.js");
const colors = require('colors');

const pwd = keys.mysqlDB.password;

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: pwd,
    database: "top_songsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptUserInput();
  });

function promptUserInput() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["By Artist", "By Song Count", "By Year Range", "By Song Name", "Find artists with a top song and top album in the same year"],
            name: "filter"
        }
    ]).then(function (input) {
		console.log('User selected ' + input.filter);

		// Perform the appropriate query
		if (input.filter === 'By Artist') {
			console.log('___By Artist___'.blue);
			queryByArtist();

        }
        else if (input.filter === 'By Song Count') {
			console.log('___By Song Count___'.green);
			queryBySongCount();

        }
        else if (input.filter === 'By Year Range') {
			console.log('___By Year Range___'.magenta);
			queryByYearRange();

        }
        else if(input.filter === 'By Song Name') {
			console.log('___By Song Name___'.yellow);
            queryBySongName();
        }
        else if(input.filter === "Find artists with a top song and top album in the same year") {
            console.log('___By Artist Album___'.yellow);
            songAndAlbumSearch();
        }
    })
};

function queryByArtist() {
    inquirer.prompt([
        {
            type: "input",
            name: "artist",
            message: "What artist you want?"
        }
    ]).then(function(input) {
        queryStr = "SELECT * FROM top5000 WHERE artist ?";
        connection.query(queryStr, {artist: input.artist}, function(err, data) {
            if (err) throw err;
            console.log("Songs: ");
            console.log("......................\n");

            for (let i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
                ].join(" | ").blue);
            }

            console.log("\n......................\n");
            // connection.end();
            promptUserInput();
        })
    })
};

function queryBySongCount() {
    inquirer.prompt([
        {
            type: "input",
            name: "count",
            message: "What is the minimum count for the artist?"
        }
    ]).then(function(input) {
        queryStr = "SELECT artist FROM top5000 GROUP BY artist HAVING COUNT(*) > " + input.count;
        connection.query(queryStr, function(err, data) {
            if (err) throw err;
            console.log("Artists: ");
            console.log("......................\n");

            for (let i = 0; i < data.length; i++) {
                console.log([
                    data[i].artist
                ].join(" | ").yellow);
            }

            console.log("\n......................\n");
            // connection.end();
            promptUserInput();
        })
    })
};

function queryByYearRange() {
    inquirer.prompt([
        {
            type: "input",
            name: "begin",
            message: "What is the beginning year?"
        },
        {
            type: "input",
            name: "end",
            message: "What is the end year?"
        }
    ]).then(function(input) {
        queryStr = "SELECT * FROM top5000 WHERE year BETWEEN ? AND ?";
        connection.query(queryStr, [input.begin, input.end], function(err, data) {
            if (err) throw err;
            console.log("Songs: ");
            console.log("......................\n");

            for (let i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
                ].join(" | ").green);
            }

            console.log("\n......................\n");
            // connection.end();
            promptUserInput();
        })
    })
};

function queryBySongName() {
    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "What is the name of the song?"
        }
    ]).then(function(input) {
        queryStr = "SELECT * FROM top5000 WHERE song LIKE '%" + input.song + "%'";
        // connection.query(queryStr, {song: input.song}, function(err, data) {
        connection.query(queryStr, function(err, data) {
            if (err) throw err;
            console.log("Song Info: ");
            console.log("......................\n");

            for (let i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
                ].join(" | ").magenta);
            }

            console.log("\n......................\n");
            // connection.end();
            promptUserInput();
        })
    })
};

function songAndAlbumSearch() {
    inquirer.prompt([
        {
            type: "input",
            name: "album",
            message: "What artist would you like to search for?"
        }
    ]).then(function(input) {
        queryStr = "SELECT top3000.year, top3000.album, top3000.position, top5000.song, top5000.artist ";
        queryStr += "FROM top3000 INNER JOIN top5000 ON (top3000.artist = top5000.artist AND top3000.year ";
        queryStr += "= top5000.year) WHERE (top3000.artist = ? AND top5000.artist = ?) ORDER BY top3000.year ";

        connection.query(queryStr, [input.artist, input.artist], function(err, data) {
            if (err) throw err;
            console.log("Song Info: ");
            console.log("......................\n");

            for (let i = 0; i < data.length; i++) {
                console.log([
                    data[i].position,
                    data[i].artist,
                    data[i].song,
                    data[i].year
                ].join(" | ").magenta);
            }

            console.log("\n......................\n");
            // connection.end();
            promptUserInput();
        });
    })
}

// promptUserInput();