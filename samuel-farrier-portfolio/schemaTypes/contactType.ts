import {defineField, defineType} from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      type: 'string',
    }),
    defineField({
      name: 'about',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})