import { Component, For, createSignal, onCleanup, onMount } from 'solid-js';
import {v4 as uuidv4} from 'uuid';
import * as signalR from "@microsoft/signalr";
import './App.module.css';


type Message = {
  username: string,
  content: string
}

const App: Component = () => {
  let connection: signalR.HubConnection;
  let username: string;
  onMount(async () => {
    username = uuidv4();
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
      })
    }
    connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5280/hub")
    .build();
    await connection.start();
    await connection.send("GetClientCount");
    connection.on("messageReceived", (username: string, message: string) => {
      appendMessages({username, content: message });
    });
    connection.on("networkUpdate", (clientCount) => {
      setConnections((_val) => clientCount);
    });
  });

  onCleanup(async () => {
    await connection.stop();
  });

  const [messages, setMessages] = createSignal<Message[]>([]);
  const [connections, setConnections] = createSignal(0);
  const [currentMessage, setCurrentMessage] = createSignal('');

  const appendMessages = (newMessage: Message) => setMessages((messages) => [...messages, newMessage]);
  const updateContent = (e: string) =>  setCurrentMessage((_) => e);  

  const send = () => {
    connection.send("newMessage", username, currentMessage())
      .then(() => (setCurrentMessage(() => "")));
  };

  return (
    <>
      <div id="divMessages" class="messages">
        <For each={messages()} fallback={<div class="message-author"> It's too quiet </div>}>
            {(message) =>   
              <div class="message-author">
                <span>
                  {message.username}:&nbsp;
                </span>
                <span>
                  {message.content}
                </span>
              </div>
            }
        </For>
      </div>
      <div class="input-zone">
        <label id="lblMessage" for="tbMessage"> Message: </label>
        <input 
          id="tbMessage" 
          class="input-zone-input" 
          type="text" 
          value={currentMessage()} 
          onChange={(e) => {updateContent(e.target.value)}} 
          onKeyUp={(e) => e.key === "Enter" ? send(): {} }
        />
        <button id="btnSend" onClick={() => send()} > Send </button>
      </div>
      <div>
        # Clients: {connections()}
      </div>
    </>
  );
};

export default App;

