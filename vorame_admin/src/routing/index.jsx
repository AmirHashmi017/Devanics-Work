import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  Login,
  ForgotPassword,
  ResetPassword,
  Blogs,
  BluePrint,
  BookClub,
  Clips,
  Library,
  Whistle,
  Dashboard,
  Lounges,
  Tapes,
  Practice,
  Promos,
  Faqs,
  NotFound,
} from "../pages";
import PostsTab from "pages/posts/PlansTab";
import { AuthLayout, AdminLayout } from "../layout";
import PlansTab from "pages/vorame-plans/PlansTab";
import authHandler from "../managers/auth";
import TableTab from "pages/user-managment/TableTab";
import Careers from "pages/careers/Header";
import JobDetails from "pages/careers/components/JobDetails";
import SupportTickets from "pages/support-tickets/Header";
import ReportedUsers from "pages/content-manager/reported-users";
import Promotions from "pages/vorame-plans/promotion/Header";
import SupportTicketDetails from "pages/support-tickets old/components/TicketDetails";
import EventDetails from "pages/event/components/EventDetails";
import EventsModule from "pages/event";
import PostDetails from "pages/posts/postDetail/[id]/DetailTab";
import SupportTicketModule from "pages/support-tickets old/index";


const Routing = () => {
  const ProtectedRoute = () => {
    const token = authHandler.getToken();

    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/setnewpassword/:id" element={<ResetPassword />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/tranquility" element={<Tapes />} />
            <Route path="/concepts" element={<Practice />} />
            <Route path="/user/list" element={<TableTab />} />
            <Route path="/posts" element={<PostsTab />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/bookclub" element={<BookClub />} />
            <Route path="/clips" element={<Clips />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/support-tickets" element={<SupportTicketModule />} />
            <Route path="/reported-users" element={<ReportedUsers />} />
            <Route
              path="/support-ticket/:id"
              element={<SupportTicketDetails />}
            />
            {/* <Route path="/settings" element={<Home />} /> */}
            <Route path="/plans" element={<PlansTab />} />
            <Route path="/promotions" element={<Promotions />} />

            <Route path="/promos" element={<Promos />} />
            <Route path="/library" element={<Library />} />
            <Route path="/whistle" element={<Whistle />} />
            <Route path="/blueprint" element={<BluePrint />} />
            <Route path="/lounge" element={<Lounges />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/events" element={<EventsModule />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Routing;
