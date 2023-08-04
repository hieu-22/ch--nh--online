import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Homepage from "./features/Home/Homepage"
import LoginForm from "./features/Auth/LoginForm"
import RegisterForm from "./features/Auth/RegisterForm"

import AuthorizedUserPage from "./features/Auth/AuthorizedUserPage"
import OtherUserPage from "./features/User/OtherUserPage"
import PhoneNumberForm from "./features/Auth/PhoneNumberForm"
import AddPostPage from "./features/Post/AddPostPage"
import SinglePostPage from "./features/Post/SinglePostPage"
import UserSettingPage from "./features/User/UserSettingPage"
import ChatPage from "./features/Chat/ChatPage"
import PostDashboard from "./features/Post/PostDashboard"
import UpdatePostPage from "./features/Post/UpdatePostPage"
import SavedPostsPage from "./features/Post/SavedPostsPage"
import SingleChatPage from "./features/Chat/SingleChatPage"
import NotFoundPage from "./features/Error/NotFoundPage"
import HintUsersListPage from "./features/User/HintUsersListPage"
import FollowedUsersListPage from "./features/User/FollowedUsersListPage"
import SearchResultPage from "./features/Home/SearchResultPage"

import { socket } from "./socket"
import { useSelector } from "react-redux"
import { selectUser } from "./features/Auth/authSlice"

const App = () => {
    const user = useSelector(selectUser)

    useEffect(() => {
        if (user) {
            socket.connect()
            socket.emit("activateUserOnlineStatus", user.id)
            return () => {
                socket.disconnect()
            }
        }
    }, [user])

    return (
        <main>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path="/search" element={<SearchResultPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                        path="/add-phone-number"
                        element={<PhoneNumberForm />}
                    />
                    <Route path="/user/:userId" element={<OtherUserPage />} />
                    <Route
                        path="/users/suggests"
                        element={<HintUsersListPage />}
                    />
                    <Route
                        path="/users/following"
                        element={<FollowedUsersListPage />}
                    />
                    <Route
                        path="/user/setting/profile"
                        element={<UserSettingPage />}
                    />
                    <Route
                        path="/user/myProfile"
                        element={<AuthorizedUserPage />}
                    />

                    <Route path="/posts/new-post" element={<AddPostPage />} />

                    <Route
                        path="/posts/my-saved-posts"
                        element={<SavedPostsPage />}
                    />
                    <Route
                        path="/posts/:postUrl"
                        element={<SinglePostPage />}
                    />

                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/chat/:chatId" element={<SingleChatPage />} />

                    <Route
                        path="/dashboard/posts"
                        element={<PostDashboard />}
                    />
                    <Route
                        path="/update-post/:postUrl"
                        element={<UpdatePostPage />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </main>
    )
}

export default App
