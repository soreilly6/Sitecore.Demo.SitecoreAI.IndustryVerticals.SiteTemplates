'use client';

import { useState } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  RichTextField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { appendQueryParam, resolveVideoSource } from '@/helpers/videoHelpers';
import { Play } from 'lucide-react';

interface Fields {
  Video?: ImageField;
  VideoLink?: LinkField;
  VideoTitle?: Field<string>;
  VideoDescription?: RichTextField;
  PosterImage?: ImageField;
}

interface VideoProps extends ComponentProps {
  fields: Fields;
}

const IFRAME_PERMISSIONS =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

export const Default = ({ params, fields }: VideoProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const [isPlaying, setIsPlaying] = useState(false);

  const embed = resolveVideoSource(fields?.VideoLink?.value?.href, fields?.Video?.value?.src);

  if (!fields || !embed) {
    return isPageEditing ? (
      <div className={`component video ${styles}`} id={id}>
        [VIDEO] Paste a YouTube, Vimeo or video file URL in Video Link, or choose a file in Video.
      </div>
    ) : (
      <></>
    );
  }

  const label = fields.VideoTitle?.value || 'Video';
  const posterSrc = fields.PosterImage?.value?.src;
  const showPoster = embed.kind === 'embed' && !!posterSrc && !isPlaying;

  return (
    <div className={`component video ${styles}`} id={id}>
      <div className="container py-11">
        {(fields.VideoTitle?.value || isPageEditing) && (
          <ContentSdkText tag="h2" field={fields.VideoTitle} className="mb-6" />
        )}

        <figure>
          <div className="bg-foreground relative aspect-video w-full overflow-hidden rounded-lg">
            {embed.kind === 'file' && (
              <video className="image-cover" controls preload="metadata" poster={posterSrc}>
                <source src={embed.src} />
              </video>
            )}

            {showPoster && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={`Play ${label}`}
                className="group absolute inset-0 h-full w-full"
              >
                <ContentSdkImage field={fields.PosterImage} className="image-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/45">
                  <Play className="text-background size-16" aria-hidden="true" />
                </span>
              </button>
            )}

            {embed.kind === 'embed' && !showPoster && (
              <iframe
                src={isPlaying ? appendQueryParam(embed.src, 'autoplay', '1') : embed.src}
                title={label}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allow={IFRAME_PERMISSIONS}
                allowFullScreen
              />
            )}
          </div>

          {(fields.VideoDescription?.value || isPageEditing) && (
            <figcaption className="text-foreground-light rich-text mt-4 text-sm">
              <ContentSdkRichText field={fields.VideoDescription} />
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
};
