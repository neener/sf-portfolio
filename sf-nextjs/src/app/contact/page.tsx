"use client";

import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../lib/sanityImage';

const MailchimpForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      // Redirecting to the Mailchimp action URL with the email
      const actionURL = `https://gmail.us22.list-manage.com/subscribe/post?u=c51b8d1989d515cd66be11e95&id=02d6493d6c&f_id=00bdd8e1f0`;
      const form = document.createElement('form');
      form.action = actionURL;
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

      setMessage('Success! You are now subscribed.');
      setEmail('');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div id="mc_embed_signup" style={{ background: '#fff', fontFamily: 'Helvetica, Arial, sans-serif', width: '600px', padding: '20px', borderRadius: '8px' }}>
      <h2>Subscribe</h2>
      <form onSubmit={handleSubscribe} className="validate">
        <div id="mc_embed_signup_scroll">
          <p className="indicates-required">
            <span className="asterisk">*</span> indicates required
          </p>
          <div className="mc-field-group">
            <label htmlFor="mce-EMAIL">
              Email Address <span className="asterisk">*</span>
            </label>
            <input
              type="email"
              name="EMAIL"
              className="required email"
              id="mce-EMAIL"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', margin: '5px 0', borderRadius: '4px', width: '100%' }}
            />
          </div>
          <div id="mce-responses" className="clear foot">
            <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
            <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
            {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
            <input type="text" name="b_c51b8d1989d515cd66be11e95_02d6493d6c" tabIndex={-1} defaultValue="" />
          </div>
          <div className="clear foot">
            <input type="submit" name="subscribe" className="button" value="Subscribe" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', cursor: 'pointer' }} />
          </div>
        </div>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
      <p style={{ margin: '10px auto' }}>
        <a href="http://eepurl.com/iWyW6E" title="Mailchimp - email marketing made easy and fun">
          <span style={{ display: 'inline-block', backgroundColor: 'transparent', borderRadius: '4px' }}>
            <img
              className="refferal_badge"
              src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
              alt="Intuit Mailchimp"
              style={{ width: '220px', height: '40px', display: 'flex', padding: '2px 0', justifyContent: 'center', alignItems: 'center' }}
            />
          </span>
        </a>
      </p>
    </div>
  );
};

const ContactPage = () => {
  const [contact, setContact] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      setError(null);
      try {
        const contactData = await client.fetch(
          `*[_type == "contact"][0]{
            title,
            email,
            address,
            about
          }`
        );
        setContact(contactData);
      } catch (err) {
        console.error('Failed to fetch contact information:', err);
        setError('Failed to load contact information.');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!contact) return <div>No contact information found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{contact.title}</h1>
      <p className="text-lg">Email: <a href={`mailto:${contact.email}`} className="text-blue-600 underline">{contact.email}</a></p>
      <p className="text-lg">Address: {contact.address}</p>

      <div className="mt-6">
        <h2 className="text-xl font-bold">About</h2>
        <PortableText
          value={contact.about}
          components={{
            types: {
              image: ({ value }) => (
                <img src={urlFor(value).url()} alt="About image" className="my-4 max-w-full h-auto" />
              ),
            },
          }}
        />
      </div>

      {/* Mailchimp Form */}
      <div className="mt-8">
        <MailchimpForm />
      </div>
    </div>
  );
};

export default ContactPage;
