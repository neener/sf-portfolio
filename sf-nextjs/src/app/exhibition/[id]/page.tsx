/* eslint-disable */
// @ts-nocheck

"use client";

import { useEffect, useState } from 'react';
import client from '../../../lib/sanity';
import ExhibitionDetail from '../components/ExhibitionDetail';

interface ExhibitionDetailPageProps {
  params: {
    id: string;
  };
}

export default function ExhibitionDetailPage({ params }: ExhibitionDetailPageProps) {
  const [exhibition, setExhibition] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "exhibition" && _id == $id][0]{
            _id,
            name,
            year,
            startDate,
            endDate,
            city,
            venue_name,
            venue_type,
            url,
            address,
            show_type,
            curator,
            images[]{
              asset->{url},
              caption,
            },
            press[]{
              ...,
              children[]{
                ...
              }
            },
            videos,
            notes[]{
              ...,
              children[]{
                ...
              }
            },
            "relatedArtworks": relatedArtworks[]->{
              _id,
              name
            }
          }`,
          { id: params.id }
        );
        setExhibition(data);
      } catch (err) {
        console.error("Failed to fetch exhibition:", err);
        setError("Failed to fetch exhibition");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exhibition) {
    return <div>Exhibition not found</div>;
  }

  return <ExhibitionDetail exhibition={exhibition} />;
}
