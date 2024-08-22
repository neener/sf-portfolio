"use client";

import { useEffect, useState } from 'react';
import client from '../lib/sanity';
import ArtworkListItem from './artwork/components/ArtworkListItem';
import ExhibitionListItem from './exhibition/components/ExhibitionListItem'; // Make sure the import path is correct
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanityImage'; // Assuming this is your image helper

const Home = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null); // To track expanded item

  // Fetch artworks
  const fetchArtworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const artworkResponse = await client.fetch(`
        *[_type == "artwork"]{
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
        }
      `);
      setArtworks(artworkResponse);
    } catch (err) {
      console.error("Failed to fetch artworks from Sanity:", err);
      setError("Failed to fetch artwork data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch exhibitions
  const fetchExhibitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const exhibitionResponse = await client.fetch(`
        *[_type == "exhibition"]{
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
          relatedArtworks[]-> {
            _id,
            name
          }
        }
      `);
      setExhibitions(exhibitionResponse);
    } catch (err) {
      console.error("Failed to fetch exhibitions from Sanity:", err);
      setError("Failed to fetch exhibition data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch contact data
  const fetchContact = async () => {
    setLoading(true);
    setError(null);
    try {
      const contact = await client.fetch(
        `*[_type == "contact"][0]{
          title,
          email,
          address,
          about
        }`
      );
      setContactData(contact);
    } catch (err) {
      console.error("Failed to fetch contact data from Sanity:", err);
      setError("Failed to fetch contact data");
    } finally {
      setLoading(false);
    }
  };

  // Handle menu click and determine what to fetch
  const handleClick = (type: string) => {
    setSelected(type);
    setExpandedItemId(null); // Reset expanded item when switching categories

    if (type === "artwork") {
      fetchArtworks();
    } else if (type === "exhibition") {
      fetchExhibitions();
    } else if (type === "contact") {
      fetchContact();
    }
  };

  // Toggle expanding the details of an artwork or exhibition
  const toggleExpand = (id: string) => {
    setExpandedItemId(prevId => (prevId === id ? null : id)); // Collapse if the same ID is clicked
  };

  return (
    <div className="flex">
      <nav className="flex flex-col space-y-4 p-4 w-1/4">
        <button
          onClick={() => handleClick("artwork")}
          className={`text-lg font-bold ${selected === "artwork" ? "text-blue-500" : "text-gray-700"}`}
        >
          Works
        </button>
        <button
          onClick={() => handleClick("exhibition")}
          className={`text-lg font-bold ${selected === "exhibition" ? "text-blue-500" : "text-gray-700"}`}
        >
          Exhibitions
        </button>
        <button
          onClick={() => handleClick("contact")}
          className={`text-lg font-bold ${selected === "contact" ? "text-blue-500" : "text-gray-700"}`}
        >
          About
        </button>
        <button
          onClick={() => handleClick("commercial")}
          className={`text-lg font-bold ${selected === "commercial" ? "text-blue-500" : "text-gray-700"}`}
        >
          Commercial
        </button>
      </nav>

      <div className="flex-1 p-4">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        
        {/* Render Artworks */}
        {!loading && !error && selected === "artwork" && (
          <ul>
            {artworks.map((artwork) => (
              <li key={artwork._id} className="py-2">
                <ArtworkListItem
                  artwork={artwork}
                  expanded={expandedItemId === artwork._id}
                  onClick={() => toggleExpand(artwork._id)}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Render Exhibitions */}
        {!loading && !error && selected === "exhibition" && (
          <ul>
            {exhibitions.map((exhibition) => (
              <li key={exhibition._id} className="py-2">
                <ExhibitionListItem
                  exhibition={exhibition}
                  expanded={expandedItemId === exhibition._id}
                  onClick={() => toggleExpand(exhibition._id)}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Render Contact Information */}
        {!loading && !error && selected === "contact" && contactData && (
          <div>
            <h1 className="text-2xl font-bold">{contactData.title}</h1>
            <p className="text-lg">Email: <a href={`mailto:${contactData.email}`} className="text-blue-600 underline">{contactData.email}</a></p>
            <p className="text-lg">Address: {contactData.address}</p>

            <div className="mt-6">
              <h2 className="text-xl font-bold">About</h2>
              <PortableText
                value={contactData.about}
                components={{
                  types: {
                    image: ({ value }) => (
                      <img src={urlFor(value).url()} alt="About image" className="my-4 max-w-full h-auto" />
                    ),
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
