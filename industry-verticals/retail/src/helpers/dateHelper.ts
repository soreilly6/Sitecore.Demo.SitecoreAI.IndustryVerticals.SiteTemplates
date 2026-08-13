// Pinned locale and time zone so the server and browser render identical markup
export const articleDateFormatter = (date: Date | null): string | undefined =>
  date?.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const articleShortDateFormatter = (date: Date | null): string | undefined =>
  date?.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
