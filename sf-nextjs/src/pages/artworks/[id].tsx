import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import client from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import Link from 'next/link';
import { PortableTextBlock } from '@sanity/types';

interface Artwork {
  _id: string;
  name: string;
  year: number;
  date: string;
  dimensions: string;
  medium: string;
  description: PortableTextBlock[];
  images: any[];
  videos: string[];
  press: PortableTextBlock[];
  visibility: string;
  exhibited: boolean;
  exhibitionLink: string;
  available: string;
  buyer: string;
  date_purchased: number;
  purchase_price: number;
  price: number;
  notes: PortableTextBlock[];
  relatedExhibition: {
    _id: string;
    name: string;
  };
  category: string;
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
          const data = await client.fetch(`
            *[_id == "${id}"][0]{
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
              "relatedExhibition": relatedExhibition->{
                _id,
                name,
                date,
                location
              }
            }
          `);
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
        {artwork.description?.map((block, index) => {
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
                alt="Description image"
                style={{ maxWidth: '500px', width: '100%' }}
              />
            );
          }
          return null;
        })}
      </div>
      <div>
        {artwork.images && (
          <div>
            <strong>Images:</strong>
            {artwork.images.map(image => (
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
        <h2>Videos</h2>
        {artwork.videos?.map((video, index) => (
          <iframe key={index} src={video} frameBorder="0" allowFullScreen></iframe>
        ))}
      </div>
      <div>
        <h2>Press</h2>
        {artwork.press?.map((block, index) => {
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
                alt="Press image"
                style={{ maxWidth: '500px', width: '100%' }}
              />
            );
          }
          return null;
        })}
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
        {artwork.notes?.map((block, index) => {
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
      {artwork.relatedExhibition && (
        <div>
          <h2>Related Exhibition</h2>
          <p>
            <Link href={`/exhibitions/${artwork.relatedExhibition._id}`}>
              {artwork.relatedExhibition.name}
            </Link>
          </p>
        </div>
      )}
      <p>Category: {artwork.category}</p>
    </div>
  );
};

export default ArtworkPage;
