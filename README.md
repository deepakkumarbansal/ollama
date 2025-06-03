🧠 Ollama Chat Script
This Node.js script sends a message to a local Ollama LLM (e.g., mistral) and streams back the assistant's response in real-time using fetch and readable streams.

📦 Prerequisites
Node.js version 18+ (native fetch support required)

Ollama installed and running locally on http://127.0.0.1:11434

Mistral model pulled via:

```bash
ollama pull mistral
```
📁 Files
ollama-chat.js: The main script to send chat messages and stream the AI response.

🚀 Usage
1. Clone or create the script
Save the following file as ollama-chat.js:

```bash
touch ollama-chat.js
```
Paste the content from the script section below.

2. Start Ollama (if not running)
In a separate terminal window:

```bash
ollama serve
```
Ensure it’s listening at http://127.0.0.1:11434.

3. Run the Script
bash
Copy
Edit
node ollama-chat.js
You’ll see the streamed response from the AI printed directly to the terminal.

💬 Customization
To ask a different question, edit this section in the script:

```js
{
  role: "user",
  content: "Your new question here"
}
```
To change models (e.g., llama3, gemma, codellama), update:

```js
model: "mistral" // → "llama3" or any model you’ve pulled via `ollama pull`
```
🧪 Script
```js
const payload = {
    model: "mistral",
    messages: [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
            role: "user",
            content: "What is the relationship between Narendra Modi and Meloni who is from Italy?"
        }
    ]
};

async function runChat() {
    try {
        const response = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            console.error("Error:", response.statusText);
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(Boolean);

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.message?.content) {
                        result += json.message.content;
                        process.stdout.write(json.message.content);
                    }
                } catch (e) {
                    console.error("Failed to parse line:", line);
                }
            }
        }

        console.log("\n\nFull response:", result);
    } catch (err) {
        console.error("Request failed:", err.message);
    }
}

runChat();
```
❓ Troubleshooting
Error: max retries exceeded: EOF: Indicates a connection issue or incomplete model download. Try ollama pull mistral again.

Response stuck or blank: Make sure ollama serve is running and the model has been pulled.

Parsing errors: Some streamed responses might contain empty lines — handled in the script already.

📄 License
MIT License – Free to use and modify.