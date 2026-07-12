import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './lib/theme';
import ScrollToTop from './components/ScrollToTop';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const MyFavourites = lazy(() => import('./pages/MyFavourites'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AllNovels = lazy(() => import('./pages/admin/AllNovels'));
const AddNovel = lazy(() => import('./pages/admin/AddNovel'));
const EditNovel = lazy(() => import('./pages/admin/EditNovel'));
const AllBanners = lazy(() => import('./pages/admin/AllBanners'));
const AddBanner = lazy(() => import('./pages/admin/AddBanner'));
const EditBanner = lazy(() => import('./pages/admin/EditBanner'));

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Suspense fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/favourites" element={<ProtectedRoute><MyFavourites /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

          {/* Admin Login — no protection needed */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Dashboard — protected via layout route pattern */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="novels" element={<AllNovels />} />
              <Route path="novels/add" element={<AddNovel />} />
              <Route path="novels/edit/:id" element={<EditNovel />} />
              <Route path="banners" element={<AllBanners />} />
              <Route path="banners/add" element={<AddBanner />} />
              <Route path="banners/edit/:id" element={<EditBanner />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}