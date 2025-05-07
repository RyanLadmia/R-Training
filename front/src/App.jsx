import { Routes, Route } from 'react-router-dom'
import Header from './layout/header'
import Home from './page/home'
import Login from './page/login'
import Register from './page/register'
import ForgotPassword from './page/forgot-password'
import ResetPassword from './page/reset-password'
import ExercisesList from './page/exercises-list'
import VerifyEmail from './page/verify-email'
import AdminProfile from './page/admin/profile'
import UserProfile from './page/user/profile'
import { RoleGuard, AuthGuard } from './components/auth/RouteGuard'
import Unauthorized from './page/unauthorized'

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="content">
        <Routes>
          {/* Route principale */}
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<ExercisesList />} />
          {/* Routes d'authentification */}
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          {/* Route de vérification d'email */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          {/* Route d'accès non autorisé */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Routes protégées par rôle */}
          <Route path="/admin/profile" element={
            <RoleGuard allowedRoles="admin">
              <AdminProfile />
            </RoleGuard>
          } />
          
          <Route path="/user/profile" element={
            <AuthGuard>
              <UserProfile />
            </AuthGuard>
          } />
          {/*
          <Route path="/profile" element={<Profile />} />
          */}
        </Routes>
      </main>
      
      {/* Ici vous pourriez ajouter un Footer global */}
    </div>
  )
}

export default App
