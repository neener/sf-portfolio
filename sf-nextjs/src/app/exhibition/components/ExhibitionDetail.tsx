import React from 'react';
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
  notes: PortableTextBlock[];
  relatedArtworks?: Array<{ _id: string; name: string }>;
}

interface ExhibitionDetailProps {
  exhibition: Exhibition;
}

const ExhibitionDetail: React.FC<ExhibitionDetailProps> = ({ exhibition }) => {
  if (!exhibition) {
    return <div>Exhibition not found</div>;
  }

  return (
    <div>
      <h1>{exhibition.name}</h1>
      <p>{exhibition.venue_name}, {exhibition.city}</p>
      <p>{new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</p>
      <p>Curator: {exhibition.curator}</p>
      <p>Show Type: {exhibition.show_type}</p>
      {exhibition.url && <p>Website: <a href={exhibition.url} target="_blank" rel="noopener noreferrer">{exhibition.url}</a></p>}


      {/* Images */}
      {exhibition.images?.length > 0 && (
        <div>
          <strong>Images:</strong>
         
          {exhibition.images.map((image, imageIndex) => (
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

      {/* Display Press */}
      {exhibition.press?.length > 0 && (
        <div>
          <h2>Press</h2>
          {exhibition.press.map((block, index) => (
            <p key={index}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={child._key || childIndex}>{child.text}</span>
              ))}
            </p>
          ))}
        </div>
      )}

      {/* Display Notes */}
      {exhibition.notes?.length > 0 && (
        <div>
          <h2>Notes</h2>
          {exhibition.notes.map((block, index) => (
            <p key={index}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={child._key || childIndex}>{child.text}</span>
              ))}
            </p>
          ))}
        </div>
      )}

      {/* Related Artworks */}
      {exhibition.relatedArtworks && exhibition.relatedArtworks.length > 0 && (
        <div>
          <h2>Related Artworks</h2>
          {exhibition.relatedArtworks.map((artwork) => (
            <p key={artwork._id}>
              <a href={`/artwork/${artwork._id}`} target="_blank" rel="noopener noreferrer">{artwork.name}</a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetail;
