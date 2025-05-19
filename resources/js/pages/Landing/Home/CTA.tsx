export default function CTA() {
    return (
        <div className="bg-gradient-to-r from-orange-600 to-rose-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Bergabung dengan Sans Store dan dapatkan source code premium!
                </h1>
                <a
                    href={route('register')}
                    className="inline-block bg-white text-rose-800 font-medium rounded-lg px-5 py-2.5 text-center transition duration-300 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-800"
                >
                    Daftar Sekarang
                </a>
            </div>
        </div>
    );
}

