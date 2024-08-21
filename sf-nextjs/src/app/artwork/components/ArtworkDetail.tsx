import React from 'react';
import { urlFor } from '../../../lib/sanityImage';
import { PortableTextBlock } from '@sanity/types';
import Link from 'next/link';

interface Artwork {
  _id: string;
  name: string;
  year: number;
  date: string;
  dimensions: string;
  medium: string;
  description: PortableTextBlock[];
  images: any[];
  videos: string[] | null;
  press: PortableTextBlock[];
  visibility: string;
  exhibited: boolean;
  exhibitionLink: string;
  available: string;
  buyer: string | null;
  date_purchased: number | null;
  purchase_price: number | null;
  price: number | null;
  notes: PortableTextBlock[];
  relatedExhibitions?: Array<{ _id: string; name: string }>;
  category: string;
}

interface ArtworkDetailProps {
  artwork: Artwork;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork }) => {
  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div>
      <h1>{artwork.name}</h1>
      <p>Year: {artwork.year}</p>
      {artwork.date && <p>Date: {new Date(artwork.date).toLocaleDateString()}</p>}
      <p>Dimensions: {artwork.dimensions}</p>
      <p>Medium: {artwork.medium}</p>

      {/* Description */}
      {artwork.description?.length > 0 && (
        <div>
          <h2>Description</h2>
          {artwork.description.map((block, index) => (
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
          ))}
        </div>
      )}

      {/* Images */}
      {artwork.images?.length > 0 && (
        <div>
          <strong>Images:</strong>
         
          {artwork.images.map((image, imageIndex) => (
            <div key={image._key || `image-${imageIndex}`}>
               {console.log(image)}
               {image.asset && image.asset.url ? (
                  <img
                    src={image.asset.url}  // Directly use the URL from the asset object
                    alt={image.alt || 'Artwork image'}
                    style={{ maxWidth: '500px', width: '100%' }}
                  />
                ) : (
                  <p>No image available</p>  // Optional fallback if no image is available
                )}
              {image.caption && <p>{image.caption}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Videos */}
      {artwork.videos && Array.isArray(artwork.videos) && artwork.videos.length > 0 && (
        <div>
          <h2>Videos</h2>
          {artwork.videos.map((video, index) => (
            <iframe key={`video-${index}`} src={video} frameBorder="0" allowFullScreen></iframe>
          ))}
        </div>
      )}

{/* Press */}
{artwork.press?.length > 0 && (
  <div>
    <h2>Press</h2>
    {artwork.press.map((block, index) => {
      // Handle different block types (e.g., block of text or image)
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
        // Handle image block
        return (
          <img
            key={index}
            src={urlFor(block).url()}
            alt="Press image"
            style={{ maxWidth: '500px', width: '100%' }}
          />
        );
      } else {
        return null; // Fallback for unhandled block types
      }
    })}
  </div>
)}

      {/* Visibility */}
      {artwork.visibility && <p>Visibility: {artwork.visibility}</p>}

      {/* Exhibited */}
      {artwork.exhibited && (
        <div>
          <p>Exhibited: Yes</p>
          {artwork.exhibitionLink && (
            <p>
              Exhibition Link: <a href={artwork.exhibitionLink} target="_blank" rel="noopener noreferrer">{artwork.exhibitionLink}</a>
            </p>
          )}
        </div>
      )}

      {/* Available */}
      {artwork.available && <p>Available: {artwork.available}</p>}

      {/* Buyer Information */}
      {artwork.available === 'no' && (
        <div>
          {artwork.buyer && <p>Buyer: {artwork.buyer}</p>}
          {artwork.date_purchased && (
            <p>Date Purchased: {new Date(artwork.date_purchased).toLocaleDateString()}</p>
          )}
          {artwork.purchase_price && <p>Purchase Price: {artwork.purchase_price}</p>}
        </div>
      )}

      {/* Price */}
      {artwork.price !== null && <p>Price: {artwork.price}</p>}

      {/* Notes */}
      {artwork.notes?.length > 0 && (
        <div>
          <h2>Notes</h2>
          {artwork.notes.map((block, index) => (
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
          ))}
        </div>
      )}

      {/* Related Exhibitions */}
      {artwork?.relatedExhibitions && artwork?.relatedExhibitions.length > 0 && (
        <div>
          <h2>Related Exhibitions</h2>
          {artwork?.relatedExhibitions.map((exhibition, index) => (
            <p key={index}>
              <Link href={`/exhibition/${exhibition._id}`} className="text-blue-500 hover:underline">{exhibition.name}</Link>
            </p>
          ))}
        </div>
      )}

      <p>Category: {artwork.category}</p>
    </div>
  );
};

export default ArtworkDetail;