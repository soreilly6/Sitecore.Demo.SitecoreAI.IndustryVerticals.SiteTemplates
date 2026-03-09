import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

const DEFAULT_MAIN_BG = '#2A52BE';
const DEFAULT_DIAGONAL_OVERLAY_BG = '#1e3a8a';
const DEFAULT_SUBTITLE_COLOR = '#FFD700';
const DEFAULT_TITLE_COLOR = '#FFFFFF';
const DEFAULT_BUTTON_BG = '#FFD700';
const DEFAULT_BUTTON_TEXT = '#000000';

interface Fields {
  Image: ImageField;
  Subtitle: Field<string>;
  Title: Field<string>;
  SearchPlaceholder: Field<string>;
  CtaLink: LinkField;
  ButtonText: Field<string>;
}

export type ASHeroParams = {
  [key: string]: string | undefined;
  RenderingIdentifier?: string;
  styles?: string;
  MainBackgroundColor?: string;
  DiagonalOverlayColor?: string;
  SubtitleColor?: string;
  TitleColor?: string;
  ButtonBackgroundColor?: string;
  ButtonTextColor?: string;
};

export type ASHeroProps = ComponentProps & {
  params: ASHeroParams;
  fields: Fields;
};

const ASHeroCommon = ({
  params,
  fields,
  children,
}: ASHeroProps & { children: React.ReactNode }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return isPageEditing ? (
      <div className={`component as-hero ${styles}`} id={id}>
        [AS Hero]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div
      className={`component as-hero ${styles} relative flex min-h-[320px] flex-col lg:min-h-[420px] lg:flex-row`}
      id={id}
    >
      {children}
    </div>
  );
};

export const Default = ({ params, fields, rendering }: ASHeroProps) => {
  const searchPlaceholder =
    (fields?.SearchPlaceholder?.value as string) ?? 'Search by postcode or location';

  return (
    <ASHeroCommon params={params} fields={fields} rendering={rendering}>
      {/* Diagonal overlay: darker blue triangle from top middle, down and left, overlapping image */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
        style={{
          clipPath: 'polygon(50% 0, 100% 0, 0 100%)',
          backgroundColor: DEFAULT_DIAGONAL_OVERLAY_BG,
        }}
        aria-hidden
      />

      {/* Left: content area with solid background */}
      <div
        className="relative z-10 flex flex-1 flex-col justify-center px-6 py-10 md:px-8 md:py-12 lg:w-[55%] lg:pr-24 lg:pl-10 xl:pl-16"
        style={{ backgroundColor: DEFAULT_MAIN_BG }}
      >
        {/* Subtitle (yellow) */}
        <p className="text-xl font-semibold md:text-2xl" style={{ color: DEFAULT_SUBTITLE_COLOR }}>
          <ContentSdkText field={fields.Subtitle} />
        </p>
        {/* Title (white, bold) */}
        <h1
          className="mt-2 text-3xl leading-tight font-bold md:text-4xl xl:text-5xl"
          style={{ color: DEFAULT_TITLE_COLOR }}
        >
          <ContentSdkText field={fields.Title} />
        </h1>

        {/* Input + button as one unit */}
        <div className="mt-6 flex flex-col gap-0 sm:flex-row sm:items-stretch">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 rounded-t-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-500 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none sm:rounded-l-lg sm:rounded-tr-none sm:rounded-br-none"
            readOnly
            disabled
            aria-label={searchPlaceholder}
          />
          <Link
            field={fields.CtaLink}
            className="inline-flex items-center justify-center gap-2 rounded-b-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90 sm:rounded-tl-none sm:rounded-r-lg sm:rounded-bl-none"
            style={{ backgroundColor: DEFAULT_BUTTON_BG, color: DEFAULT_BUTTON_TEXT }}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <ContentSdkText field={fields.ButtonText} />
          </Link>
        </div>
      </div>

      {/* Right: image */}
      <div className="relative z-0 flex shrink-0 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[55%]">
        <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full">
          <ContentSdkImage
            field={fields.Image}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
      </div>
    </ASHeroCommon>
  );
};
