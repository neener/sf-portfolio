import { useEffect, useState } from 'react';
import client from '../lib/sanity';

interface Commercial {
  _id: string;
  name: string;
}

const CommercialsPage = () => {
  const [commercials, setCommercials] = useState<Commercial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommercials = async () => {
      try {
        const data = await client.fetch(`*[_type == "commercial"]{_id, name}`);
        setCommercials(data);
      } catch (err) {
        console.error("Failed to fetch commercials:", err);
        setError("Failed to fetch commercials");
      } finally {
        setLoading(false);
      }
    };

    fetchCommercials();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Commercials</h1>
      <ul>
        {commercials.map((commercial) => (
          <li key={commercial._id}>
            <a href={`/commercial/${commercial._id}`}>{commercial.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommercialsPage;
