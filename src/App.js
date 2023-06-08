import "./style.scss"
// import {Register} from "./pages/Register"
import {Register} from "./pages/Register"
import {Home} from "./pages/Home"
import {Login} from "./pages/Login"
import {AuthContext} from "./context/AuthContext"
import{
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useContext } from "react";
function App() {

  const {currentUser}=useContext(AuthContext)
  const ProtectedRoute =({children})=>{
    if(!currentUser){
      return <Navigate to="/login"></Navigate>
    }
    return children
  }
  // console.log(currentUser)
  return (
    // <Register></Register>
    <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<ProtectedRoute><Home></Home></ProtectedRoute>}></Route>
        <Route path="login" element={<Login></Login>}></Route>
        <Route path="register" element={<Register></Register>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
        <Route></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
