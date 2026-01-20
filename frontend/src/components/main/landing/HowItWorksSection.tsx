export function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: '문제 선택',
            description: '기업 대비, 자격증, 알고리즘 등 목적에 맞는 문제집에서 원하는 문제를 선택하세요.',
            visual: (
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h4 className="font-bold text-lg">문제집</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">500+ 문제</span>
                    </div>
                    <div className="space-y-3">
                        {['기업 코딩테스트 대비', '알고리즘 기초', 'SQL 자격증 준비'].map((item, i) => (
                            <div key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{item}</div>
                                            <div className="text-xs text-gray-500">{30 + i * 10}개 문제</div>
                                        </div>
                                    </div>
                                    <div className="text-blue-600">→</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            number: '02',
            title: '문제 풀이',
            description: '선택한 문제를 풀고 자신만의 코드를 작성하여 제출합니다.',
            visual: (
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-400 text-sm">solution.js</span>
                    </div>
                    <div className="p-6 font-mono text-sm">
                        <div className="text-purple-400">function <span className="text-yellow-300">solution</span>(arr) {'{'}</div>
                        <div className="text-gray-400 ml-4">// 문제를 풀어보세요</div>
                        <div className="ml-4 text-blue-400">let <span className="text-white">result</span> = [];</div>
                        <div className="ml-4 text-blue-400">for <span className="text-white">(let i = 0; i &lt; arr.length; i++) {'{'}</span></div>
                        <div className="ml-8 text-green-400">result.push(arr[i] * 2);</div>
                        <div className="ml-4 text-white">{'}'}</div>
                        <div className="ml-4 text-purple-400">return <span className="text-white">result</span>;</div>
                        <div className="text-purple-400">{'}'}</div>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-sans font-semibold hover:bg-blue-700">
                                코드 제출
                            </button>
                        </div>
                    </div>
                </div>
            )
        },
        {
            number: '03',
            title: '자동 매칭',
            description: '같은 문제를 푼 다른 개발자와 자동으로 매칭됩니다. 서로의 코드를 리뷰할 파트너를 찾아드려요.',
            visual: (
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 animate-pulse">
                            <span className="text-3xl">🤝</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">매칭 중...</h4>
                        <p className="text-sm text-gray-500">같은 문제를 푼 개발자를 찾고 있습니다</p>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    A
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">김개발</div>
                                    <div className="text-xs text-gray-600">Python · 실력 유사</div>
                                </div>
                                <div className="text-green-600 text-sm font-semibold">매칭 완료!</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            number: '04',
            title: '코드 리뷰',
            description: '서로의 코드를 리뷰하며 다양한 접근법을 배우고 함께 성장합니다.',
            visual: (
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                김
                            </div>
                            <span className="font-semibold">김개발님의 코드</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">리뷰 완료</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                        <div className="text-gray-600">arr.map(x =&gt; x * 2)</div>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-3">
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                                    나
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">map을 사용하니 훨씬 간결하네요! 배열 메서드 활용 잘 배웠습니다 👍</p>
                                    <span className="text-xs text-gray-500 mt-1 inline-block">방금 전</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        어떻게 작동하나요?
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        간단한 4단계로 코드 리뷰 파트너를 만나보세요
                    </p>
                </div>

                <div className="space-y-20">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                {step.visual}
                                <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-2xl -z-10" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full opacity-10 blur-2xl -z-10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
