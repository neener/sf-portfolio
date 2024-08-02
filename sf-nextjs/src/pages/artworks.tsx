import { useEffect, useState } from 'react';
import client from '../lib/sanity';

interface Artwork {
  _id: string;
  name: string;
}

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await client.fetch(`*[_type == "artwork"]{_id, name}`);
        setArtworks(data);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
        setError("Failed to fetch artworks");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Artworks</h1>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork._id}>
            <a href={`/artworks/${artwork._id}`}>{artwork.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtworksPage;
