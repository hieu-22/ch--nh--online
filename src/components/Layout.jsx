import React, { useState, useEffect, useRef } from "react"
import {
    Outlet,
    useNavigate,
    useLocation,
    Link,
    NavLink,
    ScrollRestoration,
} from "react-router-dom"

// react-icons
import { MdPostAdd } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import { BiUser, BiBell, BiChat, BiUserCircle } from "react-icons/bi"
import { AiFillControl, AiFillWechat, AiFillBell } from "react-icons/ai"
import { MdHelpCenter, MdHome } from "react-icons/md"
import { AiFillHeart, AiFillSetting } from "react-icons/ai"
import {
    BsFillBookmarkFill,
    BsStarFill,
    BsFillArrowUpCircleFill,
} from "react-icons/bs"
import { RiPencilFill } from "react-icons/ri"
import { RxTriangleDown, RxExit } from "react-icons/rx"
import { FaUserCircle } from "react-icons/fa"
import { FaUserFriends, FaUsers, FaTools } from "react-icons/fa"
import { RiMessage2Fill } from "react-icons/ri"
import { IoHome } from "react-icons/io5"
//
import CustomToastify from "./CustomToastify"
import ErrorPage from "../features/Error/ErrorPage"

// redux
import { useDispatch, useSelector } from "react-redux"

import {
    logout,
    selectAuthError,
    selectError,
} from "../features/Auth/authSlice"
import { selectPostError } from "../features/Post/postSlice"
import { selectChatError } from "../features/Chat/chatSlice"
import { selectUserError } from "../features/User/userSlice"

import { selectLocationError } from "../features/Post/locationSlice"
import { selectSearchedPosts } from "../features/Post/postSlice"
import Loader from "./Loader"
import { ToastContainer, toast } from "react-toastify"

