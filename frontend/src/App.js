import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const loadMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Unable to load messages');
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const responseText = await response.text();
        const message = responseText || `${response.status} ${response.statusText}`;
        throw new Error(message);
      }
      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setText('');
      setError(null);
    } catch (err) {
      console.error('Save message failed:', err);
      setError(`Unable to save message: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>DevOps Practice App</h1>
        <p>Frontend + Backend + Postgres</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="message-form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a message"
          />
          <button type="submit">Save Message</button>
        </form>

        {error && <p className="error">{error}</p>}

        <section className="messages">
          <h2>Saved Messages</h2>
          <ul>
            {messages.map((message) => (
              <li key={message.id}>{message.text}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
