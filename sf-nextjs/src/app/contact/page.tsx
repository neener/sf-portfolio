"use client";

import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../lib/sanityImage';
import Head from 'next/head';

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
      <Head>
        {/* Load jQuery */}
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLR4Xyc4V9cMR5YXw9y3Um4MOmXZJvZ5PF5i5bOgYb" crossOrigin="anonymous"></script>
        <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css" />
        <script src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js" async></script>
      </Head>

      <h1 className="text-2xl font-bold">{contact.title}</h1>
      <p className="text-lg">
        Email: <a href={`mailto:${contact.email}`} className="text-blue-600 underline">{contact.email}</a>
      </p>
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

      <div id="mc_embed_signup" className="mt-8">
        <h2 className="text-xl font-bold">Subscribe</h2>
        <form
          action="https://gmail.us22.list-manage.com/subscribe/post?u=c51b8d1989d515cd66be11e95&amp;id=02d6493d6c&amp;f_id=00bdd8e1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
        >
          <div className="mc-field-group">
            <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
            <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required />
          </div>
          <div id="mce-responses" className="clear foot">
            <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
            <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
          </div>
          <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
            <input type="text" name="b_c51b8d1989d515cd66be11e95_02d6493d6c" tabIndex={-1} defaultValue="" />
          </div>
          <div className="clear foot">
            <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="button" value="Subscribe" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
