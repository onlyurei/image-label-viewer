import React from 'react';
import { useInView } from 'react-intersection-observer';

export default function Image({ src, labels, color = '#39ff14' }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <div
      data-testid={src}
      style={{
        position: 'relative',
        minHeight: 500,
        display: 'flex',
        width: '100%',
      }}
      {...{ ref }}
    >
      {inView && (
        <>
          <img {...{ src }} alt={labels.map(({ label }) => label).join(', ')} />
          {labels.map(({ top, left, width, height, label }) => (
            <div
              key={JSON.stringify({ top, left, width, height })}
              style={{
                position: 'absolute',
                top,
                left,
                width,
                height,
                border: `1px solid ${color}`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 5px)',
                  fontSize: width / 3.5,
                  color,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
