
const favoriteKey = "fav";
var favoriteGiphies = [];
if (localStorage.getItem(favoriteKey)) {
    favoriteGiphies = JSON.parse(localStorage.getItem(favoriteKey));
}
var clicksTracker = { apple: 0, cars: 0, dogs: 0, cat: 0 };
var preFilledTopics = ["apple", "cars", "dogs", "cat"];
var buttonContainer = $("#buttons");
preFilledTopics.forEach(e => {
    generateButton(e);
});

$("#submit").click(function (e) {
    e.preventDefault();
    if ($("#topic-input").val() != "") {
        generateButton($("#topic-input").val());
        // console.log("generating new button");
    }
});

function generateButton(topic) {
    var button = $("<button>").attr("topic", topic).text(topic).addClass("btn btn-success btn-lg");
    button.click(function () {
        fetchGiphy(button.attr("topic"));
    });
    buttonContainer.append(button);
}

function fetchGiphy(topic) {
    var giphyArray = [];
    const apikey = "JkPb46q9c58NLlRLRB76YMfdwkFLGVj0";
    var limit = 9;
    var url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${topic}&limit=${limit}&offset=${clicksTracker[topic]}&lang=en`;
    clicksTracker[topic] += limit;
    // console.log(url);
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        response.data.forEach(e => {
            var object = {
                rating: e.rating,
                imageAnimated: e.images.fixed_width.url,
                imageStill: e.images.fixed_width_still.url,
            };
            // console.log(object);
            giphyArray.push(object);
        });
        updateUI(giphyArray);
    });
}

function updateUI(arr) {
    var giphies = $("#giphies");
    giphies.empty();
    arr.forEach(e => {
        var card = $("<div>").addClass("card col-md-4").html(
            `
                    <div class="card-body">
                        <p class="card-text"></p>
                    </div>
                    `
        );
        var img = $("<img>").addClass("card-img-top img-fluid").attr({ "src": e.imageStill, "image-animated": e.imageAnimated, "image-still": e.imageStill, "toggle": "still" }).prependTo(card);
        img.hover(function () {
            if ($(this).attr("toggle") === "still") {
                $(this).attr("src", $(this).attr("image-animated"));
                $(this).attr("toggle", "animated");
            } else {
                $(this).attr("src", $(this).attr("image-still"));
                $(this).attr("toggle", "still");
            }
        });
        img.click(function () {
            img.unbind("click");
            favoriteGiphies.push(e);
            card.animate({ height: "0" }, 500, function () {
                $(this).empty();
            });
            updateStorage();
        });
        card.find(".card-body").css("padding", "0");
        card.find(".card-text").text(`Rating: ${e.rating}`);
        card.appendTo(giphies);
    });
}

$("#favorites").click(function () {
    var giphies = $("#giphies");
    giphies.empty();
    favoriteGiphies.forEach(e => {
        var card = $("<div>").addClass("card col-md-4").html(
            `
                    <div class="card-body">
                        <p class="card-text"></p>
                    </div>
                    `
        );
        var img = $("<img>").addClass("card-img-top img-fluid").attr({ "src": e.imageStill, "image-animated": e.imageAnimated, "image-still": e.imageStill, "toggle": "still" }).prependTo(card);
        img.hover(function () {
            if ($(this).attr("toggle") === "still") {
                $(this).attr("src", $(this).attr("image-animated"));
                $(this).attr("toggle", "animated");
            } else {
                $(this).attr("src", $(this).attr("image-still"));
                $(this).attr("toggle", "still");
            }
        });
        img.click(function () {
            if (show("Delete this GIF?")) {
                img.unbind("click");
                favoriteGiphies.splice(favoriteGiphies.indexOf(e), 1);
                card.animate({ height: "0" }, 500, function () {
                    $(this).empty();
                });
                updateStorage();
            }
        });

        card.find(".card-body").css("padding", "0");
        card.find(".card-text").text(`Rating: ${e.rating}`);
        card.appendTo(giphies);
    });
});

$("#clear-storage").click(function () {
    if (show("Are you sure you want to clear all favorites?")) {
        favoriteGiphies = [];
        $("#favorites").click();
        updateStorage();
    }
});

function updateStorage() {
    localStorage.setItem(favoriteKey, JSON.stringify(favoriteGiphies));
}

function show(msg) {
    return confirm(msg);
}

// call favorite button click on page load;
$("#favorites").click();