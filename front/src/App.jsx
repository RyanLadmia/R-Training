import { Routes, Route } from 'react-router-dom'
import Home from './page/home'
import Header from './layout/header'
import ExercisesList from './page/exercises-list'


function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="content">
        <Routes>
          {/* Route principale */}
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<ExercisesList />} />
          {/* Futures routes */}
          {/* 
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          
          <Route path="/profile" element={<Profile />} />
          */}
        </Routes>
      </main>
      
      {/* Ici vous pourriez ajouter un Footer global */}
    </div>
  )
}

export default App
