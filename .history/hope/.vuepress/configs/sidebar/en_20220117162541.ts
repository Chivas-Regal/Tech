import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/en/blogs/': [
    {
      text: 'Blogs',
      children: [
        '/en/blogs/README.md',
      ],
    },
  ],
  '/en/projects/': [
    {
      text: 'Projects',
      children: [
        '/en/projects/README.md',
      ],
    },
  ],
  '/en/notes/': [
    {
      text: 'Notes',
      children: [
        '/en/notes/README.md',
      ],
    },
  ],
  '/en/abouts/': [
    {
      text: 'Abouts',
      children: [
        '/en/abouts/README.md',
      ],
    },
  ],
}