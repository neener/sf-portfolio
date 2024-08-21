"use client";

import { useEffect, useState } from 'react';
import client from '../../../lib/sanity';
import ArtworkDetail from '../components/ArtworkDetail';

export default function ArtworkDetailPage({ params }) {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      console.log('Fetching artwork for ID:', params.id);  // Log the params.id
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
            images {
              _key,
              asset->{
                _id,
                url
              },
              alt,
              caption
            },
            videos,
            press[] {
              _key,
              style,
              children[] {
                _key,
                text
              }
            },
            visibility,
            exhibited,
            exhibitionLink,
            available,
            buyer,
            date_purchased,
            purchase_price,
            price,
            notes[] {
              _key,
              style,
              children[] {
                _key,
                text
              }
            },
            category,
            "relatedExhibitions": relatedExhibitions[]->{
              _id,
              name
            }
          }`,
          { id: params.id }
        );

        console.log('Fetched Artwork Data:', data);  // Debugging: log the fetched data

        if (!data) {
          console.warn('No artwork found with ID:', params.id);  // Warn if no data
        }

        setArtwork(data);
      } catch (err) {
        console.error("Failed to fetch artwork details:", err);
        setError("Failed to fetch artwork");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();  // Call the function
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!artwork) return <div>Artwork not found</div>;

  return <ArtworkDetail artwork={artwork} />;
}
