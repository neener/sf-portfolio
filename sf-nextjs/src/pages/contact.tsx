import { useEffect, useState } from 'react';
import client from '../lib/sanity';
import { urlFor } from '../lib/sanityImage';

interface Contact {
  title: string;
  email: string;
  address: string;
  about: any[];
}

const ContactPage = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await client.fetch(`*[_type == "contact"][0]`);
        setContact(data);
      } catch (err) {
        console.error("Failed to fetch contact information:", err);
        setError("Failed to fetch contact information");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!contact) {
    return <div>Contact information not found</div>;
  }

  return (
    <div>
      <h1>{contact.title}</h1>
      <p>Email: {contact.email}</p>
      <p>Address: {contact.address}</p>
      <div>
        <h2>About</h2>
        {contact.about?.map((block, index) => {
          if (block._type === 'block') {
            return <p key={index}>{block.children[0]?.text}</p>;
          } else if (block._type === 'image') {
            return <img key={index} src={urlFor(block).url()} alt="About image" />;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ContactPage;
