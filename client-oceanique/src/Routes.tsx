import { Route, Routes, Navigate } from "react-router-dom"
import Signin from './components/SignIn';
import Signup from './components/SignUp';
import { RecommendationProvider } from './context/RecommendationContext';
import { BeachProvider } from './context/BeachContext';
import { EventProvider } from './context/EventContext';
import NotFound from './components/NotFound';
import { Home, WhyOceaniqueSection } from './components/Home';
import Profile from './components/Profile';
import Beaches from './components/Beaches';
import BeachDetail from './components/BeachDetail';
import Events from './components/Events';
import Wishlist from './components/Wishlist';
import TransactionHistory from './components/TransactionHistory';
import Personality from './components/recommendation/Personality';
import CreateEditReviews from './components/CreateEditReview';
import EventDetail from './components/EventDetail';
import MainPurchase from './components/purchasing/MainPurchase';
import Result from './components/recommendation/Result';
import EditProfile from './components/EditProfile';
import PreferenceRank from './components/recommendation/PreferenceRank';
import Questions from './components/recommendation/Questions';
import ProtectedRoutes from './ProtectedRoutes';
import AdminProtectedRoute from './AdminProtectedRoutes';

// Import your admin components
import AdminDashboard from './components/admin_page/AdminDashboard';
// import AdminUsers from './components/admin_page/AdminUsers';
// import AdminBeaches from './components/admin_page/AdminBeaches';
// import AdminEvents from './components/admin_page/AdminEvents';
// import AdminReviews from './components/admin_page/AdminReviews';
// import AdminCMSDashboard from './components/admin_page/AdminCMSDashboard';
// import AdminEventDashboard from './components/admin_page/AdminEventDashboard';

export default function OceaniqueRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={
                <div>
                    <Home />
                    <WhyOceaniqueSection />
                </div>
            } />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes for regular users */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/personality" element={
                    <RecommendationProvider>
                        <Personality />
                    </RecommendationProvider>
                } />
                <Route path="/preference" element={
                    <RecommendationProvider>
                        <PreferenceRank />
                    </RecommendationProvider>
                } />
                <Route path="/questions" element={
                    <RecommendationProvider>
                        <Questions />
                    </RecommendationProvider>
                } />
                <Route path="/recommendation-result" element={
                    <RecommendationProvider>
                        <Result />
                    </RecommendationProvider>
                } />

                <Route path="/beaches" element={
                    <BeachProvider>
                        <Beaches />
                    </BeachProvider>
                } />
                <Route path="/beach-detail/:id" element={
                    <BeachProvider>
                        <BeachDetail />
                    </BeachProvider>
                } />
                <Route path="/add-review/:beachId" element={
                    <BeachProvider>
                        <CreateEditReviews />
                    </BeachProvider>
                } />
                <Route path="/edit-review/:reviewId" element={
                    <BeachProvider>
                        <CreateEditReviews />
                    </BeachProvider>
                } />

                <Route path="/events" element={
                    <EventProvider>
                        <Events />
                    </EventProvider>
                } />
                <Route path="/event-detail/:eventId" element={
                    <EventProvider>
                        <EventDetail />
                    </EventProvider>} />
                <Route path="/purchase/:id" element={
                    <EventProvider>
                        <MainPurchase />
                    </EventProvider>
                } />

                <Route path="/wishlist" element={
                    <BeachProvider>
                        <Wishlist />
                    </BeachProvider>
                } />

                <Route path="/transaction-history" element={
                    <EventProvider>
                        <TransactionHistory />
                    </EventProvider>
                } />
            </Route>

            {/* Admin routes - General admin access */}
            <Route element={<AdminProtectedRoute adminType="any" />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Admin CMS routes - Only for CMS admins */}
            {/* <Route element={<AdminProtectedRoute adminType="cms" />}>
                <Route path="/admin/cms" element={<AdminCMSDashboard />} />
                <Route path="/admin/cms/users" element={<AdminUsers />} />
                <Route path="/admin/cms/beaches" element={
                    <BeachProvider>
                        <AdminBeaches />
                    </BeachProvider>
                } />
                <Route path="/admin/cms/reviews" element={
                    <BeachProvider>
                        <AdminReviews />
                    </BeachProvider>
                } />
            </Route> */}

            {/* Admin Event routes - Only for Event admins */}
            {/* <Route element={<AdminProtectedRoute adminType="event" />}>
                <Route path="/admin/events" element={<AdminEventDashboard />} />
                <Route path="/admin/events/manage" element={
                    <EventProvider>
                        <AdminEvents />
                    </EventProvider>
                } />
                <Route path="/admin/events/create" element={
                    <EventProvider>
                        <AdminEvents />
                    </EventProvider>
                } />
            </Route> */}

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}