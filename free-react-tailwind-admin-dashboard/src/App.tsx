import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { BlogList, CreateBlog } from "./pages/Blogs";
import { CollectionList, CreateCollection, CreateCollectionContent, CollectionDetail } from "./pages/Collections";
import { ExperienceList, CreateExperience } from "./pages/Experiences";
import { ContactInquiryList } from "./pages/ContactInquiries";
import { TagList } from "./pages/Tags";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index path="/" element={<Home />} />

            {/* Travel Management */}
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/contact-inquiries" element={<ContactInquiryList />} />
            <Route path="/collections" element={<CollectionList />} />
            <Route path="/collections/create" element={<CreateCollection />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/collections/content" element={<CreateCollectionContent />} />
            <Route path="/collections/:collectionId/content/create" element={<CreateCollectionContent />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/experiences" element={<ExperienceList />} />
            <Route path="/experiences/create" element={<CreateExperience />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />

            {/* Reports */}
            <Route path="/reports/content" element={<Blank />} />
            <Route path="/reports/regional" element={<Blank />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
