import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, Trophy, Calendar } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Transform Your Habits
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Build lasting habits with our intelligent tracking system and AI-powered guidance
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-full transition-colors duration-200"
          >
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-purple-400">
            Features that Drive Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-12 h-12 text-purple-400" />}
              title="Smart Goal Setting"
              description="Set and track meaningful goals with our intelligent system that adapts to your progress"
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-purple-400" />}
              title="AI-Powered Insights"
              description="Get personalized recommendations and insights to help you stay on track"
            />
            <FeatureCard
              icon={<Trophy className="w-12 h-12 text-purple-400" />}
              title="Achievement System"
              description="Earn rewards and track your progress with our gamified achievement system"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already improved their habits
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-full transition-colors duration-200"
          >
            Start Your Journey <Calendar className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-gray-800 p-8 rounded-lg text-center">
    <div className="flex justify-center mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default LandingPage;