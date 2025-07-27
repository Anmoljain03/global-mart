import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://global-mart-backend.onrender.com/api/user/profile', {
                headers: { token },
            });

            if (response.data.success) {
                const { name, phone, profileImage } = response.data.userProfile;
                setUserProfile(response.data.userProfile);
                setName(name || '');
                setPhone(phone || '');
                setPreviewImage(profileImage || '');
            } else {
                setError('Failed to fetch user profile.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching the profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await axios.put('https://global-mart-backend.onrender.com/api/user/update-profile', formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setUserProfile(response.data.user);
                setEditMode(false);
                alert('Profile updated successfully');
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the profile.');
        }
    };

    if (loading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

    return (
        <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="w-full max-w-lg p-6 rounded-xl border border-gray-200 shadow-sm"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <motion.img
                        src={previewImage || 'https://www.w3schools.com/w3images/avatar2.png'}
                        alt="Profile"
                        className="w-36 h-36 rounded-full shadow-lg border-4 border-white object-cover"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                {editMode ? (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-sm"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-2xl text-center font-bold text-gray-800 mb-4">{userProfile?.name}</h1>

                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span className="font-semibold">Email:</span>
                                <span>{userProfile?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Phone:</span>
                                <span>{userProfile?.phone || 'Not Provided'}</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Profile;


















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Profile = () => {
//     const [userProfile, setUserProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [profileImage, setProfileImage] = useState(null);
//     const [previewImage, setPreviewImage] = useState('');

//     const fetchProfile = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:4000/api/user/profile', {
//                 headers: { token },
//             });

//             if (response.data.success) {
//                 setUserProfile(response.data.userProfile);
//                 setName(response.data.userProfile.name || '');
//                 setPhone(response.data.userProfile.phone || '');
//                 setPreviewImage(response.data.userProfile.profileImage || '');
//             } else {
//                 setError('Failed to fetch user profile.');
//             }
//         } catch (err) {
//             console.error(err);
//             setError('An error occurred while fetching the profile.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfileImage(file);
//             setPreviewImage(URL.createObjectURL(file));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');

//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('phone', phone);
//         if (profileImage) {
//             formData.append('profileImage', profileImage);
//         }

//         try {
//             const response = await axios.put('http://localhost:4000/api/user/update-profile', formData, {
//                 headers: {
//                     token,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.success) {
//                 setUserProfile(response.data.user);
//                 setEditMode(false);
//                 alert('Profile updated successfully');
//             } else {
//                 alert('Update failed');
//             }
//         } catch (error) {
//             console.error(error);
//             alert('An error occurred while updating the profile.');
//         }
//     };

//     if (loading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
//     if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

//     return (
//         <div className="flex justify-center mt-10">
//             <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
//                 {/* Profile Picture */}
//                 <div className="flex justify-center mb-4">
//                     <img
//                         src={previewImage || "https://www.w3schools.com/w3images/avatar2.png"}
//                         alt="Profile"
//                         className="w-36 h-36 rounded-full border-4 border-teal-500 shadow-md object-cover"
//                     />
//                 </div>

//                 {editMode ? (
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {/* Profile Image Input */}
//                         <div>
//                             <label className="block font-medium text-gray-700 mb-1">Profile Picture</label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="text-sm"
//                             />
//                         </div>

//                         {/* Name */}
//                         <div>
//                             <label className="block font-medium text-gray-700 mb-1">Name</label>
//                             <input
//                                 type="text"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className="w-full border px-3 py-2 rounded-md"
//                             />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                             <label className="block font-medium text-gray-700 mb-1">Phone</label>
//                             <input
//                                 type="text"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 className="w-full border px-3 py-2 rounded-md"
//                             />
//                         </div>

//                         <div className="flex justify-between">
//                             <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
//                                 Save
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setEditMode(false)}
//                                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 ) : (
//                     <div>
//                         <h1 className="text-2xl text-center font-semibold text-gray-800">{userProfile?.name}</h1>

//                         <div className="mt-6 space-y-4 text-gray-700 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="font-medium text-teal-500">Email:</span>
//                                 <span>{userProfile?.email}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="font-medium text-teal-500">Phone:</span>
//                                 <span>{userProfile?.phone || 'Not Provided'}</span>
//                             </div>
//                         </div>

//                         <div className="mt-6 text-center">
//                             <button
//                                 onClick={() => setEditMode(true)}
//                                 className="px-6 py-2 bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600 transition-all"
//                             >
//                                 Edit Profile
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Profile;
