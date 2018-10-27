require("dotenv").config();

var keys = require("./keys.js");


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: "52777afd53b942d9a7daaced4f651312",
    secret: "1bdbcd5fe75f48ce800f3a88a42d2a62"
  });



function mySwitch(userCommand) {
    switch (userCommand) {
        case "concert-this":
            concertThis();
            break;
        
        case "spotify-this-song":
            spotifyThisSong();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

function concertThis() {

}

var artistNames = function (artist) {
    return artist.name;
}

var spotifyThisSong = function (songName) {

    if (songName === undefined) {
        songName = "The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: userCommand
        },

        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            console.log(data);

            var songs = data.tracks.its;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " +songs[i].artists.map(artistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    )

}

var movieThis = function (movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function(error, response,  body) {
        if(!error && response.statusCode == 200){
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);console.log("Actors: " + body.Actors);


        } else {
            console.log("Error occurred")
        }
    });

}

function doWhatItSays() {

    fs.readFile('random.txt', "utf8", function(error, data){
        var txt = data.split(',');
    
        spotifySong(txt[1]);
    });
    

}