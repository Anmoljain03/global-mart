import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    status: { type: Boolean, default: true },
    phone: { type: String },
    profileImage: { type: String } // Will store the image file path or URL
}, {
    minimize: false,
    timestamps: true
});


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
