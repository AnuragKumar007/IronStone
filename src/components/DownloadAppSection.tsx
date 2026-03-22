export default function ReachUsSection() {
    const mapUrl = "https://maps.google.com/maps?q=Dhanjal+Complex,+551+KA/158,+SBI+Rd,+Om+Nagar,+Chander+Nagar,+Alambagh,+Lucknow,+Uttar+Pradesh+226005";

    return (
        <div className="relative py-18 bg-black">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-lg"></div>

            {/* Glass morphism container */}
            <div className="container mx-auto py-6 px-4 md:px-[10rem] relative z-10">
                <div className="p-8 md:p-12 rounded-3xl bg-black backdrop-blur-xl border-[1px] border-white/10 shadow-none overflow-hidden relative">

                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* Left Column */}
                        <div className="w-full md:w-1/2 z-10">
                            {/* Heading */}
                            <h2 className="text-[2.5rem] md:text-[3.25rem] font-bold text-white mb-8 leading-[3rem] md:leading-[3.6rem]">
                                Reach Us
                            </h2>

                            {/* Points (Address) */}
                            <div className="space-y-4 mb-12">
                                <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default">
                                    <i className="ri-map-pin-2-fill text-2xl text-red-600 mt-1"></i>
                                    <p className="text-md text-white/90 leading-relaxed">
                                        Dhanjal Complex, 551 KA/158, SBI Rd, Om Nagar,<br/>
                                        Chander Nagar, Alambagh, Lucknow,<br/>
                                        Uttar Pradesh 226005
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 hover:translate-x-2 transition-transform cursor-default">
                                    <i className="ri-focus-3-line text-2xl text-red-600"></i>
                                    <p className="text-md text-white/90">RW74+8P Lucknow, Uttar Pradesh</p>
                                </div>
                                <div className="flex items-center gap-4 hover:translate-x-2 transition-transform cursor-default">
                                    <i className="ri-time-line text-2xl text-red-600"></i>
                                    <p className="text-md text-white/90">Open Daily: 5:00 AM - 11:00 PM</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-red-600 rounded-full border border-red-500 hover:bg-red-700 hover:border-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] group">
                                        <i className="ri-direction-fill text-white transition-colors text-2xl"></i>
                                        <span className="text-white font-semibold">Get Directions</span>
                                    </a>
                                    <a href="tel:+910000000000" className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 rounded-full border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm group">
                                        <i className="ri-phone-fill text-white transition-colors text-2xl"></i>
                                        <span className="text-white font-semibold">Contact Us</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Map Interface */}
                        <div className="w-full md:w-1/2 relative flex justify-center items-center mt-12 md:mt-0">
                            {/* Animated Waves */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-110 md:scale-125">
                                <div className="wave-1 absolute w-32 h-32" style={{ border: '4px solid transparent', borderRadius: '50%', background: 'linear-gradient(#000, #000) padding-box, linear-gradient(to bottom right, #ff0000, #990000, #330000) border-box' }}></div>
                                <div className="wave-2 absolute w-32 h-32" style={{ border: '4px solid transparent', borderRadius: '50%', background: 'linear-gradient(#000, #000) padding-box, linear-gradient(to bottom right, #ff0000, #990000, #330000) border-box' }}></div>
                                <div className="wave-3 absolute w-32 h-32" style={{ border: '4px solid transparent', borderRadius: '50%', background: 'linear-gradient(#000, #000) padding-box, linear-gradient(to bottom right, #ff0000, #990000, #330000) border-box' }}></div>
                            </div>

                            {/* Clickable Embedded Map */}
                            <a 
                                href={mapUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="relative z-10 w-full max-w-[22rem] h-[24rem] rounded-3xl overflow-hidden border border-red-900/40 shadow-[0_0_40px_rgba(220,38,38,0.15)] group block transform transition-transform duration-500 hover:scale-[1.02]"
                            >
                                <iframe 
                                    src="https://maps.google.com/maps?q=Dhanjal%20Complex,%20551%20KA/158,%20SBI%20Rd,%20Om%20Nagar,%20Chander%20Nagar,%20Alambagh,%20Lucknow,%20Uttar%20Pradesh%20226005&t=m&z=15&output=embed&iwloc=near" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="pointer-events-none scale-105 group-hover:scale-110 transition-transform duration-700"
                                ></iframe>
                                
                                {/* Overlay to ensure the entire container is clickable and adds a dark tint */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 bg-red-600/90 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <i className="ri-map-pin-user-fill text-xl"></i>
                                        Open in Maps
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
