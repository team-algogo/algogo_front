import { Users, BookOpen, Shuffle, Trophy } from 'lucide-react';

export function FeatureSection() {
    const features = [
        {
            icon: Users,
            title: '그룹별 커스텀 방',
            description: '팀원들과 함께 선정한 문제로 효율적인 스터디를 진행하세요',
            color: 'text-blue-600'
        },
        {
            icon: Shuffle,
            title: '스마트 매칭 시스템',
            description: '실력이 비슷한 개발자끼리 랜덤으로 매칭하여 서로 코드 리뷰를 진행합니다',
            color: 'text-purple-600'
        },
        {
            icon: BookOpen,
            title: '맞춤형 문제집',
            description: '기업 대비, 자격증 준비, 알고리즘 학습 등 목적에 맞는 문제집을 제공합니다',
            color: 'text-green-600'
        },
        {
            icon: Trophy,
            title: '함께 성장하기',
            description: '코드 리뷰를 통해 다양한 접근법을 배우고 실력을 향상시키세요',
            color: 'text-orange-600'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        핵심 기능
                    </h2>
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        코드 리뷰를 통해 함께 성장하는 플랫폼
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-5 rounded-xl"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4 ${feature.color}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
