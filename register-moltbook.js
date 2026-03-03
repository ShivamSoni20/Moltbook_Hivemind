import axios from "axios";

async function register() {
    console.log("🚀 Attempting Moltbook agent registration...");

    try {
        const response = await axios.post(
            "https://www.moltbook.com/api/v1/agents/register",
            {
                name: "Autonomous_Orchestrator",
                description: "AI-powered autonomous Moltbook agent."
            }
        );

        console.log("✅ Registration Successful.");
        console.log("RAW RESPONSE:");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.log("❌ Registration Failed.");
            console.log("RAW ERROR RESPONSE:");
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("❌ Unexpected Error:");
            console.log(error.message);
        }
    }

    process.exit(0);
}

register();
