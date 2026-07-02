import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import DaisyTest from "./pages/Daisy_test";
import Login from "./pages/Login";
import TermsAndConditions from "./pages/TermsAndConditions";
import Profile from "./pages/Profile";
import AddPet from "./pages/AddPet";
import PetProfile from "./pages/PetProfile";
import ConfigureProfile from "./pages/ConfigProfile";
import VetProfile from "./pages/VetProfile";
import ClinicProfile from "./pages/ClinicProfile";
import VetVerification from "./pages/VetVerification";
import ClinicVerification from "./pages/ClinicVerification";
import Information from "./pages/Information";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<DaisyTest />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/pet-profile/:id"element={<PetProfile />}/>
        <Route path="/configure-profile" element={<ConfigureProfile />}/>
        <Route path="/vet-profile/:id" element={<VetProfile />}/>
        <Route path="/clinic-profile/:id" element={<ClinicProfile />}/>
        <Route path="/vet-verification" element={<VetVerification />}/>
        <Route path="/clinic-verification" element={<ClinicVerification />}/>
        <Route path="/information" element={<Information />}/>
        <Route path="/admin" element={<AdminDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;