import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Artwork {
  _id: string;
  name: string;
  year: number;
  date: string;
  dimensions: string;
  medium: string;
  description: any[];
  images: any[];
  videos: string[];
  press: any[];
  visibility: string;
  exhibited: boolean;
  exhibitionLink: string;
  available: string;
  buyer: string;
  date_purchased: number;
  purchase_price: number;
  price: number;
  notes: any[];
  relatedEvent: any;
}

const ArtworkPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchArtwork = async () => {
        try {
          const data = await client.fetch(`*[_id == "${id}"][0]`);
          setArtwork(data);
        } catch (err) {
          console.error("Failed to fetch artwork:", err);
          setError("Failed to fetch artwork");
        } finally {
          setLoading(false);
        }
      };

      fetchArtwork();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div>
      <h1>{artwork.name}</h1>
      <p>Year: {artwork.year}</p>
      <p>Date: {new Date(artwork.date).toLocaleDateString()}</p>
      <p>Dimensions: {artwork.dimensions}</p>
      <p>Medium: {artwork.medium}</p>
      <div>
        <h2>Description</h2>
        {artwork.description?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
      <div>
        <h2>Images</h2>
        {artwork.images?.map((image, index) => (
          <img key={index} src={urlFor(image).url()} alt={artwork.name} />
        ))}
      </div>
      <div>
        <h2>Videos</h2>
        {artwork.videos?.map((video, index) => (
          <iframe key={index} src={video} frameBorder="0" allowFullScreen></iframe>
        ))}
      </div>
      <div>
        <h2>Press</h2>
        {artwork.press?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
      <p>Visibility: {artwork.visibility}</p>
      {artwork.exhibited && (
        <div>
          <p>Exhibited: Yes</p>
          <p>
            Exhibition Link: <a href={artwork.exhibitionLink}>{artwork.exhibitionLink}</a>
          </p>
        </div>
      )}
      <p>Available: {artwork.available}</p>
      {artwork.available === 'no' && (
        <div>
          <p>Buyer: {artwork.buyer}</p>
          <p>Date Purchased: {artwork.date_purchased}</p>
          <p>Purchase Price: {artwork.purchase_price}</p>
        </div>
      )}
      <p>Price: {artwork.price}</p>
      <div>
        <h2>Notes</h2>
        {artwork.notes?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
      {artwork.relatedEvent && (
        <div>
          <h2>Related Event</h2>
          <p>{artwork.relatedEvent.name}</p>
        </div>
      )}
    </div>
  );
};

export default ArtworkPage;
