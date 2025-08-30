import { Dispatch, SetStateAction } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { IMediaFile } from '../post';
import mediaSlides from './components/Slides';
import Video from 'yet-another-react-lightbox/plugins/video';

type Props = {
  mediaUrls: IMediaFile[];
  index: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LightBox = ({ mediaUrls, index = 0, open, setOpen }: Props) => {
  return (
    <Lightbox
      plugins={[Video, Zoom]}
      open={open}
      index={index}
      close={() => setOpen(false)}
      slides={[...mediaSlides(mediaUrls)] as any}
    />
  );
};

export default LightBox;
