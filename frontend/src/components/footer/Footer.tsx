const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 py-4 mt-auto">
            <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-400">
                {/* Logo & Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <span className="font-logo text-lg text-gray-300 select-none">algogo</span>
                    <span className="hidden md:block w-px h-3 bg-gray-200"></span>
                    <span>© 2026 Algogo Team. All rights reserved.</span>
                    <span className="hidden md:block w-px h-3 bg-gray-200"></span>
                    <a href="/privacy" className="hover:text-gray-600 transition-colors cursor-pointer">
                        개인정보 처리방침
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
