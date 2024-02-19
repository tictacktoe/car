const firebaseConfig = {
    apiKey: "AIzaSyDNLJSJyq_Y1dJrQ_R8BwyEhEGTU_Bwyhc",
    authDomain: "sample-924e9.firebaseapp.com",
    databaseURL: "https://sample-924e9-default-rtdb.firebaseio.com",
    projectId: "sample-924e9",
    storageBucket: "sample-924e9.appspot.com",
    messagingSenderId: "403720469595",
    appId: "1:403720469595:web:b7f22d43d407d9fc92d37e"
};

firebase.initializeApp(firebaseConfig);

var sampleDB = firebase.database().ref('sampleForm');
var count = 0;


const getElementVal = (id) => {
    return document.getElementById(id).value;
};


function displayData(data) {
    var outputElement = document.getElementById("output");
    outputElement.innerHTML = ""; 

    data.forEach(item => {
        var listItem = document.createElement("div");
        listItem.classList.add("question-item");

        var queryElement = document.createElement("p");
        queryElement.textContent = `Query: ${item.Query}`;
        listItem.appendChild(queryElement);

        var questionElement = document.createElement("p");
        questionElement.textContent = `status: ${item.Status}`;
        listItem.appendChild(questionElement);

        outputElement.appendChild(listItem);
    });
}

function getData() {
    sampleDB.once('value')
        .then(snapshot => {
            var data = [];
            snapshot.forEach(childSnapshot => {
                var item = childSnapshot.val();
                data.push(item);
            });
            console.log(data)
            displayData(data);
        })
        .catch(error => {
            console.error("Error getting data:", error);
        });
}

// Function to get the ID of the last row in Firebase
function getLastRowId() {
    sampleDB.orderByKey().limitToLast(1).once('value')
        .then(snapshot => {
            snapshot.forEach(childSnapshot => {
                var lastRowId = childSnapshot.key;
                updateQuestion(lastRowId);
            });
        })
        .catch(error => {
            console.error("Error getting data:", error);
        });
}


document.getElementById("updateButton").addEventListener('click', getLastRowId);

// Function to update a question by ID
function updateQuestion(lastRowId) {
    var update = parseInt(lastRowId);
    var updateId =  update + 1;
    var question = getElementVal('updateId');

    if (updateId) {

        sampleDB.child(updateId).update({
            Query: "(KEY = "+updateId+") "+question,
            Status: "NO Response",
        });

        alert(`Question with ID ${question} has been updated!`);
        getData(); // Refresh the displayed data
    } else {
        alert("Please enter a valid ID to update.");
    }
}


// Call getData() function to fetch and display data when the page loads
document.addEventListener("DOMContentLoaded", getData);



