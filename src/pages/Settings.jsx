import {
    React,
    useState,
    useRef,
    useEffect,
    useSelector,
    apiUrl,
    useDispatch
  } from "../CommonImports";
import { toggleDarkMode, setCurrentUser } from "../redux/slice";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/Navbar';
import SideBar from '../components/SideBar';
import Notification from '../components/Notification';
import "bootstrap/dist/css/bootstrap.css";
import "../styles/Homepage.css";
import useScrollToTop from '../helper/useScrollToTop';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { current } from "@reduxjs/toolkit";

const Settings = () => {
    const scroll = useScrollToTop();
    const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
    const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('profile');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        username: currentUser.username,
        name: currentUser.fullname,
        email: currentUser.email,
        bio: currentUser.status,
        profilePicture: currentUser.profilePic,
        notificationPreferences: {
            email: true,
            push: true
        },
        themePreference: 'light'
    });

    const updateProfile = async () => {
        try {
            const response = await fetch(apiUrl + "/user/update", {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  userId: currentUser.userId,
                  name: formData.name,
                  username: formData.username,
                  status: formData.bio,
                  profilePicURL: formData.profilePicture,
                }),
              });
              //const data = await response.json();
          
              if (response.status == 200) {
                toast("User Updated");
          
                dispatch(
                  setCurrentUser({
                    ...currentUser,
                    username: formData.username,
                    fullname: formData.name,
                    status: formData.bio
                  })
                );
          
              } else {
                console.log("Failed to Update");
              }
        } catch (err) {
            console.log("Error")
            console.log(err)
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            updateProfile();

            // API call to update user profile
            setNotification({
                show: true,
                message: 'Profile updated successfully!',
                type: 'success'
            });
        } catch (error) {
            setNotification({
                show: true,
                message: error.message || 'Failed to update profile',
                type: 'error'
            });
        }
    };

    const toggleDarkModeHandler = () => {
        dispatch(toggleDarkMode());
        document.body.classList.toggle("dark-mode", !isDarkMode);
    };

    const softDeleteUser = async () => {
        try {
            const response = await fetch(apiUrl + "/user/delete", {
              headers: {
                'Content-Type': 'application/json'
              },
              method: "DELETE",
              body: JSON.stringify({"userId": currentUser.userId})
            });
      
            const data = await response.json();
            console.log(data)
            if (response.status == 200) {
                toast('Account deleted!');
            }
          } catch (err) {
            console.log("Error");
            console.log(err)
          }
    };


    const handleDeleteAccount = async () => {
        try {
            // API call to soft delete user
            await softDeleteUser();
            setNotification({
                show: true,
                message: 'Account deleted successfully. Redirecting...',
                type: 'success'
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setNotification({
                show: true,
                message: error.message || 'Failed to delete account',
                type: 'error'
            });
        }
    };

    return (
        <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
            <Header />
            <div className="row g-0">
                {/* NavBar (Left Sidebar) */}
                <div className="d-none d-md-block p-4 pe-0 col-md-2">
                    <NavBar />
                </div>

                {/* Settings Content (Center Content) */}
                <div ref={scroll} className="col-12 col-md-7 p-4">
                    <h1 className="mb-4">Settings</h1>

                    {/*{notification.show && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification({ show: false })}
                        />
                    )}*/}

                    {/* Settings Navigation Tabs */}
                    <div className="nav nav-tabs mb-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                        >
                            Account
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                        >
                            Preferences
                        </button>
                    </div>

                    {/* Profile Settings Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Bio</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    )}

                    {/* Account Settings Tab */}
                    {activeTab === 'account' && (
                        <div>
                            <section className="mb-4">
                                <h2 className="h5">Delete Account</h2>
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="btn btn-danger"
                                    >
                                        Delete Account
                                    </button>
                                ) : (
                                    <div className="card border-danger">
                                        <div className="card-body">
                                            <h5 className="card-title">Are you absolutely sure?</h5>
                                            <p className="card-text">This action cannot be undone.</p>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    className="btn btn-danger"
                                                >
                                                    Yes, Delete My Account
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="btn btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div>
                            <section className="mb-4">
                                <h2 className="h5">Display</h2>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="darkMode"
                                        checked={isDarkMode}
                                        onChange={toggleDarkModeHandler}
                                    />
                                    <label className="form-check-label" htmlFor="darkMode">
                                        Dark Mode
                                    </label>
                                </div>
                            </section>

                            <section className="mb-4">
                                <h2 className="h5">Notifications</h2>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="emailNotifications"
                                        checked={formData.notificationPreferences.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notificationPreferences: {
                                                ...formData.notificationPreferences,
                                                email: e.target.checked
                                            }
                                        })}
                                    />
                                    <label className="form-check-label" htmlFor="emailNotifications">
                                        Email Notifications
                                    </label>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="d-none d-md-block col-md-3 trending-container">
                    <SideBar />
                </div>
            </div>
        </div>
    );
};

export default Settings;