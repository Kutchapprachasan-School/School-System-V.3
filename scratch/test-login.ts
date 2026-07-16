import "dotenv/config";
import { auth } from "../src/server/auth/better-auth";

async function test() {
  console.log("Testing auth logic with signInUsername...");
  try {
    const result = await auth.api.signInUsername({
      body: {
        username: "admin",
        password: "linkinparkkk"
      }
    });
    console.log("Authentication successful! Session data:", result);
  } catch (err: any) {
    console.error("Authentication failed with error:", err);
  }
}

test();
