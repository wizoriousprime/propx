import mongoose from "mongoose";
import { log } from "./setup";

const uri = Bun.env.MONGODBURI || "";

mongoose
  .connect(uri, { dbName: "propertyguard", autoIndex: true })
  .then(() => {
    log.info("Successfully connected to database");
  })
  .catch((error) => {
    log.warn("database connection failed. exiting now...");
    log.warn(error);
    process.exit(1);
  });

export default mongoose;
