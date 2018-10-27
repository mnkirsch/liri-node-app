require("dotenv").config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
// const cTable = require('console.table');
var bandsintown = require('bandsintown')('trilogy');
var request = require('request');
var fs = require('fs');


var spotify = new Spotify({
    id: "52777afd53b942d9a7daaced4f651312",
    secret: "1bdbcd5fe75f48ce800f3a88a42d2a62"
});


function spotifyThis(songName) {

    spotify.search({
        type: 'track',
        query: songName,
        limit: 10
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("artist name  :", data.tracks.items[0].album.artists[0].name);
        console.log("song name: ", data.tracks.items[0].name);
        console.log("preview url: ", data.tracks.items[0].href);
        console.log("Album name", data.tracks.items[0].album.name);
        var songResult = [];
        data.tracks.items.forEach(e => {
            var song = {
                'Artist_name': e.album.artists[0].name,
                'Song_Name': e.name,
                'Preview_Url': e.href,
                'Album_Name': e.name
            }
            songResult.push(song);
        });


        fs.appendFile("log.txt", "\n", function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("log.txt was updated");
            }
        });
    });
}


function bandsInTown(artist) {
    fs.appendFileSync("log.txt", "\n----------------\n", function (error) {
        if (error) {
            console.log(error);
        };
    });
    //Run request to bandsintown with the specified artist
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    request(queryURL, function (error, response, body) {
        //If no error and response is a success
        if (!error && response.statusCode === 200) {
            //Parse the json response
            var data = JSON.parse(body);
            //Loop through array
            for (var i = 0; i < 5; i++) {
                //Get venue name
                console.log("Venue: " + data[i].venue.name);
                //Append data to log.txt
                fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
                    if (error) {
                        console.log(error);
                    };
                });
                //Get venue location
                //If statement for concerts without a region
                if (data[i].venue.region == "") {
                    console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                    //Append data to log.txt
                    fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                        if (error) {
                            console.log(error);
                        };
                    });
                } else {
                    console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                    //Append data to log.txt
                    fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
                        if (error) {
                            console.log(error);
                        };
                    });
                }
                //Get date of show
                var date = data[i].datetime;
                console.log("Date: " + date)
                //Append data to log.txt
                fs.appendFileSync("log.txt", "Date: " + date + "\n----------------\n", function (error) {
                    if (error) {
                        console.log(error);
                    };
                });
                console.log("----------------")
            }
        }
    });
}


function movieSearch(title) {
    var URL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    request(URL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = {
                Title: JSON.parse(body).Title,
                Year: JSON.parse(body).Year,
                IMDB_Rating: JSON.parse(body).imdbRating,
                Rotten_Tomatoes_Rating: JSON.parse(body).Ratings[1].Value,
                Country: JSON.parse(body).Country,
                Language: JSON.parse(body).Language,
                Plot: JSON.parse(body).Plot,
                Actors: JSON.parse(body).Actors,
            }

            console.log(movie);

            fs.appendFile("log.txt", "\nTitle: " + movie.Title + "\nYear: " + movie.Year + "\nIMDB Rating: " + movie.IMDB_Rating + "\nRotten Tomatoes Rating: " + movie.Rotten_Tomatoes_Rating + "\nCountry: " + movie.Country + "\nLanguage: " + movie.Language + "\nPlot: " + movie.Plot + "\nActors: " + movie.Actors, function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log("log.txt was updated");
                }
            });
        } else {
            console.log(error);
            console.log(response.statusCode);
        }
    });
}

function random() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log()

        fs.appendFile("log.txt", "\n" + data, function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("log.txt was updated");
            }
        });

        spotifyThis(data);
    });
}


switch (process.argv[2]) {
    case 'spotify-this-song':
        var resultFormatted = process.argv.slice(3, process.argv.length).join(" ");
        spotifyThis(resultFormatted);
        break;
    case 'concert-this':
        var artistFormatted = process.argv.slice(3, process.argv.length).join(" ");
        bandsInTown(artistFormatted);
        break;
    case 'movie-this':
        var movieFormatted = process.argv.slice(3, process.argv.length).join("+");
        movieSearch(movieFormatted);
        break;
    case 'do-what-it-says':
        random();
        break;
    default:
        console.log('invalid entry');
}