import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyFavourites from './pages/MyFavourites';
import MyProfile from './pages/MyProfile';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllNovels from './pages/admin/AllNovels';
import AddNovel from './pages/admin/AddNovel';
import EditNovel from './pages/admin/EditNovel';
import AllBanners from './pages/admin/AllBanners';
import AddBanner from './pages/admin/AddBanner';
import EditBanner from './pages/admin/EditBanner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
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

        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="novels" element={<AllNovels />} />
          <Route path="novels/add" element={<AddNovel />} />
          <Route path="novels/edit/:id" element={<EditNovel />} />
          <Route path="banners" element={<AllBanners />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="banners/edit/:id" element={<EditBanner />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
