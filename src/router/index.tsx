import { createBrowserRouter } from 'react-router-dom';
import globalRoutes from './globalRouter';

const router = createBrowserRouter([...globalRoutes]);

export default router;
