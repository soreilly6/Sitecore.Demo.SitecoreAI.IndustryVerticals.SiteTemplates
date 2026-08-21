import { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Default as ArticleDetails,
  NoImage as ArticleDetailsNoImage,
  FullDetails as ArticleDetailsFullDetails,
  MedicalArticle as ArticleDetailsMedicalArticle,
} from '../components/article-details/ArticleDetails';
import { CommonParams, CommonRendering } from './common/commonData';
import { renderStorybookPlaceholder } from './helpers/renderStorybookPlaceholder';
import { createRichTextField, createTextField, createImageField } from './helpers/createFields';
import { boolToSitecoreCheckbox } from './helpers/boolToSitecoreCheckbox';
import { Author, Category, Tag } from '@/types/article';

type StoryProps = ComponentProps<typeof ArticleDetails> & {
  hideShareWidget?: boolean;
};

const meta = {
  title: 'Articles/Article Details',
  component: ArticleDetails,
  tags: ['autodocs'],
  argTypes: {
    hideShareWidget: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
  args: {
    hideShareWidget: false,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = {
  ...CommonParams,
};

const baseRendering = {
  ...CommonRendering,
  componentName: 'Article Details',
  params: baseParams,
  placeholders: {
    [`article-details-${baseParams.DynamicPlaceholderId}`]: [renderStorybookPlaceholder()],
    [`article-details-full-width-${baseParams.DynamicPlaceholderId}`]: [
      renderStorybookPlaceholder(),
    ],
  },
};

const baseFields = {
  Title: createTextField(),
  ShortDescription: createTextField(),
  Content: createRichTextField(5),
  Image: createImageField(),
};

export const Default: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      HideShareWidget: boolToSitecoreCheckbox(args.hideShareWidget),
    };

    return <ArticleDetails params={params} rendering={baseRendering} fields={baseFields} />;
  },
};

export const NoImage: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      HideShareWidget: boolToSitecoreCheckbox(args.hideShareWidget),
    };

    return <ArticleDetailsNoImage params={params} rendering={baseRendering} fields={baseFields} />;
  },
};

const fullDetailsFields = {
  ...baseFields,
  PublishedDate: { value: new Date(2026, 7, 6).toISOString() },
  Author: {
    id: 'author-1',
    displayName: 'Stacy Saggers',
    name: 'stacy-saggers',
    url: '/authors/stacy-saggers',
    fields: {
      AuthorName: createTextField('Stacy Saggers'),
      About: createTextField('Chief Commercial Officer, Kantar South Africa'),
      Avatar: createImageField(),
    },
  } as Author,
  Category: {
    id: 'category-1',
    displayName: 'Article',
    name: 'article',
    url: '/categories/article',
    fields: { Category: createTextField('Article') },
  } as Category,
  Tags: [
    {
      id: 'tag-1',
      displayName: 'Brands',
      name: 'brands',
      url: '/tags/brands',
      fields: { Tag: createTextField('Brands') },
    },
    {
      id: 'tag-2',
      displayName: 'Insights',
      name: 'insights',
      url: '/tags/insights',
      fields: { Tag: createTextField('Insights') },
    },
  ] as Tag[],
  ReadTime: createTextField('6 min read'),
  Introduction: createRichTextField(1),
  HTMLBlock: {
    value:
      '<figure><img src="https://placehold.co/480x270" alt="Embedded chart" /><figcaption>Top 30 Most Valuable South African Brands</figcaption></figure>',
  },
  Body: createRichTextField(4),
  Conclusion: createRichTextField(1),
  WhyKantar: createRichTextField(1),
  SourcesDisclaimers: createRichTextField(1),
};

export const FullDetails: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      HideShareWidget: boolToSitecoreCheckbox(args.hideShareWidget),
    };

    return (
      <ArticleDetailsFullDetails
        params={params}
        rendering={baseRendering}
        fields={fullDetailsFields}
      />
    );
  },
};

const medicalArticleRendering = {
  ...baseRendering,
  placeholders: {
    ...baseRendering.placeholders,
    [`article-details-sidebar-${baseParams.DynamicPlaceholderId}`]: [renderStorybookPlaceholder()],
  },
};

const medicalArticleFields = {
  ...baseFields,
  Conclusion: createRichTextField(1),
};

export const MedicalArticle: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      HideShareWidget: boolToSitecoreCheckbox(args.hideShareWidget),
    };

    return (
      <ArticleDetailsMedicalArticle
        params={params}
        rendering={medicalArticleRendering}
        fields={medicalArticleFields}
      />
    );
  },
};
