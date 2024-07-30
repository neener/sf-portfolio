import {defineField, defineType} from 'sanity'

export const artworkType = defineType({
  name: 'artwork',
  title: 'Artwork',
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
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'press',
      title: 'Press',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'visibility',
      title: 'Public/Private',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Private', value: 'private' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'exhibited',
      title: 'Exhibited',
      type: 'boolean',
    }),
    defineField({
      name: 'exhibitionLink',
      title: 'Exhibition Link',
      type: 'url',
      hidden: ({ parent }) => !parent?.exhibited,
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'yes' },
          { title: 'No', value: 'no' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'buyer',
      title: 'Buyer',
      type: 'string',
      hidden: ({ parent }) => parent?.available !== 'no',
    }),
    defineField({
      name: 'date_purchased',
      title: 'Date',
      type: 'number',
      hidden: ({ parent }) => parent?.available !== 'no',
    }),
    defineField({
      name: 'purchase_price',
      title: 'Price',
      type: 'number',
      hidden: ({ parent }) => parent?.available !== 'no',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'relatedEvent',
      title: 'Related Event',
      type: 'reference',
      to: [{ type: 'event' }],
    }),
  ],
})