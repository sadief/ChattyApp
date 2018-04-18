import React, {Component} from 'react';
import Chatbar from './Chatbar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
                  currentUser: {}, // optional. if currentUser is not defined, it means the user is Anonymous
                  messages: []
                }

            this.addMessage = this.addMessage.bind(this);
            this.changeUsername = this.changeUsername.bind(this);
        }

    componentDidMount() {
      console.log("componentDidMount <App />");
      this.socket = new WebSocket("ws://localhost:3001");

      this.socket.onmessage = (msg) => {
        let newText = JSON.parse(msg.data)
        const oldMessages = this.state.messages;
        const newMessages = [...oldMessages, {id: newText.id, username: newText.username, content: newText.content }]
        this.setState({messages: newMessages})
        // console.log('EVENT THINGY', (newText.id));
      }
        console.log('Connected to Server');


      setTimeout(() => {
        console.log("Simulating incoming message");
        // Add a new message to the list of messages in the data store
        const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
        const messages = this.state.messages.concat(newMessage)
        // Update the state of the app component.
        // Calling setState will trigger a call to render() in App and all child components.
        this.setState({messages: messages})
      }, 3000);

    }

      addMessage(msg, username) {
          var msg = {
            type: 'sendMessage',
            content: msg,
            username: username
          }

            this.socket.send(JSON.stringify(msg));
      }

      changeUsername(username) {
        this.setState({username: username});
        console.log('New Username', username)
      }

    render() {
        console.log("Rendering <App/>");
        return (
        <div>
        <Message />
        <MessageList messages = {this.state.messages} />
        <Chatbar username = {this.state.currentUser.name} onMessageSubmit = {this.addMessage} onUsernameChange = {this.changeUsername}/>
        </div>


        );
      }
    }

export default App;