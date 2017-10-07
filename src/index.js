import './FemRouter'
import './FemRoute'
import Link from './Link'
import BrowserRouter from './BrowserRouter'
// register to the windows element.
const {history} = BrowserRouter;
window.femRouter = window.femRouter || {};
window.femRouter.Link = window.femRouter.Link  || Link;
window.femRouter.history = window.femRouter.history || history;