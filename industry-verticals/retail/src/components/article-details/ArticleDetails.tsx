import { isParamEnabled } from '@/helpers/isParamEnabled';
import { articleDateFormatter } from '@/helpers/dateHelper';
import { ComponentProps } from '@/lib/component-props';
import { Author, Category, Tag } from '@/types/article';
import {
  Field,
  ImageField,
  RichTextField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  DateField,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Clock, Share2 } from 'lucide-react';
import { useI18n } from 'next-localization';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SocialShare from '../non-sitecore/SocialShare';

interface Fields {
  Title: Field<string>;
  ShortDescription: Field<string>;
  Content: RichTextField;
  Image: ImageField;
  PublishedDate?: Field<string>;
  Author?: Author;
  Category?: Category;
  Tags?: Tag[];
  ReadTime?: Field<string>;
  Introduction?: RichTextField;
  HTMLBlock?: RichTextField;
  Body?: RichTextField;
  Conclusion?: RichTextField;
  WhyKantar?: RichTextField;
  SourcesDisclaimers?: RichTextField;
}

interface ArticleDetailsProps extends ComponentProps {
  fields: Fields;
}

const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return currentUrl;
};

const ArticleOpenGraphTags = ({ fields, currentUrl }: { fields: Fields; currentUrl: string }) => (
  <Head>
    <meta property="og:url" content={currentUrl} />
    <meta property="og:name" content={fields?.Title?.value} />
    <meta property="og:title" content={fields?.Title?.value} />
    <meta property="og:description" content={fields?.ShortDescription?.value} />
    <meta property="og:image" content={fields?.Image?.value?.src} />
    <meta property="og:type" content="article" />
  </Head>
);

