export default function LandingPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl font-bold mb-6">Create & Track Your QR Codes</h1>
        <p className="text-lg mb-8 max-w-xl">
          Free tool to generate dynamic QR codes, track scans, and manage them from your dashboard.
        </p>
        <a
          href="/signup"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
        >
          Get Started Free
        </a>
      </main>
    )
}
