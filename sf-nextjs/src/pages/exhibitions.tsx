import { useEffect, useState } from 'react';
import client from '../lib/sanity';

interface Exhibition {
  _id: string;
  name: string;
}

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await client.fetch(`*[_type == "exhibition"]{_id, name}`);
        setExhibitions(data);
      } catch (err) {
        console.error("Failed to fetch exhibitions:", err);
        setError("Failed to fetch exhibitions");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Exhibitions</h1>
      <ul>
        {exhibitions.map((exhibition) => (
          <li key={exhibition._id}>
            <a href={`/exhibitions/${exhibition._id}`}>{exhibition.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExhibitionsPage;
