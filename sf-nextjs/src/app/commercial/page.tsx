/* eslint-disable */
// @ts-nocheck

"use client";

import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import CommercialDetail from '../components/CommercialDetail';

export default function CommercialDetailPage({ params }) {
  const { id } = params;

  const [commercial, setCommercial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommercial = async () => {
      if (!id) return;

      console.log('Fetching commercial for ID:', id);
      try {
        const data = await client.fetch(
          `*[_type == "commercial" && _id == $id][0]{
            _id,
            name,
            "slug": slug.current,
            date,
            images[]{
              asset->{
                _id,
                url
              },
              alt,
              caption
            },
            description,
            photographer,
            stylist,
            category
          }`,
          { id }
        );

        console.log('Fetched Commercial Data:', data);
        if (!data) {
          console.warn('No commercial found with ID:', id);
        }

        setCommercial(data);
      } catch (err) {
        console.error("Failed to fetch commercial details:", err);
        setError("Failed to fetch commercial");
      } finally {
        setLoading(false);
      }
    };

    fetchCommercial();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!commercial) return <div>Commercial not found</div>;

  return <CommercialDetail commercial={commercial} />;
}
