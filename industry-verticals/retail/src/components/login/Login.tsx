'use client';

import { FormEvent } from 'react';
import { Field, Text as ContentSdkText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Title?: Field<string>;
  ButtonText?: Field<string>;
}

interface LoginProps extends ComponentProps {
  fields?: Fields;
}

const INPUT_CLASS =
  'bg-background ring-foreground/5 text-foreground placeholder:text-foreground/70 h-12 w-full rounded-md px-5 ring-1 focus:ring-2 focus:outline-none md:h-14';

const DEFAULT_BUTTON_TEXT = 'Log in';

/**
 * Login form with email and password fields. Submission is a no-op until auth is wired up.
 * @param {LoginProps} props - Sitecore rendering props for the login datasource.
 * @returns {JSX.Element} The login form.
 */
export const Default = ({ params, fields, rendering }: LoginProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const uid = rendering.uid;

  /**
   * Blocks the native form post so credentials are not sent anywhere yet.
   * @param {FormEvent<HTMLFormElement>} event - The form submit event.
   * @returns {void}
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`component login ${styles}`} id={id}>
      <div className="container py-11">
        <div className="mx-auto w-full max-w-md">
          {(fields?.Title?.value || isPageEditing) && (
            <ContentSdkText tag="h2" field={fields?.Title} className="mb-8" />
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor={`login-email-${uid}`}
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id={`login-email-${uid}`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor={`login-password-${uid}`}
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id={`login-password-${uid}`}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                className={INPUT_CLASS}
              />
            </div>

            <button
              type="submit"
              className="bg-background-accent font-body inline-flex h-12 w-full items-center justify-center rounded-md text-black hover:opacity-90 md:h-14"
            >
              {fields?.ButtonText?.value ? (
                <ContentSdkText field={fields.ButtonText} />
              ) : (
                DEFAULT_BUTTON_TEXT
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
