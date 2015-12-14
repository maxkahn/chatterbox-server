// YOUR CODE HERE:
//display messages retrieved from parse server

window.rooms = {};
window.friends = {};

var app = {};

app.server = 'http://127.0.0.1:3000/classes/messages';

app.init = function() {

};

app.send = function(message) {

  // var message = {message: text,
  //               username: username,
  //               };
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log("Chatterbox: Added Message", message);
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message',this.server,message);
    }});
};
  

app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
  //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {

      data.results.forEach(function(item){
   // get the text of the chat
   // wrap it in some sort of div or span
        $chat = $('<div></div>');
     // var chatClass = "chat";
     // $chat.addClass("chat");
        var chatName = item.username;
        var chatBody = item.text;
        if( chatName && chatBody) {
          if ((chatBody.indexOf('src') ===-1 && chatName.indexOf('src') ===-1) 
            && chatBody.indexOf('script') ===-1 && chatName.indexOf('script') ===-1){
              var chatRoom = item.roomname;
              window.rooms[chatRoom] = true;

              var noSpace = "";

              if (chatRoom !== undefined) {
                for (var k = 0; k < chatRoom.length; k++) {
                  if (chatRoom.slice(k, k+1) !== " " && chatRoom.slice(k, k+1) !== "!") {
                    noSpace = noSpace + chatRoom.slice(k, k+1);
                  }
                };
              }

              var noSpaceName = "";

              if (chatName !== undefined) {
                for (var k = 0; k < chatName.length; k++) {
                  if (chatName.slice(k, k+1) !== " " && chatName.slice(k, k+1) !== "!") {
                    noSpaceName = noSpaceName + chatName.slice(k, k+1);
                  }
                };
              }



              var $username = $('<div></div>');
          //fix spaces on chatName to make a class
              $username.addClass("username");
              var $message = $('<div></div>')
              $username.text(chatName);
              $message.text(": " + chatBody);
              var $chat = $('<div></div>');
              $chat.addClass(noSpace).addClass("chat").addClass(noSpaceName);
              $chat.append($username);
              $chat.append($message);
              $('#chats').append($chat);
       //console.log(data);
        }
     }


   });
    $('.username').on('click', function() {
      event.stopPropagation();
      var thisUser = $(this).text();
      app.addFriend(thisUser);
    // console.log($(this).text());
    //app.addFriend("Jane Doe");
      var cleanName = "";

        if (thisUser !== undefined) {
          for (var k = 0; k < thisUser.length; k++) {
            if (thisUser.slice(k, k+1) !== " " && thisUser.slice(k, k+1) !== "!") {
              cleanName = cleanName + thisUser.slice(k, k+1);
            }
          };
        }
      var myFriend = "." + cleanName;
      $(myFriend).addClass("isFriend");
   });


    var $roomList = $('<div></div>');
    $roomList.attr("id",'roomSelect');
    for (key in window.rooms) {
      var $room = $('<div></div>');
      $room.text(key);
      $roomList.append($room);
    };



    $('body').append($roomList);

    $('#roomSelect').children().on('click', function() {
        $('.chat').removeClass("hidden");
        var currentRoom = '.' + $(this).text();
        var currentClean = "";
          for (var k = 0; k < currentRoom.length; k++) {
            if (currentRoom.slice(k, k+1) !== " " && currentRoom.slice(k, k+1) !== "!") {
              currentClean = currentClean + currentRoom.slice(k, k+1);
            }
          };
        $('.chat').not(currentClean).addClass("hidden");
        // $(currentRoom).removeClass("hidden");

    });
},
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //console.error('chatterbox: Failed to receive message');
  }
});
  };



app.clearMessages = function() {
  var childArr = $('#chats').children();
    for (var i = 0; i < childArr.length; i++) {
      childArr[i].remove();
    };
};

app.addMessage = function(message) {
    var $username = $('<div></div>');
    $username.addClass("username");
    var $message = $('<div></div>')
    $username.text(message.username);
    $message.text(message.message);
    var $chat = $('<div></div>');
    $chat.append($username);
    $chat.append($message);
    $('#chats').append($chat);
};

app.addRoom = function(room) {
  console.log(window.rooms[room]);
  if (window.rooms[room] === undefined) {
    window.rooms[room] = true;
    var $room = $('<div></div>');
    $room.text(room);
    $('#roomSelect').append($room);
  }
};

app.addFriend = function(friend) {
  if (window.friends[friend] === undefined) {
    window.friends[friend] = true;
  }
};



app.handleSubmit = function(userName) {
    var form = document.getElementById('form');
    var userMessage = document.getElementById('message');
    var messageContents = userMessage.value;
    var toSend = {};
    toSend.text = messageContents;
    toSend.username = userName;
    app.send(toSend);
};



//hold off on retrieving for a second
$(document).ready(function() {

  app.fetch();




   // get all the chats
  var $refreshButton = $('<button></button>');
  $refreshButton.addClass("refresh");
  $refreshButton.text("Refresh Chats");
  $('#main').append($refreshButton);

  $('.refresh').on('click', function() {
    app.clearMessages();
    $('#roomSelect').remove();
    app.fetch();
  });
   // clear chats
  var $clearButton = $('<button></button>');
  $clearButton.addClass("clear");
  $clearButton.text("Clear Chats");
  $('#main').append($clearButton);

  $('.clear').on('click', function() {
    app.clearMessages();
  });

  // get login information
  var login = document.getElementById('login');
  var userName = document.getElementById('username');
  var userNameValue = userName.value || "anonymous";

  $('#firstlogin').on('click', function() {
    userNameValue = userName.value;
    $('#login').text("Welcome, " + userNameValue);
  });

   // get chat body


  $('#send .submit').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    app.handleSubmit(userNameValue);
    $('#message').val(null);
    return false;
  }); 

  var roomform = document.getElementById('roomform');
  var roomname = document.getElementById('newroom');

  $('#submitroom').on('click', function() {
    app.addRoom(roomname.value);
    $('#newroom').val(null);
  }); 

});

//let's try to 
var username = "Max";
var somecontent = {username: "Max",
                text: "Hey there",
				roomname: "4chan"};

