import { IMediaFile } from '../../post';

const mediaSlides = (images: IMediaFile[]) =>
  images
    .map(({ url, type }) => ({
      src: url,
      width: 3840,
      height: 5760,
      type,
    }))
    .map(({ src, width, type, height }) =>
      type.includes('image')
        ? {
            width,
            height,
            src,
          }
        : {
            type: 'video',
            width: 1280,
            height: 720,
            sources: [
              {
                src,
                type,
              },
            ],
          }
    );

export default mediaSlides;
