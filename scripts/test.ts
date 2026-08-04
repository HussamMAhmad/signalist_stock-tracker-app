import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("mongodb url : " , MONGODB_URI);

async function testDirectConnection() {
  if (!MONGODB_URI) {
    console.error("❌ there is no MONGODB_URI in process.env");
    process.exit(1);
  }

  console.log("⏳ loading connection MongoDB...");

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log("-----------------------------------------");
    console.log("✅ connect with data base was successfull");
    console.log(` name of database: ${conn.connection.name}`);
    console.log(`(Host): ${conn.connection.host}`);
    console.log("-----------------------------------------");

    await mongoose.disconnect();
    console.log("👋 the connection was closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Faild to connection with database");
    console.error(error);
    process.exit(1);
  }
}

testDirectConnection();