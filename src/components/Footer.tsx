export default function Footer() {
    return (
        <footer className="bg-black pt-24 pb-12 rounded-t-[3rem] md:rounded-t-[6rem]">
            <div className="container mx-auto px-6 md:px-[8rem]">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-12">
                    {/* Brand Info */}
                    <div className="w-full lg:w-1/3">
                        <h2 className="text-white text-4xl font-bold mb-6">IronStone</h2>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Premium fitness center helping you achieve your body goals with expert guidance and state-of-the-art facilities.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all">
                                <i className="ri-instagram-line text-xl"></i>
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all">
                                <i className="ri-twitter-x-line text-xl"></i>
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all">
                                <i className="ri-facebook-fill text-xl"></i>
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all">
                                <i className="ri-youtube-fill text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="w-full lg:w-2/3 flex flex-wrap justify-between gap-8">
                        {/* Find Club */}
                        <div>
                            <h3 className="text-white font-semibold text-xl mb-6">Find Club</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Locations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Facilities</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Timetable</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Career</a></li>
                            </ul>
                        </div>

                        {/* Plans */}
                        <div>
                            <h3 className="text-white font-semibold text-xl mb-6">Plans</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Membership</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Corporate</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Personal Training</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Gift Cards</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-semibold text-xl mb-6">Support</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Policies</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 IronStone Fitness. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
