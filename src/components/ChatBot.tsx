import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import '../styles/ChatBot.css';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

const ChatBot: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content: 'Hi! I\'m your AI security assistant. Ask me anything about scam prevention, cybersecurity, or how to stay safe online.',
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const response = await sendChatMessage(input);
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: response || 'Sorry, I couldn\'t process that. Please try again.',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error('Error sending message:', error);
			const errorMessage: Message = {
				id: (Date.now() + 2).toString(),
				role: 'assistant',
				content: 'Sorry, there was an error. Please try again later.',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="chatbot-container">
			<div className="chatbot-header">
				<h2>Security & Scam Prevention Assistant</h2>
				<p>Ask anything about staying safe online</p>
			</div>

			<div className="chatbot-messages">
				{messages.map((message) => (
					<div key={message.id} className={`message ${message.role}`}>
						<div className="message-avatar">
							{message.role === 'user' ? '👤' : '🤖'}
						</div>
						<div className="message-content">
							<p>{message.content}</p>
							<span className="message-time">
								{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</span>
						</div>
					</div>
				))}
				{loading && (
					<div className="message assistant">
						<div className="message-avatar">🤖</div>
						<div className="message-content">
							<div className="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSendMessage} className="chatbot-input-form">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your question here..."
					disabled={loading}
					className="chatbot-input"
				/>
				<button type="submit" disabled={loading || !input.trim()} className="chatbot-send-btn">
					{loading ? '⏳' : '📤'}
				</button>
			</form>
		</div>
	);
};

export default ChatBot;
