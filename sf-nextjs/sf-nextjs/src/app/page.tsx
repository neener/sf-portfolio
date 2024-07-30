"use client";

import { useEffect, useState } from 'react';
import client from '../lib/sanity';

const Home = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await client.fetch(`*[_type == "artwork"]{_id, name}`);
        await client.fetch(`*[_type == "event"]{_id, name}`);
        await client.fetch(`*[_type == "commercial"]{_id, name}`);
        await client.fetch(`*[_type == "contact"]{_id, title}`);
      } catch (err) {
        console.error("Failed to fetch data from Sanity:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <section>
        <h2><a href="/artworks">Works</a></h2>
      </section>
      <section>
        <h2><a href="/events">Exhibitions</a></h2>
      </section>
      <section>
        <h2><a href="/contact">About</a></h2> 
      </section>
      <section>
        <h2><a href="/commercial">Commercial</a></h2> 
      </section>
    </div>
  );
};

export default Home;
