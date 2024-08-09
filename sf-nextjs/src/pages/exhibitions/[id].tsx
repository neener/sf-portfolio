import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import Link from 'next/link';
import { PortableTextBlock } from '@sanity/types';

interface Exhibition {
  _id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;  
  city: string;
  venue_name: string;
  venue_type: string;
  url: string;
  address: string;
  show_type: string;
  curator: string;
  images: any[];
  press: PortableTextBlock[];
  videos: string[];
  notes: PortableTextBlock[];
  relatedArtwork: {
    _id: string;
    name: string;
  };
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
          const data = await client.fetch(`
            *[_id == "${id}"][0] {
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
              images[] {
                asset->{
                  _id,
                  url
                },
                caption,
                alt
              },
              press,
              videos,
              notes,
              relatedArtwork-> {
                _id,
                name
              }
            }
          `);
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
      <p>Start Date: {new Date(exhibition.startDate).toLocaleDateString()}</p> 
      <p>End Date: {new Date(exhibition.endDate).toLocaleDateString()}</p> 
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
        {exhibition.images && (
          <div>
            <strong>Images:</strong>
            {exhibition.images.map(image => (
              <div key={image._key}>
                <img
                  src={urlFor(image.asset).url()}
                  alt={image.alt}
                  style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
                />
                <p>{image.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>Press</h2>
        {exhibition.press?.map((block, index) => {
          if (block._type === 'block') {
            return (
              <p key={index}>
                {block.children?.map((child: any, childIndex: number) => {
                  const linkMark = child.marks?.find((mark: string) => {
                    return block.markDefs?.some((def) => def._key === mark && def._type === 'link');
                  });

                  if (linkMark) {
                    const link = block.markDefs?.find((def) => def._key === linkMark);
                    return (
                      <a
                        key={childIndex}
                        href={link?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {child.text}
                      </a>
                    );
                  }
                  return <span key={childIndex}>{child.text}</span>;
                })}
              </p>
            );
          } else if (block._type === 'image') {
            return (
              block.asset && (
                <img
                  key={index}
                  src={urlFor(block).url()}
                  alt="Press image"
                  style={{ maxWidth: '500px', width: '100%' }}
                />
              )
            );
          }
          return null;
        })}
      </div>

      <div>
        <h2>Videos</h2>
        {exhibition.videos?.map((video, index) => (
          <a key={index} href={video} target="_blank" rel="noopener noreferrer">{video}</a>
        ))}
      </div>

      <div>
        <h2>Notes</h2>
        {exhibition.notes?.map((block, index) => {
          if (block._type === 'block') {
            return (
              <p key={index}>
                {block.children?.map((child: any, childIndex: number) => {
                  // Find the mark definitions for links
                  const linkMark = child.marks?.find((mark: string) => {
                    return block.markDefs?.some((def) => def._key === mark && def._type === 'link');
                  });

                  if (linkMark) {
                    const link = block.markDefs?.find((def) => def._key === linkMark);
                    return (
                      <a
                        key={childIndex}
                        href={link?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {child.text}
                      </a>
                    );
                  }
                  return <span key={childIndex}>{child.text}</span>;
                })}
              </p>
            );
          } else if (block._type === 'image') {
            return (
              <img
                key={index}
                src={urlFor(block).url()}
                alt="Notes image"
                style={{ maxWidth: '500px', width: '100%' }}
              />
            );
          }
          return null;
        })}
      </div>
      {exhibition.relatedArtwork && (
        <div>
          <h2>Related Artwork</h2>
          <p>
            <Link href={`/artworks/${exhibition.relatedArtwork._id}`}>
              {exhibition.relatedArtwork.name}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ExhibitionPage;
