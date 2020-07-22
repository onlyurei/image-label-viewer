import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders all images on bootstrap', async () => {
  global.Object.fromEntries = (l) =>
    l.reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
  global.TextDecoder = function TextDecoder() {
    return { decode: (text) => text };
  };
  global.fetch = () =>
    Promise.resolve({
      body: {
        getReader: () => ({
          read: () => ({
            value: `Img_Name,Top,Left,Width,Height,Label
          02-25 13.26.44.jpg,131,1687,163,163,Speed Limit 80
          02-25 13.33.43.jpg,399,256,36,33,Speed Limit 50
          02-25 13.37.16.jpg,400,249,44,44,Speed Limit 50
          02-25 14.21.59.jpg,392,458,34,32,Speed Limit 50
          02-25 14.25.06.jpg,332,232,78,72,Speed Limit 50
          02-25 15.26.11.jpg,362,452,36,37,Speed Limit 50
          02-25 15.55.28.jpg,369,337,41,46,Speed Limit 50
          02-25 15.59.15.jpg,385,296,45,39,Speed Limit 50`,
          }),
        }),
      },
    });

  if (typeof global.IntersectionObserver === 'undefined') {
    await import('intersection-observer');
  }

  const { findAllByTestId } = render(<App />);
  mockAllIsIntersecting(true);

  await findAllByTestId(/.*jpg/i).then((images) =>
    expect(images).toHaveLength(8)
  );
});
