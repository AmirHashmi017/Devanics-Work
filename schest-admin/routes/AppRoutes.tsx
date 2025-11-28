import { Route, Routes } from 'react-router-dom';
import ErrorPage404 from '../pages/errorPages/404Page';
import Layout from '../pages/Layout';
import Dashboard from '../pages/Dashboard';
import Companies from '../pages/Companies';
import Transactions from '../pages/Transactions';
import Plans from '../pages/Plans/Plans';
import Create from '../pages/Plans/Create';
import Login from 'src/pages/Auth/login';
import SupportTickets from 'src/pages/SupportTickets';
import SupportTicketChat from 'src/pages/SupportTickets/ticketChat';
import ProtectedRoute from './ProtectedRoute';
import AdManagment from 'src/pages/AdManegment';
import CreateAd from 'src/pages/AdManegment/Create';
import UpdateAd from 'src/pages/AdManegment/Edit';
import ViewAd from 'src/pages/AdManegment/View';
import { PromoCodeListPage } from 'src/pages/Promo-Code/list';
import { CreatePromoCodePage } from 'src/pages/Promo-Code/create';
import { ViewPromoCodePage } from 'src/pages/Promo-Code/view';
import MyBidManagementProjects from 'src/pages/Bid-Management';
import CreatePostPage from 'src/pages/Bid-Management/post';
import ViewProjectDetailsPage from 'src/pages/Bid-Management/view';
import { FindProjectsPage } from 'src/pages/Bid-Management/find-projects';
import { ProjectDetailsPage } from 'src/pages/Bid-Management/details';
import Networking from 'src/pages/networking';
import SocialMedia from 'src/pages/social-media';
import Post from 'src/pages/social-media/post';
import UserProfile from 'src/pages/user';
import { UserManagementContractors } from 'src/pages/UserManagement/Contractors';
import { Routes as NavRoutes } from 'src/pages/Plans/utils';
import { UserManagementArchitects } from 'src/pages/UserManagement/Architect';
import { UserManagementOwners } from 'src/pages/UserManagement/Owner';
import { UserManagementProfessors } from 'src/pages/UserManagement/Professor';
import { UserManagementStudents } from 'src/pages/UserManagement/Student';
import { UserManagementSubcontractor } from 'src/pages/UserManagement/Subcontractor';
import { UserManagementVendors } from 'src/pages/UserManagement/Vendor';
import { UserManagementViewUserDetails } from 'src/pages/UserManagement/View';
import { UserManagementAddUser } from 'src/pages/UserManagement/AddUser';
import EmailNotificationListingPage from 'src/pages/EmailNotification';
import { CreateEmailNotificationPage } from 'src/pages/EmailNotification/create';
import { EditEmailNotificationPage } from 'src/pages/EmailNotification/edit';
import { ReportedProjectsPage } from 'src/pages/Bid-Management/reported';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/networking"
          element={
            <ProtectedRoute>
              <Networking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-media"
          element={
            <ProtectedRoute>
              <SocialMedia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-media/post/:id"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-media/post/:id/:commentId"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path={NavRoutes.User_Management.Contractor}
          element={
            <ProtectedRoute>
              <UserManagementContractors />
            </ProtectedRoute>
          }
        />
        <Route
          path={NavRoutes.User_Management.Architect}
          element={
            <ProtectedRoute>
              <UserManagementArchitects />
            </ProtectedRoute>
          }
        />
        <Route
          path={NavRoutes.User_Management.Owner}
          element={
            <ProtectedRoute>
              <UserManagementOwners />
            </ProtectedRoute>
          }
        />
        <Route
          path={NavRoutes.User_Management.Professor}
          element={
            <ProtectedRoute>
              <UserManagementProfessors />
            </ProtectedRoute>
          }
        />

        <Route
          path={NavRoutes.User_Management.Student}
          element={
            <ProtectedRoute>
              <UserManagementStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path={NavRoutes.User_Management.Subcontractor}
          element={
            <ProtectedRoute>
              <UserManagementSubcontractor />
            </ProtectedRoute>
          }
        />

        <Route
          path={NavRoutes.User_Management.Vendor}
          element={
            <ProtectedRoute>
              <UserManagementVendors />
            </ProtectedRoute>
          }
        />

        <Route
          path={NavRoutes.User_Management.View_Info}
          element={
            <ProtectedRoute>
              <UserManagementViewUserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path={NavRoutes.User_Management.Add_User}
          element={
            <ProtectedRoute>
              <UserManagementAddUser />
            </ProtectedRoute>
          }
        />
        {/* User Management */}

        {/* Email Notifications */}
        <Route
          path={NavRoutes.Email_Notification.List}
          element={
            <ProtectedRoute>
              <EmailNotificationListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={NavRoutes.Email_Notification.Create}
          element={
            <ProtectedRoute>
              <CreateEmailNotificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={`${NavRoutes.Email_Notification.Edit}/:id`}
          element={
            <ProtectedRoute>
              <EditEmailNotificationPage />
            </ProtectedRoute>
          }
        />

        {/* Email Notifications End */}

        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          }
        />
        <Route path="/plan/create" element={<Create />} />
        <Route path="/plan/:id" element={<Create />} />

        {/* Bid Management */}
        <Route
          path="/projects/reported"
          element={
            <ProtectedRoute>
              <ReportedProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <MyBidManagementProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/post"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/find"
          element={
            <ProtectedRoute>
              <FindProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/view/:id"
          element={
            <ProtectedRoute>
              <ViewProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/details/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* End Bid Management */}

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supportickets"
          element={
            <ProtectedRoute>
              <SupportTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supporticket/:supportTicketId"
          element={<SupportTicketChat />}
        />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/ad-managment" element={<AdManagment />} />
        <Route path="/ad-managment/create" element={<CreateAd />} />
        <Route path="/ad-managment/update/:id" element={<UpdateAd />} />
        <Route path="/ad-managment/view/:id" element={<ViewAd />} />

        <Route path="/promo-code" element={<PromoCodeListPage />} />
        <Route path="/promo-code/create" element={<CreatePromoCodePage />} />
        <Route path="/promo-code/view/:id" element={<ViewPromoCodePage />} />
      </Route>
      <Route path="*" element={<ErrorPage404 />} />
    </Routes>
  );
}

export default AppRoutes;
