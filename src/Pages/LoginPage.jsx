import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);

    if(username == 'zeemobile' && password == '1809'){
    setTimeout(() => {
      localStorage.setItem("isAuth", "true");
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  }
  else{
    setTimeout(() => {
      alert("Invalid credentials! Please try again.");
      setIsLoading(false);
    }, 1000);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">
            Z
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Zee Mobile Shop
          </h1>
          <p className="text-md text-slate-500 mt-1">
            Personalized Inventory Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-xl py-2.5 font-semibold text-white transition-all flex items-center justify-center
              ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-emerald-500 hover:scale-[1.02]"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Signing you in…
              </span>
            ) : (
              "Enter Dashboard"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm underline text-center text-slate-600 mt-6">
          Authorized access only · Internal use
        </p>
      </div>
    </div>
  );
}
    