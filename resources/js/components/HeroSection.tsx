export interface HeroSectionProps {
    title: any;
    description: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
    return (
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <p className="text-xl max-w-2xl mx-auto">{description}</p>
            </div>
        </div>
    );
}
