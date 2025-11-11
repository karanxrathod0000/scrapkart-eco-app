import React, { useState, FormEvent, useRef, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
}

const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! How can I help you today?", sender: 'support' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
        };
        
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');

        // Simulate support reply
        setTimeout(() => {
            const supportReply: Message = {
                id: Date.now() + 1,
                text: "Thanks for your message. An agent will be with you shortly. For immediate help, please visit our FAQ page.",
                sender: 'support',
            };
            setMessages(prev => [...prev, supportReply]);
        }, 1500);
    };

    return (
        <>
            <div className="chat-support-fab" onClick={() => setIsOpen(true)} role="button" aria-label="Open support chat">
                <span>💬</span>
            </div>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>ScrapKart Support</span>
                        <button className="chat-header-close" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble message-${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" className="chat-send-btn" aria-label="Send message">
                            &#10148;
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatSupport;
