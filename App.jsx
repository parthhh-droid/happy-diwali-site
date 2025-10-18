import React, { useEffect, useState } from "react";

// Single-file React component (Tailwind CSS assumed on the page) // How to use: // 1) Replace REPLACE_WITH_GOOGLE_CLIENT_ID with your OAuth 2.0 Client ID (Web application) from Google Cloud Console. // 2) Add the origin (e.g. https://your-site.com or http://localhost:3000) to the OAuth credentials Authorized JavaScript origins. // 3) Deploy to Netlify/Vercel/GitHub Pages or run locally with a React setup that includes Tailwind CSS.

const GOOGLE_CLIENT_ID = "REPLACE_WITH_GOOGLE_CLIENT_ID"; // <-- replace this

function decodeJwt (token) { try { const payload = token.split(".")[1]; const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))); return decoded; } catch (e) { return null; } }

export default function HappyDiwaliSite () { const [user, setUser] = useState(null); const [videos, setVideos] = useState([ // Add YouTube video IDs here — these will be embedded responsively. "dQw4w9WgXcQ", "3JZ_D3ELwOQ", "L_jWHffIx5E", ]);

useEffect(() => { // Load Google Identity Services script const id = "google-identity-script"; if (!document.getElementById(id)) { const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.id = id; s.async = true; s.defer = true; document.body.appendChild(s); s.onload = () => initGoogle(); } else { initGoogle(); }

function initGoogle () {
  if (!window.google?.accounts?.id) return;
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });

  // Render the Google Sign-In button into the placeholder div
  window.google.accounts.id.renderButton(
    document.getElementById("gsi-button"),
    { theme: "outline", size: "large", width: 240 }
  );

  // Optional: show One Tap prompt (commented out by default)
  // window.google.accounts.id.prompt();
}

// eslint-disable-next-line react-hooks/exhaustive-deps

}, []);

function handleCredentialResponse (response) { // response.credential is a JWT ID token — decode to get profile info const profile = decodeJwt(response.credential); if (profile) { setUser({ name: profile.name, email: profile.email, picture: profile.picture, }); } }

function signOut () { // Clear local profile. Google One Tap sessions must be handled via the Google console rules. setUser(null); // Optional: revoke token server-side if you saved tokens. }

return ( <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-yellow-100 to-orange-50 p-6"> <div className="max-w-5xl mx-auto"> <header className="flex items-center justify-between py-6"> <div> <h1 className="text-4xl font-extrabold tracking-tight">Happy Diwali 🎆</h1> <p className="mt-1 text-gray-700">Funny Diwali videos & warm wishes — Share the joy!</p> </div>

<div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow">
            <img src={user.picture} alt="profile" className="w-10 h-10 rounded-full object-cover" />
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <button onClick={signOut} className="ml-3 px-3 py-1 rounded-full border text-sm">Sign out</button>
          </div>
        ) : (
          <div id="gsi-button" /> // Google Sign-In button will render here
        )}
      </div>
    </header>

    <main>
      <section className="my-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold">Share a laugh — Diwali Specials</h2>
          <p className="text-sm text-gray-600 mt-1">Click any video to open and enjoy. Add or remove YouTube IDs in the code to customize.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((id) => (
              <div key={id} className="rounded-lg overflow-hidden bg-black">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    title={id}
                    src={`https://www.youtube.com/embed/${id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-3 bg-white">
                  <div className="text-sm">Funny Diwali video</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => navigator.share ? navigator.share({ title: 'Happy Diwali', url: window.location.href }) : alert('Share your link manually')}
                      className="px-3 py-1 border rounded-full text-sm"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-6">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-xl font-semibold">Send a personal Diwali wish</h3>
          <p className="text-sm text-gray-600 mt-2">If the visitor signs in with Google, you can optionally show a personalized greeting.</p>

          <div className="mt-4">
            {user ? (
              <div className="text-lg font-medium">Hi {user.name.split(" ")[0]} — Happy Diwali! ✨</div>
            ) : (
              <div className="text-sm text-gray-700">Sign in above to see a personalized wish with your account.</div>
            )}
          </div>
        </div>
      </section>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <div>Made with ❤️ — Remember: visitors must consent to sign in for their Google profile to appear.</div>
        <div className="mt-2">Privacy note: Do not store or publish users' profile info without clear permission.</div>
      </footer>
    </main>
  </div>
</div>

); }

