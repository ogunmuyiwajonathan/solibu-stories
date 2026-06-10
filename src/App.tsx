import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllNovels from './pages/admin/AllNovels';
import AddNovel from './pages/admin/AddNovel';
import EditNovel from './pages/admin/EditNovel';
import ProtectedRoute from './components/ProtectedRoute';

const Reader = lazy(() => import('./pages/Reader'));

function ReaderFallback() {
  return (
    <div className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-[#C89B5A]/30 border-t-[#C89B5A] rounded-full animate-spin" />
      <p className="text-[#D7C5A3] font-medium text-sm">Loading reader...</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/read/:id" element={<Suspense fallback={<ReaderFallback />}><Reader /></Suspense>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="novels" element={<AllNovels />} />
          <Route path="novels/add" element={<AddNovel />} />
          <Route path="novels/edit/:id" element={<EditNovel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
