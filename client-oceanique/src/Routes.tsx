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

            {/* Protected routes */}
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

                <Route path="/wishlist" element={<Wishlist />} />

                <Route path="/transaction-history" element={<TransactionHistory />} />
            </Route>

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}