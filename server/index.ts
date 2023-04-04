import mongoose from "mongoose";
const config = useRuntimeConfig();
export default async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    if (config.envType === "DEV")
      console.log("MongoDB Atlas connection established.");
  } catch (err) {
    console.error("DB connection failed.", err);
  }
};
