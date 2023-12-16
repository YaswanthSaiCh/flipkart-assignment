const api = "https://my-json-server.typicode.com/codebuds-fk/chat/chats";
const chatsList = document.querySelector(".chats-list");
const searchBox = document.querySelector("#search-box");
const chatContainer = document.querySelector(".chats-container");
let apiData = [];

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    apiData = data;
    showChatList(data);
  })
  .catch((error) => console.log(error));

searchBox.addEventListener("input", handleFilterData);

function showChatList(chatList) {
  chatList.map((chat) => {
    const chatItems = createChatItem(chat);
    chatsList.innerHTML += chatItems;
    const singleChatItemList = document.querySelectorAll(".single-chat");

    singleChatItemList.forEach((item) => {
      item.addEventListener("click", (event) => {
        singleChatItemList.forEach((chat) => {
          chat.classList.remove("active-chat");
        });
        item.classList.add("active-chat");
        const chatId = event.target.innerHTML;
        const selectedChat = apiData.find((chat) => chat.orderId === chatId);
        showChatDetails(selectedChat);
      });
    });
  });
}

function createChatItem(chat) {
  const imageUrl = chat.imageURL;
  const date = timestampToDate(chat.latestMessageTimestamp);
  const orderId = chat.orderId;
  const title = chat.title;
  const msgList = chat.messageList;
  return `<li class="single-chat" id=${chat.id}>
            <div class="chat-info">
                <div class="product-icon">
                    <img
                    src=${imageUrl}
                    alt="product-icon"
                    />
                </div>
                <div class="chat-details">
                    <p class="chat-title">${title}</p>
                    <p class="chat-orderId">${orderId}</p>
                    ${
                      msgList.length > 0
                        ? `<p class="chat-text">${
                            msgList[msgList.length - 1].message
                          }</p>`
                        : ""
                    }
                </div>
                <div class="chat-date">${date}</div>
            </div>
        </li>`;
}

function timestampToDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
function handleFilterData() {
  const searchTerm = searchBox.value.toLowerCase();
  chatsList.innerHTML = "";
  const filteredChat = apiData.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchTerm) ||
      chat.orderId.toLowerCase().includes(searchTerm)
  );
  showChatList(filteredChat);
}

function showChatDetails(chat) {
  const chatDetails = createChatDetails(chat);
  const existingRightPanel = document.querySelector(".right-panel");

  if (existingRightPanel) {
    existingRightPanel.remove();
  }
  const rightPanel = document.createElement("section");
  rightPanel.className = "right-panel";
  rightPanel.innerHTML = chatDetails;
  chatContainer.appendChild(rightPanel);
}

function createChatDetails(chat) {
  const title = chat.title;
  const imageUrl = chat.imageURL;
  const msgList = chat.messageList;

  const chatDetailsHTML = `<nav class="right-panel-header">
                                <div class="product-icon">
                                    <img
                                    src=${imageUrl}
                                    alt="product-icon"
                                    />
                                </div>
                                <h4>${title}</h4>
                            </nav>
                            <div class="selected-chat-details">
                                ${
                                  msgList.length > 0
                                    ? `<ul class=message-list>
                                        ${msgList
                                          .map((msg) => getMsgList(msg))
                                          .join("")}
                                    </ul>`
                                    : `<div class=empty-chat>
                                    Send a message to start chatting
                                    </div>`
                                }
                            </div>
                            <footer>
                                <div class="input-container">
                                    <input type="text" class="input-field" placeholder="Type your message...">
                                    <div class="send-icon" onclick="sendMessage()">Send</div>
                                </div>
                            </footer>`;

  return chatDetailsHTML;
}

function getMsgList(messageInfo) {
  const { messageId, message, timestamp, sender, messageType } = messageInfo;
  const formattedTimestamp = timestampToDate(timestamp);

  const alignmentClass = sender === "USER" ? "right" : "left";

  return `
          <li class="message ${alignmentClass}">
                <div>
                    <p>${message}</p>
                    <span class="timestamp">${formattedTimestamp}</span>
                </div>
            </li>`;
}

const inputField = document.querySelector(".text-box");

function sendMessage() {
  const inputField = document.querySelector(".input-field");
  const inputValue = inputField.value.trim();
  console.log(inputValue);

  if (inputValue !== "") {
    const newUserMessage = {
      messageId: "user-msg-" + Date.now(),
      message: inputValue,
      timestamp: Date.now(),
      sender: "USER",
      messageType: "text",
    };

    const selectedChatDetails = document.querySelector(
      ".selected-chat-details"
    );
    const messageList = selectedChatDetails.querySelector(".message-list");
    const messageHTML = getMsgList(newUserMessage);
    messageList.innerHTML += messageHTML;

    inputField.value = "";
  }
}
