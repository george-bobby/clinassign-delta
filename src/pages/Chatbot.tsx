import { useRef, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown"; // For formatted output
import Loading_Img from "../assets/loading.gif";
import { Bot, Send } from "lucide-react";

function Chatbot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // Store chat messages
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null); // For auto-scrolling to the latest message

    // Use environment variable (Vite)
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return; // Ignore empty messages

        // Add user's message to the chat
        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setInput(""); // Clear input field

        try {
            setLoading(true);

            // Add a "Thinking..." message
            setMessages((prev) => [...prev, { sender: "bot", text: "Thinking..." }]);

            // Generate bot response
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a medical AI assistant. Provide accurate, concise, and professional answers to the following clinical or medical question: ${input}. If the question is not related to medicine or health, politely decline to answer.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Replace the "Thinking..." message with the actual response
            setMessages((prev) => [
                ...prev.slice(0, -1), // Remove the "Thinking..." message
                { sender: "bot", text: text },
            ]);
        } catch (error) {
            console.log("Error: ", error);
            setMessages((prev) => [
                ...prev.slice(0, -1), // Remove the "Thinking..." message
                { sender: "bot", text: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-3xl w-full md:w-2/3 lg:w-1/2 mx-4 my-8 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="flex text-3xl font-bold items-center justify-center mb-4 text-white bg-gray-800 rounded-md">
                    Medical AI Assistant
                    <div className="pl-1"><Bot /></div>
                </h1>

                {/* Chat History */}
                <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {message.sender === "bot" && message.text === "Thinking..." ? (
                                    <div className="flex items-center">
                                        <img src={Loading_Img} alt="Thinking..." className="w-6 h-6 mr-2" />
                                        <span>Thinking...</span>
                                    </div>
                                ) : (
                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} /> {/* For auto-scrolling */}
                </div>

                {/* Input Area */}
                <div className="flex pt-4">
                    <input
                        className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-800"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Enter your medical or clinical question..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        disabled={loading}
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                        onClick={handleSendMessage}
                        disabled={loading}
                    >
                        <Send size={20} />
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 border-gray-700 pt-8 flex flex-col items-center">
                    <p className="text-sm text-gray-600 text-center">
                        Disclaimer: This AI is not a substitute for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;