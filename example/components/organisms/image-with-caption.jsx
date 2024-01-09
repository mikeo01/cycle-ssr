import Snabbdom from 'snabbdom-pragma'
import {Image} from "../atoms/image"
import {FigureCaption} from "../atoms/figure-caption"
import {Figure} from "../molecules/figure"

export const ImageWithCaption = ({src, caption}) => <Figure>
  <Image src={src} />
  <FigureCaption caption={caption} />
</Figure>
