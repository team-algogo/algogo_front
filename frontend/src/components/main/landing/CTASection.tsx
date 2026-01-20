import { ArrowRight, Gift } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
                        <Gift className="w-4 h-4" />
                        <span className="font-semibold text-sm">얼리버드 혜택</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        지금 시작하세요
                    </h2>
                    <p className="text-lg mb-8 text-blue-100">
                        막 출시한 신규 서비스! 얼리버드로 참여하고 특별한 혜택을 받아보세요
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <button className="w-full sm:w-auto bg-white text-blue-700 px-6 py-3 rounded-lg font-bold text-base hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2">
                            무료로 시작하기
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                        <div>
                            <div className="text-2xl font-bold mb-2">🎁</div>
                            <h3 className="font-bold mb-1">프리미엄 기능 무료</h3>
                            <p className="text-blue-100 text-xs">초기 사용자 한정 모든 기능 무료 제공</p>
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-2">⭐</div>
                            <h3 className="font-bold mb-1">얼리버드 배지</h3>
                            <p className="text-blue-100 text-xs">초기 멤버만의 특별한 배지 획득</p>
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-2">🚀</div>
                            <h3 className="font-bold mb-1">우선 지원</h3>
                            <p className="text-blue-100 text-xs">신규 기능 우선 체험 기회</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
