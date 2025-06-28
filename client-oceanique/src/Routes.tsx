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

// admin components
import AdminDashboard from './components/admin_page/AdminDashboard';
import AdminEvent from './components/admin_page/admin_event/events/Events';
import AdminEventDetail from './components/admin_page/admin_event/events/EventDetails';
import AdminAddEditEvent from './components/admin_page/admin_event/events/AddEditEvent';

import AdminTicket from './components/admin_page/admin_event/tickets/Tickets';
import AdminTicketDetail from './components/admin_page/admin_event/tickets/TicketDetails';
import AdminAddEditTicketDetail from './components/admin_page/admin_event/tickets/AddEditTicket';

import AdminTicketCategory from './components/admin_page/admin_event/tickets/TicketCategory';

import AdminTransReport from './components/admin_page/admin_event/transaction_report/TransactionReport';
import AdminTransDetails from './components/admin_page/admin_event/transaction_report/TransactionReportDetails';


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
            <Route path="/admincms-signin" element={<Signin />} />
            <Route path="/adminevent-signin" element={<Signin />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/adminevent-signup" element={<Signup />} />

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
            <Route element={<AdminProtectedRoute />}>
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
            <Route element={<AdminProtectedRoute adminType="event" />}>
                <Route path="/admin/events" element={
                    <EventProvider>
                        <AdminEvent />
                    </EventProvider>} />
                <Route path="/admin/events/:eventId" element={
                    <EventProvider>
                        <AdminEventDetail />
                    </EventProvider>} />
                <Route path="/admin/events/create" element={
                    <EventProvider>
                        <BeachProvider>
                            <AdminAddEditEvent />
                        </BeachProvider>
                    </EventProvider>} />
                <Route path="/admin/events/:eventId/edit" element={
                    <EventProvider>
                        <BeachProvider>
                            <AdminAddEditEvent />
                        </BeachProvider>
                    </EventProvider>
                } />

                <Route path="/admin/tickets" element={<AdminTicket />} />
                <Route path="/admin/tickets/:ticketId" element={<AdminTicketDetail />} />
                <Route path="/admin/tickets/create" element={<AdminAddEditTicketDetail />} />
                <Route path="/admin/tickets/:ticketId/edit" element={<AdminAddEditTicketDetail />} />


                <Route path="/admin/tickets/category" element={<AdminTicketCategory />} />
                <Route path="/admin/tickets/transactions-report" element={<AdminTransReport />} />
                <Route path="/admin/tickets/transactions-report/:transactionId" element={<AdminTransDetails />} />
            </Route>

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes >
    );
}