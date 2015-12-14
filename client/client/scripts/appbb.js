//define a chatlist model

var server ='https://api.parse.com/1/classes/chatterbox';
//good style is to use capital, plural
var Chats = BackBone.Collection.extend({
	initialize:
	model: Chat,
	url: server
});


//define chat model
var Chat = BackBone.Model.extend({
	initialize:
	defaults: function() {
		return {
			username: "anonymous",
			message: "nothing much to say",
			room: "here"
		}
	};

});

var ChatsView = BackBone.View.extend({
	//render ties the view to the model
	//my whiteboard was incorrect!
	render: function() {
		this.$el.html(this.template(this.model.attributes));
	}
});

var ChatView = BackBone.View.extend({
	render: function() {

	}
});

//not sure where this code goes
	//but we need to populate the board
var chatBoard = new Chats();
	//we might need to modify the fetch method
		//for more specialized error methods
chatBoard.fetch();

//define other models and collections later