import {
    selectAuthStatus,
    updateUserIsOnline,
} from "../features/Auth/authSlice"
import { socket } from "../socket"
const Layout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const timeoutRef = useRef(null)

    // COMPONENT'S STATES
    const [isfullScreenAndNoScroll, setIsfullScreenAndNoScroll] = useState(null)
    const [isAccountWindowShowed, setIsAccountWindowShowed] = useState(false)
    const [isNotificationWindowShowed, setIsNotificationWindowShowed] =
        useState(false)
    const [Loading, setLoading] = useState(false)
    const [footerHidden, setFooterHidden] = useState(false)
    const [searchkeys, setSearchKeys] = useState("")
    const [notificationWindowStatus, setNotificationWindowStatus] =
        useState("onActivities") // onActivities or onNews
    const [searchHintsShowed, setSearchHintsShowed] = useState(false)
    const [isToastActive, setIsToastActive] = useState(false)
    const [goUpHandlerShowed, setGoUpHandlerShowed] = useState(null)

    // REDUX STATES
    const user = useSelector((state) => state.auth.user)
    const followingUsers = user?.followingUsers
    const followers = user?.followers
    const authStatus = useSelector(selectAuthStatus)
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const searchedPosts = useSelector(selectSearchedPosts)
    const authError = useSelector(selectAuthError)
    const chatError = useSelector(selectChatError)
    const userError = useSelector(selectUserError)
    const postError = useSelector(selectPostError)

    // EFFECTS
    // + navigate to add phoneNumber page if user don't have phoneNumber
    useEffect(() => {
        if (user) {
            if (!user.phoneNumber) {
                navigate("/add-phone-number")
            }
        }
    }, [user])

    useEffect(() => {
        setIsAccountWindowShowed(false)
        setIsNotificationWindowShowed(false)
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 200)
    }, [location.pathname])

    useEffect(() => {
        socket.on("updateIsOnline", () => {
            if (user?.isOnline) return
            dispatch(updateUserIsOnline())
        })
        return () => {
            socket.off("updateIsOnline")
        }
    }, [])
    useEffect(() => {
        const currentPath = window.location.pathname
        if (currentPath.startsWith("/chat")) {
            setFooterHidden(true)
            setIsfullScreenAndNoScroll(true)
            return
        }
        setFooterHidden(false)
        setIsfullScreenAndNoScroll(false)
    }, [location.pathname])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    // -- handle show go to handler
    const prevScrollPosRef = useRef(0)
    useEffect(() => {
        const handleScrollDown = () => {
            const currentScrollPos = window.pageYOffset
            // console.log(
            //     currentScrollPos,
            //     " - ",
            //     prevScrollPosRef,
            //     " : ",
            //     currentScrollPos < prevScrollPosRef
            // )
            if (currentScrollPos < prevScrollPosRef.current) {
                setGoUpHandlerShowed(true)
                clearTimeout(timeoutRef.current)
                // to off after `timer`
                timeoutRef.current = setTimeout(() => {
                    setGoUpHandlerShowed(false)
                }, 2000)
                prevScrollPosRef.current = currentScrollPos
            } else {
                setGoUpHandlerShowed(false)
                prevScrollPosRef.current = currentScrollPos
            }
        }

        window.addEventListener("scroll", handleScrollDown)
        return () => {
            clearTimeout(timeoutRef.current)
            window.removeEventListener("scroll", handleScrollDown)
        }
    }, [])

    /**HANDLERS */
    const handleShowToast = (message, status) => {
        if (!isToastActive) {
            if (status === "info") {
                toast.info(message, {
                    autoClose: 1000,
                })
            } else if (status === "warn") {
                toast.warn(message, {
                    autoClose: 1000,
                })
            } else if (status === "error") {
                toast.error(message, {
                    autoClose: 1000,
                })
            } else {
                toast(message, {
                    autoClose: 1000,
                })
            }

            setIsToastActive(true)
            setTimeout(() => {
                setIsToastActive(false)
            }, 3000)
        }
    }
    const handleReload = () => {
        window.location.reload()
    }

    const handleCloseAllWindows = (event) => {
        if (
            isAccountWindowShowed ||
            isNotificationWindowShowed ||
            searchHintsShowed
        ) {
            setIsAccountWindowShowed(false)
            setIsNotificationWindowShowed(false)
            setSearchHintsShowed(false)
        }
    }

    const handleShowAccountWindow = (event) => {
        event.stopPropagation()
        setIsNotificationWindowShowed(false)
        setIsAccountWindowShowed(!isAccountWindowShowed)
    }

    const handleShowNotificationWindow = (event) => {
        event.stopPropagation()
        setIsAccountWindowShowed(false)
        setIsNotificationWindowShowed(!isNotificationWindowShowed)
    }

    const handleAddNewPost = () => {
        if (!isLoggedIn) {
            if (window.location.href === "http://localhost:3000/login") {
                return handleShowToast("Vui lòng đăng nhập!")
            }
            return navigate("/login")
        }
        navigate("/posts/new-post")
    }

    const handleLogout = async () => {
        socket.disconnect()
        dispatch(logout())
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 200)
        setIsAccountWindowShowed(false)
        navigate("/")
    }

    /*Components */
    const LogoBox = (
        <div
            className=""
            onClick={() => {
                if (window.location.href === "http://localhost:3000/") {
                    return handleReload()
                }
                navigate("/")
            }}
        >
            <div className="relative cursor-pointer select-none rounded-50 py-2  text-primary text-2xl font-extrabold">
                <span>eMarket</span>
            </div>
        </div>
    )
    const AccountWindow = (
        <div
            className="bg-white z-[50] absolute top-10 right-0 w-[300px] py-2 shadow-big text-base rounded-sm select-none"
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div className="flex items-center justify-start pb-3 px-4">
                {isLoggedIn ? (
                    <>
                        <div className="cursor-pointer flex items-center gap-x-4">
                            <div className={`relative h-10 w-10 rounded-[50%]`}>
                                {user?.avatar ? (
                                    <img
                                        className="w-full h-full object-cover rounded-[50%] image-rendering-pixelated"
                                        src={user.avatar}
                                        alt="avatar"
                                    />
                                ) : (
                                    <>
                                        <FaUserCircle className="w-full h-full text-gray-600 rounded-[50%]"></FaUserCircle>
                                    </>
                                )}
                                <div
                                    className="absolute bottom-0 -right-1 flex items-center justify-center z-10 h-5 w-5 rounded-[50%] bg-gray-500 hover:scale-[1.1]"
                                    onClick={() => {
                                        navigate("/user/setting/profile")
                                    }}
                                >
                                    <RiPencilFill className="h-3 w-3 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className="text-lg max-w-[100%] font-medium hover:opacity-70 truncate text-ellipsis line-clamp-1"
                                    onClick={(event) => {
                                        handleCloseAllWindows()
                                        const currentUrl = location.pathname
                                        if (!isLoggedIn) {
                                            if (
                                                window.location.href ===
                                                "http://localhost:3000/login"
                                            ) {
                                                return handleShowToast(
                                                    "Vui lòng đăng nhập"
                                                )
                                            }
                                            return navigate("/login")
                                        }
                                        if (
                                            currentUrl.startsWith(
                                                "http://localhost:3000/user/myProfile"
                                            )
                                        ) {
                                            return
                                        }
                                        navigate(`/user/myProfile`)
                                    }}
                                >
                                    <span className="inline-block max-h-">
                                        {user?.userName ? user.userName : ""}
                                    </span>
                                    <span
                                        className={
                                            `ml-3 inline-block mx-1  w-2 h-2 rounded-[50%] ` +
                                            (user?.isOnline
                                                ? "bg-green-600"
                                                : "bg-gray-600")
                                        }
                                    ></span>
                                </div>

                                <div className=" inline-flex items-center text-xs">
                                    <div className="font-medium hover:opacity-70">
                                        Người theo dõi{" "}
                                        <span className="font-bold ml-1">
                                            {followers?.length || 0}
                                        </span>
                                    </div>
                                    <span className="px-2">|</span>
                                    <div className="font-medium hover:opacity-70">
                                        Đang theo dõi{" "}
                                        <span className="font-bold ml-1">
                                            {followingUsers?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="">
                            <BiUserCircle className="m-auto w-10 h-10 object-contain text-text" />
                        </div>
                        <div className="ml-3 text-lg font-semibold">
                            <NavLink
                                to={"/login"}
                                className="hover:underline hover:text-primary cursor-pointer"
                            >
                                Đăng nhập
                            </NavLink>
                            /{" "}
                            <NavLink
                                to={"/register"}
                                className="hover:underline hover:text-primary cursor-pointer"
                            >
                                Đăng ký
                            </NavLink>
                        </div>
                    </>
                )}
                <div></div>
            </div>

            {/* Nav */}
            <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Lối tắt
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        navigate("/")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-400">
                        <IoHome className="text-white translate-y-[-1px]" />
                    </div>
                    <div className="font-light">Trang chủ</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/posts/new-post")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-400">
                        <MdPostAdd className="text-white scale-[1.1]" />
                    </div>
                    <div className="font-light">Đăng tin</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/users/following")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-400">
                        <FaUsers className="text-white" />
                    </div>
                    <div className="font-light">Người dùng khác</div>
                </div>
            </div>
            {/* Tiện ích    */}
            <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Tiện ích
                </div>

                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/chat")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-green-500">
                        <RiMessage2Fill className="text-white" />
                    </div>
                    <div className="font-light">Tin nhắn</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/posts/my-saved-posts")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-red-500">
                        <AiFillHeart className="text-white" />
                    </div>
                    <div className="font-light">Tin đăng đã lưu</div>
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("/dashboard/posts")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-yellow-500">
                        <FaTools className="text-white scale-[0.85]" />
                    </div>
                    <div className="font-light">Quản lí tin</div>
                </div>
            </div>
            {/* Khác */}
            <div>
                <div className="px-3 py-1 bg-primary text-base text-white font-semibold">
                    Khác
                </div>
                <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!isLoggedIn) {
                            if (window.location.pathname === "/login") {
                                return handleShowToast("Vui lòng đăng nhập")
                            }
                            return navigate("/login")
                        }
                        navigate("user/setting/profile")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%] bg-gray-400">
                        <AiFillSetting className="text-white" />
                    </div>
                    <div className="font-light">Cài đặt tài khoản</div>
                </div>
                {/* <div
                    className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                    onClick={() => {
                        if (!user) {
                            return navigate("/login")
                        }
                        handleShowToast("Chức năng đang cập nhật!", "info")
                    }}
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-[50%]  bg-gray-400">
                        <MdHelpCenter className="text-white" />
                    </div>
                    <div className="font-light">Trợ giúp</div>
                </div> */}
                {isLoggedIn ? (
                    <div
                        className="flex items-center gap-x-2 py-2 px-4 bg-stale hover:bg-background cursor-pointer"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-[50%]  bg-gray-400">
                            <RxExit className="text-white" />
                        </div>
                        <div className="font-light">Đăng xuất</div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
    const NotificationWindow = (
        <div
            className="bg-white z-10 absolute top-10 right-0 w-[360px] shadow-boxMd"
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div className="flex items-center border-b-[1px] border-gray-600">
                <div
                    className={`${
                        notificationWindowStatus === "onActivities"
                            ? " border-primary border-b-2"
                            : ""
                    }  py-3 w-6/12 text-center text-base font-semibold cursor-pointer hover:bg-blue-100`}
                    onClick={() => setNotificationWindowStatus("onActivities")}
                >
                    Hoạt động
                </div>
                <div
                    className={`${
                        notificationWindowStatus === "onNews"
                            ? " border-primary border-b-2"
                            : ""
                    } py-3 w-6/12 text-center  text-base font-semibold cursor-pointer  hover:bg-blue-100`}
                    onClick={() => setNotificationWindowStatus("onNews")}
                >
                    Tin mới
                </div>
            </div>
            {notificationWindowStatus === "onActivities" ? (
                <>
                    {user ? (
                        <div className="p-3">
                            <div className="text-center">
                                Chức năng đang được cập nhật!
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-3">
                                <div className="text-center">
                                    Vui lòng đăng nhập để xem hoạt động
                                </div>
                            </div>
                            <div
                                className="py-3 flex justify-center"
                                onClick={() => {
                                    navigate("/login")
                                }}
                            >
                                <span className="text-white bg-primary text-base font-semibold py-2 px-3 rounded-md hover:opacity-70 active:opacity-100 cursor-pointer">
                                    Đăng ký/Đăng nhập
                                </span>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <></>
            )}
            {notificationWindowStatus === "onNews" ? (
                <>
                    {user ? (
                        <div className="p-3">
                            <div className="text-center">
                                Hiện bạn không có cập nhật nào
                            </div>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="text-center">
                                Hiện bạn không có cập nhật nào
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    )

    const Navbar = (
        <nav>
            <ul className="flex items-center justify-around gap-x-6">
                <li className="hidden laptop:block">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer "
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }
                                return navigate("/login")
                            }
                            navigate("/dashboard/posts")
                        }}
                    >
                        <div className="">
                            <AiFillControl className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="text-text">Quản lí tin</div>
                    </div>
                </li>
                <li className="hidden tablet:block">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer "
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }
                                return navigate("/login")
                            }
                            navigate("/users/following")
                        }}
                    >
                        <div className="">
                            <FaUserFriends className="w-6 h-6 text-slate-600 " />
                        </div>
                        <div className="text-text">Người dùng</div>
                    </div>
                </li>
                <li className="hidden phone:block">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer"
                        onClick={() => {
                            if (!isLoggedIn) {
                                if (
                                    window.location.href ===
                                    "http://localhost:3000/login"
                                ) {
                                    return handleShowToast("Vui lòng đăng nhập")
                                }

                                return navigate("/login")
                            }
                            navigate("/chat")
                        }}
                    >
                        <div className="">
                            <AiFillWechat className="w-7 h-7 text-slate-600" />
                        </div>
                        <div className="text-text">Chat</div>
                    </div>
                </li>
                <li className="relative hidden smallPhone:block">
                    <div
                        className="flex items-center gap-x-1 hover:opacity-70 cursor-pointer"
                        onClick={(event) => handleShowNotificationWindow(event)}
                    >
                        <div className="">
                            <AiFillBell className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="text-text">Thông báo</div>
                    </div>
                    {isNotificationWindowShowed ? NotificationWindow : <></>}
                </li>
                <li className="relative ">
                    <div
                        className="flex items-center gap-x-1  hover:opacity-70 cursor-pointer"
                        onClick={(event) => handleShowAccountWindow(event)}
                    >
                        {isLoggedIn ? (
                            <>
                                <div className="inline-flex items-center gap-x-1">
                                    <div className="w-6 h-6 rounded-[50%]">
                                        {user?.avatar ? (
                                            <img
                                                className="w-full h-full object-cover rounded-[50%] image-rendering-pixelated"
                                                src={user.avatar}
                                                alt="avatar"
                                            />
                                        ) : (
                                            <>
                                                <FaUserCircle className="w-full h-full text-gray-600 rounded-[50%]"></FaUserCircle>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-text text-ellipsis line-clamp-1">
                                        {user?.userName ? user.userName : ""}
                                    </div>
                                    <div>
                                        <RxTriangleDown />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <BiUser className="w-6 h-6 " />
                                </div>
                                <div className="text-text  ">Tài khoản</div>
                            </>
                        )}
                    </div>
                    {isAccountWindowShowed ? AccountWindow : <></>}
                    {isAccountWindowShowed ? (
                        <div className="absolute left-2 z-50 ">
                            <div className=" !w-0 !h-0 border-transparent border-t-[16px] border-r-[24px] border-b-[16px] border-l-[24px] border-r-white rounded-[2px]"></div>
                        </div>
                    ) : (
                        <></>
                    )}
                </li>
            </ul>
        </nav>
    )

    const Header = (
        <header className="h-full bg-background text-[1rem]">
            <div
                className={`m-auto px-6
                            laptop:max-w-[1024px]
                            desktop:max-w-[1024px] desktop:px-0`}
            >
                <div className="flex justify-between items-center py-4 ">
                    {LogoBox}
                    {Navbar}
                </div>
            </div>

            <div
                className={`flex justify-between items-center mx-auto
                minScreen:px-6
                laptop:max-w-[1024px] 
                desktop:max-w-[1024px] desktop:!px-0 
                `}
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                <div className="flex items-center w-full relative">
                    <input
                        className="px-4 w-full rounded border-[1px] border-gray-200 shadow-boxMd py-2  text-sm p-1 focus:outline-4 outline-primary"
                        type="text"
                        placeholder="Tìm kiếm ..."
                        name="searchkey"
                        value={searchkeys}
                        onChange={(event) => {
                            setSearchKeys(event.target.value)
                        }}
                        onFocus={() => {
                            if (!searchHintsShowed) {
                                setSearchHintsShowed(true)
                            }
                        }}
                        autoComplete="true"
                    />
                    <button
                        className="absolute  right-0  inline-flex items-center justify-center  rounded-r  bg-button h-9 w-9 bg-primary active:opacity-80 cursor-pointer"
                        onClick={() => {
                            navigate(`search?q=${searchkeys}`)
                        }}
                    >
                        <FiSearch className="text-white "></FiSearch>
                    </button>
                </div>
                <div
                    className={`hidden items-center justify-end gap-x-1 flex-row min-w-[160px]
                                tablet:flex
                `}
                >
                    <div
                        onClick={handleAddNewPost}
                        className="flex items-center text-sm py-[6px] px-2  text-white bg-primary hover:bg-light-primary rounded cursor-pointer"
                    >
                        <MdPostAdd className="h-6 w-6" />
                        <span className="ml-2 font-semibold">ĐĂNG TIN</span>
                    </div>
                </div>
            </div>
        </header>
    )

    const Footer = (
        <footer>
            <div className="px-6 bg-neutral-700 py-6 text-gray-300 desktop:px-0">
                <div className="laptop:w-laptop m-auto">
                    <div className="flex items-center">
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Trang chủ
                        </Link>
                        <span className="px-2"> | </span>
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Hướng dẫn & Hỗ trợ
                        </Link>
                        <span className="px-2"> | </span>
                        <Link
                            to=""
                            className="hover:underline hover:text-gray-400"
                        >
                            Nội quy & quy chế
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 py-4 text-sm">
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại Android
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Iphone
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Điện thoại phổ thông
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Phụ kiện điện thoại
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Iphone cũ
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Laptop
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Ultrabook
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Workstation
                                </Link>
                            </li>
                        </ul>
                        <ul>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Camera
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Phụ kiện camera
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link
                                    to=""
                                    className="hover:underline hover:text-gray-400"
                                >
                                    Ống kính
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-800 text-gray-300 py-4">
                <div className="laptop:w-laptop m-auto text-sm flex flex-col items-center">
                    <p>©2023 by Nguyen Minh Hieu</p>
                    <p>
                        Email:{" "}
                        <a
                            className="hover:underline"
                            href="mailto:hieung180114@gmail.com"
                        >
                            hieung180114@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )

    // RETURN ERROR PAGE IF MATCH CONDITIONS
    if (authError?.statusCode === 503 || authError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={authError.statusCode}
                message={authError.statusText}
            />
        )
    }
    if (postError?.statusCode === 503 || postError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={postError.statusCode}
                message={postError.statusText}
            />
        )
    }
    if (chatError?.statusCode === 503 || chatError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={chatError.statusCode}
                message={chatError.statusText}
            />
        )
    }
    if (userError?.statusCode === 503 || userError?.statusCode === 400) {
        return (
            <ErrorPage
                statusCode={userError.statusCode}
                message={userError.statusText}
            />
        )
    }

    return (
        <>
            <div
                onClick={(event) => handleCloseAllWindows(event)}
                className={`${
                    isfullScreenAndNoScroll ? "h-screen" : ""
                } flex flex-col`}
            >
                {Loading ? <Loader /> : <></>}
                <div className="h-[140px]">{Header}</div>
                <div className="flex-1 h-outlet bg-customWhite">
                    <Outlet />
                </div>
                <div className="tablet:">{footerHidden ? <></> : Footer}</div>
                <CustomToastify />
                {goUpHandlerShowed ? (
                    <BsFillArrowUpCircleFill
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "auto",
                            })
                        }}
                        onMouseEnter={() => {
                            clearTimeout(timeoutRef.current)
                        }}
                        onMouseLeave={() => {
                            clearTimeout(timeoutRef.current)
                            timeoutRef.current = setTimeout(() => {
                                setGoUpHandlerShowed(false)
                            }, 2000)
                        }}
                        className="fixed z-[9999] text-[42px] text-blue-500 opacity-80 hover:opacity-[1] right-5 bottom-20 cursor-pointer 
                                desktop:right-10
                            "
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default Layout
