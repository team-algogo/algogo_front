import { BookOpen, CheckCircle } from 'lucide-react';
import TextLink from '@components/textLink/TextLink';

export function ProblemSetFeatureSection() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-4">
                            맞춤형 문제집
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            목표 달성에 최적화된<br />
                            <span className="text-green-600">엄선된 문제 리스트</span>
                        </h2>
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                            삼성, 카카오 등 기업별 기출 문제부터 알고리즘 기초까지.<br />
                            검증된 문제집으로 효율적인 학습 로드맵을 제공합니다.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shadow-sm">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">체계적인 커리큘럼</h4>
                                    <p className="text-gray-600 text-sm">난이도별, 유형별로 정리된 문제집을 제공합니다</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">학습 진척도 관리</h4>
                                    <p className="text-gray-600 text-sm">푼 문제를 자동으로 체크하고 진행률을 보여줍니다</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <TextLink
                                src="/login"
                                variant="default"
                                className="px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                로그인하고 문제집 보기
                            </TextLink>
                        </div>
                    </div>

                    {/* Right: Mockup with Blur */}
                    <div className="relative order-1 lg:order-2">
                        {/* Mock Container */}
                        <div className="relative rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-2xl overflow-hidden">
                            {/* Blur Overlay & Login CTA */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                                <span className="bg-gray-900/80 text-white px-4 py-2 rounded-full text-sm font-medium mb-2 backdrop-blur-md shadow-lg">
                                    로그인이 필요한 기능입니다
                                </span>
                                <TextLink
                                    src="/login"
                                    className="text-gray-900 font-bold hover:text-green-600 transition-colors bg-white/80 px-4 py-2 rounded-lg shadow-sm"
                                >
                                    지금 시작하기 →
                                </TextLink>
                            </div>

                            {/* Mock Content (Blurred Background) */}
                            <div className="space-y-4 opacity-70 pointer-events-none select-none filter blur-[2px]">
                                {/* Mock Item 1 */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-6 w-16 bg-green-50 rounded-md"></div>
                                    </div>
                                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="h-6 w-12 bg-gray-100 rounded px-2"></div>
                                        <div className="h-6 w-12 bg-gray-100 rounded px-2"></div>
                                    </div>
                                </div>

                                {/* Mock Item 2 */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                                        <div className="h-6 w-16 bg-blue-50 rounded-md"></div>
                                    </div>
                                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="h-6 w-16 bg-gray-100 rounded"></div>
                                    </div>
                                </div>

                                {/* Mock Item 3 (Cut off) */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 opacity-50">
                                    <div className="flex items-center justify-between">
                                        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400 rounded-full opacity-20 blur-3xl -z-10" />
                        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
