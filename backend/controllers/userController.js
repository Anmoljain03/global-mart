import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        if (user.status === false) {
            return res.status(403).json({ success: false, message: "Your account is disabled. Please contact admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.status(400).json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const userId = decoded.id;
        const user = await userModel.findById(userId);

        console.log("Fetched user:", user);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userProfile = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.json({ success: true, userProfile });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};


// Set base URL depending on environment
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_URL
    : process.env.LOCAL_URL;

const updateUserProfile = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const userId = decoded.id;
    const { name, phone } = req.body;
    const profileImage = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profileImage) {
      updateData.profileImage = `${baseUrl}/uploads/profile-pictures/${profileImage}`;
    }

    console.log("Update payload:", updateData);

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};






// Get list of users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'name email phone status');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};


// Change status of user
 const changeUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (typeof status !== 'boolean') {
        return res.status(400).json({ success: false, message: "Status must be true or false" });
    }

    try {
        const user = await userModel.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User status updated", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user status" });
    }
};




export { loginUser, registerUser, adminLogin, getUserProfile, getAllUsers, changeUserStatus, updateUserProfile}