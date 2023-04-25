const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
console.log(roomContainer);
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

function joinRoom(roomName) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/room', true);
  var params = `room=${roomName}`;
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);


}

if (messageForm != null) {
  const name = prompt('Create a username')
  appendMessage('You joined')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  console.log('room created');
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'

  const roomContainerItem = document.createElement('div');
  roomContainerItem.className = 'room-container-item';
  roomContainerItem.append(roomElement, roomLink);
  if (roomContainer) {
    roomContainer.append(roomContainerItem);
    roomContainer.append(roomLink)
  }

})

// Add default rooms when user loads the chat page
// const defaultRooms = ['anxiety', 'stress', 'suicidal-thoughts', 'depression']
// defaultRooms.forEach(room => {
//   const roomElement = document.createElement('div')
//   roomElement.innerText = room
//   const roomLink = document.createElement('a')
//   roomLink.href = `/${room}`
//   roomLink.innerText = 'join'
//   roomContainer.append(roomElement)
//   roomContainer.append(roomLink)
// })

const defaultRooms = []

defaultRooms.forEach(room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room

  const roomLink = document.createElement('a')
  // roomLink.href = `/${room}`;
  roomLink.innerText = 'join';
  roomLink.className = 'room-link';
  roomLink.setAttribute('onclick', `joinRoom('${room}')`)

  const roomContainerItem = document.createElement('div');
  roomContainerItem.className = 'room-container-item';
  roomContainerItem.append(roomElement, roomLink);

  // Add click event listener to each room link
  roomLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    window.location.href = event.target.href; // Redirect to chat room path
  })

  if (roomContainer) { roomContainer.append(roomContainerItem); }

})


socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
