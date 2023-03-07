var hikeDocID = localStorage.getItem("hikeDocID");    //visible to all functions on this page
console.log(hikeDocID);

function getHikeName(id) {
    db.collection("hikes")
        .doc(id)
        .get()
        .then((thisHike) => {
            var hikeName = thisHike.data().name;
            document.getElementById("hikeName").innerHTML = hikeName;
        });
}

getHikeName(hikeDocID);

function writeReview() {
    console.log("inside write review")
    //get values from form
    let Title = document.getElementById("title").value;
    let Level = document.getElementById("level").value;
    let Season = document.getElementById("season").value;
    let Description = document.getElementById("description").value;
    // checks which selection in the radio button group is selected by names "flooded" and "scrambled"
    let Flooded = document.querySelector('input[name="flooded"]:checked').value;
    let Scrambled = document.querySelector('input[name="scrambled"]:checked').value;
    console.log(Title, Level, Season, Description, Flooded, Scrambled);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("reviews").add({
                        hikeDocID: hikeDocID,
                        userID: userID,
                        title: Title,
                        level: Level,
                        season: Season,
                        description: Description,
                        flooded: Flooded,
                        scrambled: Scrambled,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        // goes to thanks.html after
                        window.location.href = "thanks.html"; //new line added
                    })
                })
        } else {
            console.log("No user is signed in");
            window.location.href = 'review.html';
        }
    });
}