import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

export interface IUser {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    isEmailVerified?: boolean;

    role?: string;
    createdAt: Date;
    updatedAt: Date;

    location?: {
        type: 'Point',
        coordinates: [number, number]
    };
    city?: string;
    pincode?: number;
    state?: string;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phoneNumber: {
        type: String,
        // required: [true, "Phone number is required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [lng, lat]
        }
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String,
    },
}, { timestamps: true })

// required for $near queries
UserSchema.index({ location: "2dsphere" });

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

export const User = mongoose.model<IUser>("User", UserSchema)
