import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Event {
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

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const data = await client.fetch(`*[_id == "${id}"][0]`);
          setEvent(data);
        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Failed to fetch event");
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.name}</h1>
      <p>Year: {event.year}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>City: {event.city}</p>
      <p>Venue Name: {event.venue_name}</p>
      <p>Venue Type: {event.venue_type}</p>
      <p>URL: <a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a></p>
      <p>Address: {event.address}</p>
      <p>Show Type: {event.show_type}</p>
      <p>Curator: {event.curator}</p>

      <div>
        <h2>Images</h2>
        {event.images?.map((image, index) => (
          <img key={index} src={urlFor(image).url()} alt={`Event Image ${index + 1}`} />
        ))}
      </div>

      <div>
        <h2>Press</h2>
        {event.press?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>

      <div>
        <h2>Videos</h2>
        {event.videos?.map((video, index) => (
          <a key={index} href={video} target="_blank" rel="noopener noreferrer">{video}</a>
        ))}
      </div>

      <div>
        <h2>Notes</h2>
        {event.notes?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
