import Snabbdom from 'snabbdom-pragma'
import { Title } from "../atoms/title"

export const Card = ({title}, children) => <header>
  <Title title={title} />
  <div>{children}</div>
</header>

