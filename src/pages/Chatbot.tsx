
import { useRef, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import Loading_Img from "../assets/loading.gif";

function Chatbot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setInput("");

        try {
            setLoading(true);
            setMessages((prev) => [...prev, { sender: "bot", text: "Thinking..." }]);

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a medical AI assistant. Provide accurate, concise, and professional answers to the following clinical or medical question: ${input}. If the question is not related to medicine or health, politely decline to answer.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            setMessages((prev) => [
                ...prev.slice(0, -1),
                { sender: "bot", text: text },
            ]);
        } catch (error) {
            console.log("Error: ", error);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { sender: "bot", text: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-6 w-6 text-clinical-600" />
                            <CardTitle>Medical AI Assistant</CardTitle>
                        </div>
                        <CardDescription>
                            Ask medical or clinical questions and receive professional assistance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Chat History */}
                        <div className="h-[500px] overflow-y-auto mb-4 p-4 rounded-lg bg-slate-50 border">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            message.sender === "user"
                                                ? "bg-clinical-600 text-white"
                                                : "bg-white border shadow-sm"
                                        }`}
                                    >
                                        {message.sender === "bot" && message.text === "Thinking..." ? (
                                            <div className="flex items-center gap-2">
                                                <img src={Loading_Img} alt="Thinking..." className="w-5 h-5" />
                                                <span>Thinking...</span>
                                            </div>
                                        ) : (
                                            <ReactMarkdown className="prose prose-sm max-w-none">
                                                {message.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your medical or clinical question..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={loading}
                                className="bg-clinical-600 hover:bg-clinical-700"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Disclaimer: This AI is not a substitute for professional medical advice.
                                Always consult a qualified healthcare provider for medical concerns.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

export default Chatbot;
