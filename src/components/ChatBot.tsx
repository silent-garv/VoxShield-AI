import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { sendChatMessage } from '../services/geminiService';
import '../styles/ChatBot.css';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
	isAnimating?: boolean;
}

// Typewriter effect component - memoized to prevent re-mounting
const TypewriterText = React.memo<{ text: string; speed?: number; onComplete?: () => void }>(
	({ text, speed = 30, onComplete }) => {
		const [displayText, setDisplayText] = useState('');
		const isCompleteRef = useRef(false);

		useEffect(() => {
			// Reset animation state when text changes
			setDisplayText('');
			isCompleteRef.current = false;
			let index = 0;
			let isMounted = true;

			const timer = setInterval(() => {
				if (!isMounted || index >= text.length) {
					clearInterval(timer);
					if (isMounted && index >= text.length && !isCompleteRef.current) {
						isCompleteRef.current = true;
						onComplete?.();
					}
					return;
				}

				if (isMounted) {
					setDisplayText(text.slice(0, index + 1));
					index++;
				}
			}, speed);

			return () => {
				isMounted = false;
				clearInterval(timer);
			};
		}, [text, speed]); // Only depend on text and speed, not onComplete

		return <span>{displayText}</span>;
	}
);

const ChatBot: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content: 'Hi! I\'m your AI security assistant. Ask me anything about scam prevention, cybersecurity, or how to stay safe online.',
			timestamp: new Date(),
			isAnimating: true,
		},
	]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [animatingMessageId, setAnimatingMessageId] = useState<string>('1');

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleTypewriteComplete = useCallback(() => {
		setAnimatingMessageId('');
	}, []);

	const handleSendMessage = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
			timestamp: new Date(),
			isAnimating: false,
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const response = await sendChatMessage(input);
			const messageId = (Date.now() + 1).toString();
			const assistantMessage: Message = {
				id: messageId,
				role: 'assistant',
				content: response || 'Sorry, I couldn\'t process that. Please try again.',
				timestamp: new Date(),
				isAnimating: true,
			};
			setMessages((prev) => [...prev, assistantMessage]);
			setAnimatingMessageId(messageId);
		} catch (error) {
			console.error('Error sending message:', error);
			const messageId = (Date.now() + 2).toString();
			const errorMessage: Message = {
				id: messageId,
				role: 'assistant',
				content: 'Sorry, there was an error. Please try again later.',
				timestamp: new Date(),
				isAnimating: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
			setAnimatingMessageId(messageId);
		} finally {
			setLoading(false);
		}
	}, [input]);

	return (
		<div className="chatbot-container">
			<div className="chatbot-header">
				<div className="header-content">
					<h2>🛡️ Security Assistant</h2>
					<p>Your AI-powered guide to staying safe online</p>
				</div>
			</div>

			<div className="chatbot-messages">
				{messages.map((message) => (
					<div key={message.id} className={`message-wrapper ${message.role}`}>
						<div className={`message ${message.role}`}>
							<div className="message-avatar">
								{message.role === 'user' ? '👤' : '🤖'}
							</div>
							<div className="message-content-wrapper">
								<div className="message-bubble">
									{message.isAnimating && animatingMessageId === message.id ? (
										<TypewriterText
											text={message.content}
											speed={20}
											onComplete={handleTypewriteComplete}
										/>
									) : (
										<p className="message-text">{message.content}</p>
									)}
								</div>
								<span className="message-time">
									{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
						</div>
					</div>
				))}
				{loading && (
					<div className="message-wrapper assistant">
						<div className="message assistant">
							<div className="message-avatar">🤖</div>
							<div className="message-content-wrapper">
								<div className="message-bubble typing-bubble">
									<div className="typing-indicator">
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSendMessage} className="chatbot-input-form">
				<div className="input-wrapper">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask me about security, phishing, scams..."
						disabled={loading}
						className="chatbot-input"
						autoFocus
					/>
					<button 
						type="submit" 
						disabled={loading || !input.trim()} 
						className="chatbot-send-btn"
						title="Send message"
						aria-label="Send message"
					>
						{loading ? (
							<span className="sending">Thinking...</span>
						) : (
							<span className="send-icon">✉️</span>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatBot;
