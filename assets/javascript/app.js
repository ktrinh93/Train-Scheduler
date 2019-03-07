$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC9BCGiKqOMptqLeRqsJSAXo7FfpHwZA60",
        authDomain: "train-scheduler-47edf.firebaseapp.com",
        databaseURL: "https://train-scheduler-47edf.firebaseio.com",
        projectId: "train-scheduler-47edf",
        storageBucket: "train-scheduler-47edf.appspot.com",
        messagingSenderId: "74041189578"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit-button").on("click", function(event) {
        event.preventDefault();

        // gets values from form
        var trainNameInput = $("#train-name").val().trim();
        var destinationInput = $("#train-destination").val().trim();
        var firstTrainInput = $("#first-train").val().trim();
        var frequencyInput = $("#frequency").val().trim();

        console.log(trainNameInput);
        console.log(destinationInput);
        console.log(firstTrainInput);
        console.log(frequencyInput);

        database.ref().push({
            trainName: trainNameInput,
            destination: destinationInput,
            firstTrain: firstTrainInput,
            frequency: frequencyInput
        });
    });

    database.ref().on("child_added", function(snapshot) {

        // gets data from the database
        var snapName = snapshot.val().trainName;
        var snapDest = snapshot.val().destination;
        var snapFirst = snapshot.val().firstTrain;
        var snapFreq = snapshot.val().frequency;
      
        // declares/initializes some of the table data
        var tableRow = $("<tr>");
        var nameCell = $("<td>" + snapName + "</td>");
        var destCell = $("<td>" + snapDest + "</td>");
        var firstCell = $("<td>" + moment(snapFirst, "HH:mm").format("hh:mm a") + "</td>");
        var freqCell = $("<td>" + snapFreq + "</td>");
        var nextCell = $("<td>");
        var timeCell = $("<td>");

        // subtracts a year from the first train time (ensures positive time)
        var snapFirstConv = moment(snapFirst, "hh:mm a").subtract(1, "years");

        // calculates the difference (in minutes) between now and the first train time
        var diffTime = moment().diff(moment(snapFirstConv), "minutes");
        // calculates the remaining time until the next train
        var tRemainder = diffTime % snapFreq;
        var minsUntilNextTrain = snapFreq - tRemainder;

        // populates table cell
        timeCell.text(minsUntilNextTrain);

        // calculates the next train time
        var nextTrainTime = moment(moment().add(minsUntilNextTrain, "minutes")).format("hh:mm a");

        // populates table cell
        nextCell.text(nextTrainTime);

        // create a delete button
        var deleteB = $("<button type=\"button\" class=\"btn btn-danger delete\">Delete</button>");

        // construct the row and put it in the table body
        tableRow.append(nameCell, destCell, firstCell, freqCell, nextCell, timeCell, deleteB);
        tableRow.attr("data-key", snapshot.key);
        $("tbody").append(tableRow);
        
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).on("click", ".delete", function() {

        var childkey = $(this).parent().attr("data-key");
        $(this).parent().remove();

        database.ref().child(childkey).remove();
    });
});