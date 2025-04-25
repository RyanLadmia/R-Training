import { Routes, Route } from 'react-router-dom'
import Home from './page/home'

function App() {
  return (
    <div className="app">
      {/* Ici vous pourriez ajouter un Header global, une barre de navigation, etc. */}
      
      <main className="content">
        <Routes>
          {/* Route principale */}
          <Route path="/" element={<Home />} />
          
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
