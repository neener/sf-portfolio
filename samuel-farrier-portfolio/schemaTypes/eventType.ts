import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'venue_name',
      title: 'Venue Name',
      type: 'string',
    }),
    defineField({
      name: 'venue_type',
      title: 'Venue Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gallery', value: 'gallery' },
          { title: 'Apartment', value: 'apartment' },
          { title: 'Institution', value: 'institution' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'show_type',
      title: 'Show Type',
      type: 'string',
      options: {
        list: [
          { title: 'Solo', value: 'solo' },
          { title: 'Group', value: 'group' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'curator',
      title: 'Curator',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'press',
      title: 'Press',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})