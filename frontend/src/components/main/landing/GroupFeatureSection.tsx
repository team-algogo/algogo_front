import { Users, Settings, Zap } from 'lucide-react';

export function GroupFeatureSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4">
                            그룹 스터디
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            친구들과 함께하는<br />
                            <span className="text-blue-600">커스텀 그룹방</span>
                        </h2>
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                            팀원들과 함께 문제를 선정하고, 같은 목표를 향해 달려가세요.
                            그룹 내에서 자동으로 매칭되어 서로의 코드를 리뷰할 수 있습니다.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">그룹원 관리</h4>
                                    <p className="text-gray-600 text-sm">친구들을 초대하고 함께 스터디를 진행하세요</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Settings className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">커스텀 문제집</h4>
                                    <p className="text-gray-600 text-sm">그룹만의 문제집을 만들어 체계적으로 학습하세요</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Zap className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">실시간 매칭</h4>
                                    <p className="text-gray-600 text-sm">그룹 내에서 자동으로 리뷰 파트너를 매칭해드립니다</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    G
                                </div>
                                <div>
                                    <h4 className="font-bold">알고리즘 마스터즈</h4>
                                    <p className="text-gray-500 text-sm">멤버 12명 · 활성</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">이번 주 문제</span>
                                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">진행중</span>
                                    </div>
                                    <p className="text-sm text-gray-600">두 개 뽑아서 더하기</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                            >
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <span>8명이 문제를 제출했습니다</span>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">리뷰 진행률</span>
                                        <span className="font-semibold">75%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
