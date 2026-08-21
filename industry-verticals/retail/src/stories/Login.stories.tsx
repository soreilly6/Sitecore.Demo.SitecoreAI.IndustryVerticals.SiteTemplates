import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as Login } from '../components/login/Login';
import { CommonParams, CommonRendering } from './common/commonData';
import { createTextField } from './helpers/createFields';

const meta = {
  title: 'Forms/Login',
  component: Login,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Login>;
export default meta;

type Story = StoryObj<typeof Login>;

const baseRendering = {
  ...CommonRendering,
  componentName: 'Login',
  params: CommonParams,
};

export const Default: Story = {
  render: () => (
    <Login
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        Title: createTextField('Log in to your account'),
        ButtonText: createTextField('Log in'),
      }}
    />
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <Login
      params={CommonParams}
      rendering={baseRendering}
      fields={{
        ButtonText: createTextField('Sign in'),
      }}
    />
  ),
};
