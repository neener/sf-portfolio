/* eslint-disable */
// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import client from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../lib/sanityImage";

const Home = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [commercials, setCommercials] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Fetch artworks
  const fetchArtworks = async () => {
    const artworkResponse = await client.fetch(`
      *[_type == "artwork"]{ 
        _id, 
        name,
        year,
        dimensions,
        medium,
        description,
        images,
        videos,
        category,
        relatedExhibitions[]-> {
          _id,
          name
        },
      }
    `);
    setArtworks(artworkResponse);
  };

  // Fetch exhibitions
  const fetchExhibitions = async () => {
    const exhibitionResponse = await client.fetch(`
      *[_type == "exhibition"]{ 
        _id, 
        name,
        year,
        venue_name,
        description,
        images[] {
          asset->{
            _id,
            url
          },
          caption,
          alt
        },
        videos,
        relatedArtworks[]-> {
          _id,
          name
        }
      }
    `);
    setExhibitions(exhibitionResponse);
  };

  // Fetch commercials
  const fetchCommercials = async () => {
    const commercialResponse = await client.fetch(`
      *[_type == "commercial"]{ 
        _id, 
        name,
        date,
        description,
        images
      }
    `);
    setCommercials(commercialResponse);
  };

  // Fetch contact
  const fetchContact = async () => {
    const contact = await client.fetch(`
      *[_type == "contact"][0]{ title, email, address, about }
    `);
    setContactData(contact);
  };

  const handleSectionClick = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
      setSelectedItem(null);
    } else {
      setExpandedSection(section);
      setSelectedItem(null);
      if (section === "artwork") fetchArtworks();
      if (section === "exhibition") fetchExhibitions();
      if (section === "commercial") fetchCommercials();
      if (section === "contact") fetchContact();
    }
  };

  return (
    <div className="flex p-4">
      {/* Navigation Section */}
      <div className="w-1/3 pr-4">
        <ul className="space-y-4 nav-list">
          {/* Artworks Section */}
          <li className="nav-item">
            <p
              onClick={() => handleSectionClick("artwork")}
              className="text-lg font-bold"
            >
              Works
            </p>
            {expandedSection === "artwork" && (
              <ul className="mt-2 space-y-2 nav-sublist">
                {artworks.map((artwork) => (
                  <li
                    key={artwork._id}
                    onClick={() => setSelectedItem(artwork)}
                    className="nav-subitem text-left"
                  >
                    {artwork.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Exhibitions Section */}
          <li className="nav-item">
            <p
              onClick={() => handleSectionClick("exhibition")}
              className="text-lg font-bold"
            >
              Exhibitions
            </p>
            {expandedSection === "exhibition" && (
              <ul className="mt-2 space-y-2 nav-sublist">
                {exhibitions.map((exhibition) => (
                  <li
                    key={exhibition._id}
                    onClick={() => setSelectedItem(exhibition)}
                    className="nav-subitem text-left"
                  >
                    {exhibition.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Commercials Section */}
          <li className="nav-item">
            <p
              onClick={() => handleSectionClick("commercial")}
              className="text-lg font-bold"
            >
              Commercial
            </p>
            {expandedSection === "commercial" && (
              <ul className="mt-2 space-y-2 nav-sublist">
                {commercials.map((commercial) => (
                  <li
                    key={commercial._id}
                    onClick={() => setSelectedItem(commercial)}
                    className="nav-subitem text-left"
                  >
                    {commercial.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Contact Section */}
          <li className="nav-item">
            <p
              onClick={() => handleSectionClick("contact")}
              className="text-lg font-bold"
            >
              About
            </p>
          </li>
        </ul>
      </div>

      {/* Details Section */}
      <div className="w-2/3 pl-4">
        {expandedSection === "contact" && contactData ? (
          <div>
            <h1 className="text-2xl font-bold">{contactData.title}</h1>
            <p>Email: {contactData.email}</p>
            <p>Address: {contactData.address}</p>
            <PortableText
              value={contactData.about}
              components={{
                types: {
                  image: ({ value }) => (
                    <img
                      src={urlFor(value).url()}
                      alt={value.alt || "About"}
                      className="image-max-width"
                    />
                  ),
                },
                block: {
                  normal: ({ children }) => <p className="my-2">{children}</p>,
                },
              }}
            />
          </div>
        ) : selectedItem ? (
          <div>
            <h1 className="text-2xl font-bold">{selectedItem.name}</h1>
            {selectedItem.year && <p>Year: {selectedItem.year}</p>}
            {selectedItem.date && <p>Date: {selectedItem.date}</p>}
            {selectedItem.medium && <p>Medium: {selectedItem.medium}</p>}

            {selectedItem.description && (
              <PortableText
                value={selectedItem.description}
                components={{
                  types: {
                    image: ({ value }) => (
                      <img
                        src={urlFor(value).url()}
                        alt={value.alt || "Description Image"}
                        className="image-max-width"
                      />
                    ),
                  },
                  block: {
                    normal: ({ children }) => <p className="my-2">{children}</p>,
                  },
                }}
              />
            )}

            {selectedItem.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedItem.images.map((image) => (
                  <img
                    key={image.asset._id}
                    src={urlFor(image).url()}
                    alt={image.alt || selectedItem.name}
                    className="image-max-width"
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
