import { css, SerializedStyles } from '@emotion/react';

export const space = {
  desktopContainerSpacing: '36px',
};

type MediaSize = {
  min: number;
  max: number;
};

type MediaSizes = Record<string, MediaSize>;

const mediaSizes: MediaSizes = {
  mobile: { max: 768, min: 0 },
  tablet: { max: 1023, min: 768 },
  desktop: { max: 99999, min: 1024 },
};

type MediaQueries = Record<
  keyof typeof mediaSizes,
  (literals: TemplateStringsArray, ...placeholders: any[]) => SerializedStyles
>;

export const media: MediaQueries = Object.keys(mediaSizes).reduce((acc, label) => {
  acc[label] = (literals: TemplateStringsArray, ...placeholders: any[]) =>
    css`
      @media (max-width: ${mediaSizes[label].max}px) and (min-width: ${mediaSizes[label].min}px) {
        ${css(literals, ...placeholders)};
      }
    `;
  return acc;
}, {} as MediaQueries);
