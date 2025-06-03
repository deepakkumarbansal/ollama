const payload = {
    model: "mistral",
    messages: [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
            role: "user",
            content: "What is the relation between Narendra Modi and Giorgia Meloni?"
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
                        process.stdout.write(json.message.content); // live output
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
