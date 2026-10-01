import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MeetandGreet from "./pages/MeetandGreet";
import Lounges from "./pages/Lounges";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Tranpotation from "./pages/Transportation";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Cart from './pages/Cart';
import MeetandGreetDetails from './pages/MeetAndGreetDetails';
import Herosection from './components/HeroSection';
import LoungeDetails from "./pages/LoungeDetails";
import TransportationDetails from "./pages/TransportationDetails";
function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
    
        <Route path="/meet-and-greet" element={<MeetandGreet />}/>
        <Route path="/meet-and-greet-details" element={<MeetandGreetDetails />} />
        <Route path="/lounges" element={<Lounges />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/transport" element={<Tranpotation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/heroSection" element={<Herosection />} />
        <Route path="/lounge-details" element={<LoungeDetails />} />
        <Route
  path="/transportation-details"
  element={<TransportationDetails />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;