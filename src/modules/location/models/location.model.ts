import mongoose from "mongoose";

const { Schema } = mongoose;

export interface ILocation {
    city: string,
    state: string,
    pinCode: number
}

const LocationSchema = new Schema<ILocation>({
    city: {
        type: String,
        required: [true, "City is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },
    pinCode: {
        type: Number,
        required: [true, "Pincode is required"],
    }
})

export const Location = mongoose.model<ILocation>("Location", LocationSchema);
