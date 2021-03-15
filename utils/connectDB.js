import mongoose from "mongoose";

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return;
  }

  // try {
  //   await mongoose.connect( process.env.MONGO_URI,
  //     {
  //       useCreateIndex: true,
  //       useFindAndModify: false,
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  // } catch (error) {
  //    if (error) throw error;
  //       console.log("Connected to mongodb.");
  // }
  mongoose.connect(
    process.env.MONGO_URI,
    {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("Connected to mongodb.");
    }
  );
  // };
};

export default connectDB;
