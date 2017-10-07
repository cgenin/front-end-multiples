import './FemRouter'
import './FemRoute'
import Link from './Link'
import BrowserRouter from './BrowserRouter'

const {history} = BrowserRouter;
window.femRouter = window.femRouter || {Link,history};
export default {Link, LoadFile}