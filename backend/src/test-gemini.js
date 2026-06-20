import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3",
        messages: [
          {
            role: "user",
            content: "Say Hello"
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data.choices[0].message.content);
  } catch (err) {
    console.error(
      err.response?.data || err.message
    );
  }
}

test();