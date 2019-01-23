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

function promptUserInput() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["By Artist", "By Song Count", "By Year Range", "By Song Name"],
            name: "filter"
        }
    ]).then(function (input) {
		console.log('User selected ' + input.filter);

		// Perform the appropriate query
		if (input.filter === 'By Artist') {
			console.log('___By Artist___'.blue);
			queryByArtist();

		} else if (input.filter === 'By Song Count') {
			console.log('___By Song Count___'.green);
			queryBySongCount();

		} else if (input.filter === 'By Year Range') {
			console.log('___By Year Range___'.magenta);
			queryByYearRange();

		} else if(input.filter === 'By Song Name') {
			console.log('___By Song Name___'.yellow);
			queryBySongName();

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
            connection.end();
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
            connection.end();
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
            connection.end();
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
            connection.end();
        })
    })
};

promptUserInput();