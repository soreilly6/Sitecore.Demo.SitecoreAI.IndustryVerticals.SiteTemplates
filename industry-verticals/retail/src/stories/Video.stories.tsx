import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as Video } from '../components/video/Video';
import { CommonParams, CommonRendering } from './common/commonData';
import {
  createImageField,
  createLinkField,
  createRichTextField,
  createTextField,
} from './helpers/createFields';

const meta = {
  title: 'Page Content/Video',
  component: Video,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Video>;
export default meta;

type Story = StoryObj<typeof Video>;

const baseRendering = {
  ...CommonRendering,
  componentName: 'Video',
  params: CommonParams,
};

const createVideoLinkField = (href: string) => ({
  value: { ...createLinkField('Watch the video').value, href, linktype: 'external' },
});

export const Default: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        VideoLink: createVideoLinkField('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
        VideoTitle: createTextField('How our furniture is made'),
        VideoDescription: createRichTextField(1),
      }}
    />
  ),
};

export const WithPosterImage: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        VideoLink: createVideoLinkField('https://youtu.be/dQw4w9WgXcQ'),
        VideoTitle: createTextField('Click the poster to start playback'),
        PosterImage: createImageField(),
      }}
    />
  ),
};

export const VimeoLink: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        VideoLink: createVideoLinkField('https://vimeo.com/76979871'),
        VideoTitle: createTextField('Vimeo example'),
      }}
    />
  ),
};

export const DirectVideoFile: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        VideoLink: createVideoLinkField(
          'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        ),
        VideoTitle: createTextField('Direct video file with native controls'),
      }}
    />
  ),
};

export const MediaLibraryFile: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        Video: {
          value: {
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        },
        VideoTitle: createTextField('Media library file with native controls'),
      }}
    />
  ),
};

export const UnsupportedLink: Story = {
  render: () => (
    <Video
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        VideoLink: createVideoLinkField('https://example.com/not-a-video'),
        VideoTitle: createTextField('Renders nothing outside editing mode'),
      }}
    />
  ),
};
