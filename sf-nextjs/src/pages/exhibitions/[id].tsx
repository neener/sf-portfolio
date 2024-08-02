import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Exhibition {
  _id: string;
  name: string;
  year: number;
  date: string;
  city: string;
  venue_name: string;
  venue_type: string;
  url: string;
  address: string;
  show_type: string;
  curator: string;
  images: any[];
  press: any[];
  videos: string[];
  notes: any[];
}

const ExhibitionPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchExhibition = async () => {
        try {
          const data = await client.fetch(`*[_id == "${id}"][0]`);
          setExhibition(data);
        } catch (err) {
          console.error("Failed to fetch exhibition:", err);
          setError("Failed to fetch exhibition");
        } finally {
          setLoading(false);
        }
      };

      fetchExhibition();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exhibition) {
    return <div>Exhibition not found</div>;
  }

  return (
    <div>
      <h1>{exhibition.name}</h1>
      <p>Year: {exhibition.year}</p>
      <p>Date: {new Date(exhibition.date).toLocaleDateString()}</p>
      <p>City: {exhibition.city}</p>
      <p>Venue Name: {exhibition.venue_name}</p>
      <p>Venue Type: {exhibition.venue_type}</p>
      <p>
        URL: <a href={exhibition.url} target="_blank" rel="noopener noreferrer">{exhibition.url}</a>
      </p>
      <p>Address: {exhibition.address}</p>
      <p>Show Type: {exhibition.show_type}</p>
      <p>Curator: {exhibition.curator}</p>

      <div>
        <h2>Images</h2>
        {exhibition.images?.map((image, index) => (
          <img key={index} src={urlFor(image).url()} alt={`Exhibition Image ${index + 1}`} />
        ))}
      </div>

      <div>
        <h2>Press</h2>
        {exhibition.press?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>

      <div>
        <h2>Videos</h2>
        {exhibition.videos?.map((video, index) => (
          <a key={index} href={video} target="_blank" rel="noopener noreferrer">{video}</a>
        ))}
      </div>

      <div>
        <h2>Notes</h2>
        {exhibition.notes?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionPage;
