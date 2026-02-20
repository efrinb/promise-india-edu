import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '1000+',
        label: 'Students Guided',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
    {
        icon: GraduationCap,
        value: '50+',
        label: 'Partner Colleges',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
    },
    {
        icon: TrendingUp,
        value: '95%',
        label: 'Admission Success Rate',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
    },
    {
        icon: Award,
        value: '10+',
        label: 'Years of Experience',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
];

export function Statistics() {
    return (
        <section className="section bg-white dark:bg-gray-800">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Track Record</h2>
                    <p className="text-xl text-text-light max-w-3xl mx-auto">
                        Trusted by thousands of students for nursing college admissions
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="text-center group"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <div className="text-4xl font-bold text-primary dark:text-primary-400 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-text-light dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}