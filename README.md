# The emarket web app (client)

This project is a simple e-commerce web app with core features are posting product, real-time chating which are built using popular technologies such as ReactJS, NodeJS, SocketIo, PostgreSQL, etc.

The app uses Node.js v18 as development environment.

Source:
- [Client](https://github.com/hieu-22/client-online-market-app.git)
- [Server](https://github.com/hieu-22/server-online-market-app.git)

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation
Note: The app uses Node.js v18 as development environment.

Clone the repository:
```sh
$git clone https://github.com/hieu-22/client-online-market-app.git
```
Install dependencies by running `npm install`:
```sh
npm install
```
## Usage
Set .env file
```sh
PORT=3000
NODE_ENV=development
REACT_APP_BACKEND_URL=http://localhost:3001/api
REACT_APP_IS_LOCALHOST=1

# CLOUDINARY config, default: 
REACT_APP_CLOUDINARY_NAME="duhbzyhtj" 
REACT_APP_CLOUDINARY_UNSIGNED_UPLOAD_PRESET="qtfrqrsg"
```
If you want to use your own Cloudinary for image storage, read [React SDK](https://cloudinary.com/documentation/react_integration) for more information.

Run app:
```sh
npm start
```
For more information: [React documentation](https://reactjs.org/).

## Features
- Product Posting: Users can create their product information such as (images, title, prices, etc.). Other users can view, save, search, create chats with posts.
- Realtime Chating: Users can chat to each other within or without a specific post.

## Technologies Used
- ReactJS
- Redux/@toolkit
- SocketIO
- Tailwind CSS

## Contributing
1. [Appending features](#1-appending-features)
2. [Website Layout](#2-website-layout)

### 1. Appending features
To add a new feature (Chat feature, for example), follow these steps:
- Create a new folder name that represent for the feature (e.g. `./src/features/Chat`)
- Create page (e.g. ChatPage.jsx)
  ```javascript
  //  ./src/features/Chat/ChatPage.jsx
  
  // import packages
  import {useState, useEffect} from "react"
  import {useSelector, useDispatch} from "react-redux"
  // import state and avaiable components
  const ChatPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // # redux state 
    // # write functionalities including state, effect, handler, etc.
    
    // # page components
    const component = ({props}) => {
      return (
        <div className={`tailwindcss here`}> component </div>
      )
    }
    
    return (
      // layout
      <div className="tailwindcss">
        <div className="tailwindcss"> {component} </div>
      <div>
    )
  }
  export default ChatPage
  ```
- Create a slice and api files for the feature (e.g. `chatSlice.js` and `chatApi.js`). Read [createSlice](https://redux-toolkit.js.org/api/createSlice) and [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) here.
  ```javascript
  // chatApi
  import axios from "../../axios"
  // import more here `import { addTimeAgo } from "../../utils/DateUtils"`
  
  export const addChatApi = async ({ userId, postId }) => {
    const response = await axios.post(
        `/conversations/create?userId=${userId}&postId=${postId}`
    )
    // handle retrieved before sending data to redux state
    return response.data
  }
  // more APIs here
  
  ```
  ```javascript
  // chatSlice.js
  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
  import { addChatApi } from "./chatApi"
  const initialState = {
      chats: [],
      // more states here
      status: "idle",
      error: null,
  }
  
  // # Thunks
  export const addChatThunk = createAsyncThunk(
    "chat/addChatThunk",
    async ({ userId, postId }, { rejectWithValue }) => {
        try {
            const data = await addChatApi({ userId, postId })
            return data
        } catch (error) {
            // handling error with rejectWithValue()
        }
    }
  )
  // more thunks here
  
  const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
      resetChatStatus(state, action) {
            state.status = "idle"
      },
      // more actions here
    },
    extraReducers: (builder) => { 
       builder
            //addChatApi
            .addCase(addChatApi.pending, (state) => {
                state.status = "loading"
            })
            .addCase(addChatApi.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.chats = action.payload
            })
            .addCase(addChatApi.rejected, (state, action) => {
                state.status = "failed"
                // do something with error
            })
            // more handlers here
    }
  }

  export const selectAllChats = (state) => state.chat.chats
  export const selectChatError = (state) => state.chat.error
  export const selectChatStatus = (state) => state.chat.status
  export const { resetChatStatus // , more actions} = chatSlice.actions
  
  export default chatSlice.reducer
  
  ```
  ```javascript
  // at ./src/app/store.js

  import chatReducer from "../features/Chat/chatSlice"
  // ...
  export const store = configureStore({
    reducer: {
        // ...
        chat: chatReducer,
    },
    // ...
  }
  ```
- Apply page with a specific web pathname (e.g. `/chat`)
  ```javascript
  import React, { useEffect } from "react"
  import { Routes, Route } from "react-router-dom"
  import chatPage from "./features/Chat/chatPage"
  
  //...
  
  const App = () => {
    return (
       <Routes>
        <Route path="/" element={<Layout />}>
            // Other Routes ...
            <Route path="/chat" element={<chatPage />} />
        </Route>
       </Routes>
    )
  }
  
  //...
  export default App
  
  ```

#### Folder structure:
```sh
├── public
├── src
│    ├── app/store.js
│    ├── components
│    ├── features
│    │   ├── Chat
│    │         ├── chatPage.jsx
│    │         ├── chatSlice.js
│    │         └── chatApi.js
└── tailwind.config.js
```
### 2. Website Layout
The Layout styles at `./src/components/Layout.jsx` affect to multiple components. The <Outlet /> in Layout represent for the actual page component (e.g. ChatPage.jsx).
Read [`<Outlet>`](https://reactrouter.com/en/main/components/outlet)

Therefore, when modifying `Layout.jsx`, it's important to make sure that the changes do not break any other UI or functionalities.
```javascript
const Layout = () => {
  // ...
  const Header = (
    <div>header ... </div>
  )
  const Footer = (
    <div>Footer ... </div>
  )
  return (
          <div>
              <div className="layout style">{Header}</div>
              <div className="layout style">
                    <Outlet />
              </div>
              <div>{Footer}</div>
          </div>
  )
}
  
export default Layout

```

## License
I'm happy that someone appreciates my project and use it for their studying or any purposes. It's free to use this project.
