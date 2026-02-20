import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const testimonials = [
    {
        name: 'Priya Sharma',
        course: 'BSc Nursing',
        college: 'St. Mary\'s College of Nursing',
        rating: 5,
        text: 'Promise India helped me get admission to my dream nursing college. The counselors were very supportive and guided me through the entire process. Highly recommended!',
    },
    {
        name: 'Rahul Kumar',
        course: 'GNM',
        college: 'Amrita College of Nursing',
        rating: 5,
        text: 'The team at Promise India made my admission journey so smooth. They provided complete transparency about fees and helped me choose the right college for my career.',
    },
    {
        name: 'Ananya Menon',
        course: 'MSc Nursing',
        college: 'Believers Church Medical College',
        rating: 5,
        text: 'I was confused about which nursing college to choose, but Promise India counselors gave me excellent guidance. Now I\'m pursuing my MSc Nursing at a top institution!',
    },
];

export function Testimonials() {
    return (
        <section className="section bg-background dark:bg-gray-900">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
                    <p className="text-xl text-text-light max-w-3xl mx-auto">
                        Real experiences from students we've helped
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                                ))}
                            </div>

                            <p className="text-text-light dark:text-gray-400 mb-6 italic">
                                "{testimonial.text}"
                            </p>

                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <div className="font-semibold text-primary dark:text-primary-400">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-text-light dark:text-gray-400">
                                        {testimonial.course}
                                    </div>
                                    <div className="text-xs text-text-lighter dark:text-gray-500">
                                        {testimonial.college}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}