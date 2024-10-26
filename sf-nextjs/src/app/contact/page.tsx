"use client";

import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../lib/sanityImage'; // Assuming this is your image helper

const ContactPage = () => {
  const [contact, setContact] = useState<any | null>(null); // Store the contact data
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
      
    </div>
  );
};

export default ContactPage;
