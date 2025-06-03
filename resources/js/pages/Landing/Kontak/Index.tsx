import GuestLayout from "@/layouts/guest-layout";
import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function KontakIndex() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [submitStatus, setSubmitStatus] = useState<"success" | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show success message
        setSubmitStatus("success");
        // Reset form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });

        // Reset status after 3 seconds
        setTimeout(() => {
            setSubmitStatus(null);
        }, 3000);
    };

    return (
        <GuestLayout title="Kontak">
            {/* Hero Section */}
            <HeroSection title="Hubungi Kami" description="Kami siap mendengar pertanyaan, saran, dan kebutuhan Anda. Jangan ragu untuk menghubungi kami." />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informasi Kontak</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-orange-100 p-3 rounded-full mr-4">
                                    <MapPin className="text-orange-600 h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Alamat</h3>
                                    <p className="text-gray-600 mt-1">
                                        Jl. May Zen, Kalidoni<br />
                                        Palembang, 10110<br />
                                        Indonesia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-orange-100 p-3 rounded-full mr-4">
                                    <Phone className="text-orange-600 h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Telepon</h3>
                                    <p className="text-gray-600 mt-1">+62 878 0175 1656</p>
                                    <p className="text-gray-600">+62 812 3456 7890</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-orange-100 p-3 rounded-full mr-4">
                                    <Mail className="text-orange-600 h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Email</h3>
                                    <p className="text-gray-600">support@sansstore.id</p>
                                    <p className="text-gray-600 mt-1">infosandemo@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-medium text-gray-800 mb-3">Jam Operasional</h3>
                            <div className="space-y-2 text-gray-600">
                                <p>Senin - Jumat: 08:00 - 17:00</p>
                                <p>Sabtu: 09:00 - 14:00</p>
                                <p>Minggu & Hari Libur: Tutup</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Kirim Pesan</h2>

                        {submitStatus === "success" && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                                    Subjek
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                    Pesan
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center transition duration-150"
                            >
                                Kirim Pesan
                                <Send className="ml-2 h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Temukan Kami</h2>
                    <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
                        {/* Replace with actual map */}
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3248.8091225308613!2d104.43798389662261!3d-3.2452788046878474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3bb7b27496d469%3A0xe9a6ddc39fcbcb98!2sPT.%20Sandemo%20Indo%20Teknologi%20%7C%20Jasa%20Pembuatan%20Website%20Profesional%20Palembang!5e0!3m2!1sid!2sid!4v1747457415531!5m2!1sid!2sid" width="1920" height="390"></iframe>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pertanyaan Umum</h2>

                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <details className="p-4">
                                <summary className="font-medium text-gray-800 cursor-pointer">
                                    Berapa lama waktu respons untuk pesan yang dikirim?
                                </summary>
                                <p className="mt-2 text-gray-600">
                                    Kami berkomitmen untuk merespons semua pesan dalam waktu 1-2 hari kerja. Untuk pertanyaan mendesak,
                                    silakan hubungi kami melalui telepon.
                                </p>
                            </details>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <details className="p-4">
                                <summary className="font-medium text-gray-800 cursor-pointer">
                                    Bagaimana cara menjadwalkan pertemuan dengan tim Anda?
                                </summary>
                                <p className="mt-2 text-gray-600">
                                    Untuk menjadwalkan pertemuan, Anda dapat mengirimkan permintaan melalui formulir kontak ini
                                    atau menghubungi langsung melalui telepon. Tim kami akan mengatur jadwal yang sesuai.
                                </p>
                            </details>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <details className="p-4">
                                <summary className="font-medium text-gray-800 cursor-pointer">
                                    Apakah ada media sosial yang bisa diikuti?
                                </summary>
                                <p className="mt-2 text-gray-600">
                                    Ya, Anda dapat mengikuti kami di platform media sosial seperti Instagram, Twitter, Facebook, dan LinkedIn.
                                    Tautan ke akun media sosial kami dapat ditemukan di footer website.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}