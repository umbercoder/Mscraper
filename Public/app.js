// initially hide story div
$("#story").hide();

  

// grab the story as json on "scrape" click
$("#scrape").on("click", function() {
  CONSOLE.LOG(STORY);
  // show story div
  $("#Story").show();
  $.getJSON("/story", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#story").append("<div class='newstory'><p data-id='" + data[i]._id + "'><h3><a class='link' target='_blank' href='" + data[i].link + "'>" + data[i].title + "</a></h3><button type='button' id='" + data[i]._id + "' class='btn btn-default'>Add to Favorites</button></p></div>");
    $("#story").append("<div class='newStory'><p data-id='" + data[i]._id + "'><h3><a class='link' target='_blank' href='" + data[i].link + "'>" + data[i].title + "</a></h3><button type='button' id='favorite' data-id='" + data[i]._id + "' class='btn btn-default'>Add to Favorites</button></p></div>");
  }
  });  
});

// push saved story to favorites page on button click
$("#story").on("click", "#addNote", function() {
  console.log("clicked");
});

// Whenever someone clicks a p tag
$("thing").on("click", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Story
  $.ajax({
    method: "GET",
    url: "/story/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the Story
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the Story saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the Story
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the Story from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/story/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// for modals
$('lpModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#scrapeModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#0').on('shown.bs.modal', function () {
  $('#myInput').focus()
})
