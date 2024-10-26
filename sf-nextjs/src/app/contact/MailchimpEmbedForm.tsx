import React, { useState } from 'react';

const MailchimpEmbedForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);

    // Submit form to Mailchimp
    const form = document.createElement('form');
    form.action = 'https://gmail.us22.list-manage.com/subscribe/post?u=c51b8d1989d515cd66be11e95&id=02d6493d6c';
    form.method = 'POST';
    form.target = '_blank';

    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'EMAIL';
    emailInput.value = email;
    form.appendChild(emailInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setEmail('');
  };

  return (
    <div id="mc_embed_signup" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
      <h2>Subscribe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px', margin: '5px 0', borderRadius: '4px', width: '100%' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default MailchimpEmbedForm;