const ArticleDetailsCommon = ({
  params,
  fields,
  rendering,
  children,
}: ArticleDetailsProps & {
  children?: React.ReactNode;
}) => {
  const { page } = useSitecore();
  const currentUrl = useCurrentUrl();
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = params;
  const placeholderKey = `article-details-${DynamicPlaceholderId}`;
  const fullWidthPlaceholderKey = `article-details-full-width-${DynamicPlaceholderId}`;
  const isPageEditing = page.mode.isEditing;
  const hideShareWidget = isParamEnabled(params.HideShareWidget);

  if (!fields) {
    return isPageEditing ? (
      <div className={`component article-details ${styles}`} id={id}>
        [ARTICLE DETAILS]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <>
      <ArticleOpenGraphTags fields={fields} currentUrl={currentUrl} />

      <article className={`component article-details ${styles}`} id={id}>
        <div className="container">
          <div className="grid grid-cols-12 gap-4 py-11">
            {/* Social Share */}
            {!hideShareWidget && (
              <SocialShare
                url={currentUrl}
                title={fields?.Title?.value || ''}
                description={fields?.ShortDescription?.value || ''}
                mediaUrl={fields?.Image?.value?.src || ''}
                className="col-span-12 size-fit p-3 shadow-xl md:p-4 lg:col-span-1 lg:flex-col"
              />
            )}

            {children}

            <div className="col-span-12 mt-8 lg:col-span-8 lg:col-start-3">
              <h2>
                <ContentSdkText field={fields.Title} />
              </h2>

              <p className="text-foreground-muted mt-5 text-lg font-medium tracking-wide">
                <ContentSdkText field={fields.ShortDescription} />
              </p>

              <div className="rich-text mt-10 text-lg">
                <ContentSdkRichText field={fields.Content} />
              </div>
            </div>

            <div className="col-span-12 mt-12 lg:col-span-10 lg:col-start-2">
              <Placeholder name={placeholderKey} rendering={rendering} />
            </div>
          </div>
        </div>
        <Placeholder name={fullWidthPlaceholderKey} rendering={rendering} />
      </article>
    </>
  );
};

export const Default = ({ params, fields, rendering }: ArticleDetailsProps) => {
  return (
    <ArticleDetailsCommon params={params} fields={fields} rendering={rendering}>
      <div className="col-span-12 aspect-video w-full overflow-hidden rounded-lg lg:col-span-10 lg:col-start-2">
        <ContentSdkImage field={fields?.Image} className="h-full w-full object-cover" />
      </div>
    </ArticleDetailsCommon>
  );
};

export const NoImage = ({ params, fields, rendering }: ArticleDetailsProps) => {
  return <ArticleDetailsCommon params={params} fields={fields} rendering={rendering} />;
};

const ShareToggle = ({
  url,
  title,
  description,
  mediaUrl,
}: {
  url: string;
  title: string;
  description: string;
  mediaUrl: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const label = t('share_label') || 'Share';

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="text-foreground-light hover:text-foreground flex items-center gap-2 text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={label}
      >
        <Share2 className="size-4" />
        {label}
      </button>

      {isOpen && (
        <SocialShare round url={url} title={title} description={description} mediaUrl={mediaUrl} />
      )}
    </div>
  );
};

export const FullDetails = ({ params, fields, rendering }: ArticleDetailsProps) => {
  const { page } = useSitecore();
  const currentUrl = useCurrentUrl();
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = params;
  const placeholderKey = `article-details-${DynamicPlaceholderId}`;
  const fullWidthPlaceholderKey = `article-details-full-width-${DynamicPlaceholderId}`;
  const isPageEditing = page.mode.isEditing;
  const hideShareWidget = isParamEnabled(params.HideShareWidget);

  if (!fields) {
    return isPageEditing ? (
      <div className={`component article-details ${styles}`} id={id}>
        [ARTICLE DETAILS]
      </div>
    ) : (
      <></>
    );
  }

  const author = fields.Author?.fields;
  const tags = Array.isArray(fields.Tags) ? fields.Tags : [];

  return (
    <>
      <ArticleOpenGraphTags fields={fields} currentUrl={currentUrl} />

      <article className={`component article-details ${styles}`} id={id}>
        <div className="container">
          <div className="grid grid-cols-12 gap-4 py-11">
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              {/* Meta bar */}
              <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="text-foreground-light flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {fields.PublishedDate && (fields.PublishedDate.value || isPageEditing) && (
                    <DateField
                      tag="span"
                      className="font-semibold tracking-widest uppercase"
                      field={fields.PublishedDate}
                      render={articleDateFormatter}
                    />
                  )}

                  {(fields.Category?.fields?.Category?.value || isPageEditing) && (
                    <ContentSdkText
                      tag="span"
                      className="border-accent text-foreground bg-background-accent rounded-sm border px-2 py-0.5 font-medium"
                      field={fields.Category?.fields?.Category}
                    />
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map((tag) => (
                        <span key={tag.id} className="bg-background-muted rounded-sm px-2 py-0.5">
                          <ContentSdkText field={tag.fields.Tag} />
                        </span>
                      ))}
                    </div>
                  )}

                  {(fields.ReadTime?.value || isPageEditing) && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <ContentSdkText field={fields.ReadTime} />
                    </span>
                  )}
                </div>

                {!hideShareWidget && (
                  <ShareToggle
                    url={currentUrl}
                    title={fields?.Title?.value || ''}
                    description={fields?.ShortDescription?.value || ''}
                    mediaUrl={fields?.Image?.value?.src || ''}
                  />
                )}
              </div>

              {/* Author */}
              {author && (
                <div className="mt-8 flex items-center gap-4">
                  {author.Avatar?.value?.src && (
                    <ContentSdkImage
                      field={author.Avatar}
                      className="size-14 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      <ContentSdkText field={author.AuthorName} />
                    </p>
                    {author.About?.value && (
                      <p className="text-foreground-muted text-xs tracking-widest uppercase">
                        <ContentSdkText field={author.About} />
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Short description with accent bar */}
              <div className="border-accent mt-10 border-l-4 pl-6">
                <p className="text-xl font-medium tracking-wide">
                  <ContentSdkText field={fields.ShortDescription} />
                </p>
              </div>

              {/* Article body */}
              <div className="rich-text mt-12 space-y-14 text-lg">
                {(fields.Introduction?.value || isPageEditing) && (
                  <ContentSdkRichText field={fields.Introduction} />
                )}
                {fields.HTMLBlock?.value && (
                  <div className="flex justify-center">
                    <ContentSdkRichText
                      field={fields.HTMLBlock}
                      className="max-w-full text-center"
                    />
                  </div>
                )}
                {(fields.Body?.value || isPageEditing) && (
                  <ContentSdkRichText field={fields.Body} />
                )}
                {(fields.Conclusion?.value || isPageEditing) && (
                  <ContentSdkRichText field={fields.Conclusion} />
                )}
              </div>

              {(fields.WhyKantar?.value || isPageEditing) && (
                <aside className="bg-background-accent rich-text mt-16 rounded-lg p-6">
                  <ContentSdkRichText field={fields.WhyKantar} />
                </aside>
              )}

              {(fields.SourcesDisclaimers?.value || isPageEditing) && (
                <div className="border-border text-foreground-muted rich-text mt-16 border-t pt-8 text-sm">
                  <ContentSdkRichText field={fields.SourcesDisclaimers} />
                </div>
              )}
            </div>

            <div className="col-span-12 mt-12 lg:col-span-10 lg:col-start-2">
              <Placeholder name={placeholderKey} rendering={rendering} />
            </div>
          </div>
        </div>
        <Placeholder name={fullWidthPlaceholderKey} rendering={rendering} />
      </article>
    </>
  );
};
