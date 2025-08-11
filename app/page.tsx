import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Virtual Tour Kebun Jubung
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jelajahi keindahan Kebun Jubung secara virtual
          </p>
          <div className="space-x-4">
            <Link 
              href="/virtual-tour" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
            >
              Mulai Virtual Tour
            </Link>
            <Link 
              href="/admin" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
