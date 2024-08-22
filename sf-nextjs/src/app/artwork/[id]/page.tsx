"use client";

import { useEffect, useState } from 'react';
import client from '../../../lib/sanity';
import ArtworkDetail from '../components/ArtworkDetail';

export default function ArtworkDetailPage({ params }) {
  const { id } = params; // Destructure the id from params
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return; // Ensure we have the ID before making the request

      console.log('Fetching artwork for ID:', id);  // Log the id to ensure it's correct
      try {
        const data = await client.fetch(
          `*[_type == "artwork" && _id == $id][0]{
            _id,
            name,
            year,
            date,
            dimensions,
            medium,
            description,
            images,
            videos,
            press,
            visibility,
            exhibited,
            exhibitionLink,
            available,
            buyer,
            date_purchased,
            purchase_price,
            price,
            notes,
            category,
            relatedExhibitions[]-> {
              _id,
              name
            },
          }`,
          { id }
        );

        console.log('Fetched Artwork Data:', data);  // Log the fetched data for debugging

        if (!data) {
          console.warn('No artwork found with ID:', id);  // Warn if no data is returned
        }

        setArtwork(data);
      } catch (err) {
        console.error("Failed to fetch artwork details:", err);
        setError("Failed to fetch artwork");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();  // Call the function when `id` is available
  }, [id]); // Watch for changes in `id`

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!artwork) return <div>Artwork not found</div>;

  return <ArtworkDetail artwork={artwork} />;
}
