import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

interface Commercial {
  _id: string;
  name: string;
  date: number;
  images: any[];
  description: any[];
  photographer: string;
  stylist: string;
  category: string;
}

const CommercialPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [commercial, setCommercial] = useState<Commercial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCommercial = async () => {
        try {
          const data = await client.fetch(`*[_id == "${id}"][0]`);
          setCommercial(data);
        } catch (err) {
          console.error("Failed to fetch commercial:", err);
          setError("Failed to fetch commercial");
        } finally {
          setLoading(false);
        }
      };

      fetchCommercial();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!commercial) {
    return <div>Commercial not found</div>;
  }

  return (
    <div>
      <h1>{commercial.name}</h1>
      <p>Date: {commercial.date}</p>
      <div>
        <h2>Description</h2>
        {commercial.description?.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
      <div>
        <h2>Images</h2>
        {commercial.images?.map((image, index) => (
          <img key={index} src={urlFor(image).url()} alt={commercial.name} />
        ))}
      </div>
      <p>Photographer: {commercial.photographer}</p>
      <p>Stylist: {commercial.stylist}</p>
      <p>Category: {commercial.category}</p>
    </div>
  );
};

export default CommercialPage;
