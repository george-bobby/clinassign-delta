import React from 'react';
import { ArrowRight, Calendar, Clock, Award, Users, MessageCircle } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <header className="py-4 px-6 flex justify-between items-center animate-fade-in">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-clinical-600 w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold">C</span>
                    </div>
                    <span className="font-semibold text-xl text-gray-900">ClinAssign</span>
                </div>

                <div className="space-x-2">
                    <Button variant="ghost" className="text-gray-600" asChild>
                        <Link to="/about">About</Link>
                    </Button>
                    <Button variant="ghost" className="text-gray-600" asChild>
                        <Link to="/contact">Contact</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/register">Register</Link>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Transforming Clinical Practice Management for Nursing Education
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            ClinAssign simplifies the complex world of clinical practice management,
                            helping nursing students and faculty focus on what truly matters:
                            developing exceptional healthcare professionals.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
                            Why ClinAssign?
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {/* Feature 1 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
                                        <p className="text-gray-600">
                                            Automated duty allocation based on year-wise clinical hours, ensuring optimal learning experiences while meeting curriculum requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <Clock className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Leave Compensation</h3>
                                        <p className="text-gray-600">
                                            Intelligent auto-rescheduling of missed duties on holidays, ensuring continuity of clinical education without manual intervention.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <Award className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Tracking</h3>
                                        <p className="text-gray-600">
                                            AI-powered case study grading system that provides objective assessment while offering personalized feedback for improvement.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Role-Based Access</h3>
                                        <p className="text-gray-600">
                                            Dedicated dashboards for Principals, Nursing Heads, Tutors, Hospitals, and Students, with tailored interfaces for each stakeholder.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                                <div className="flex items-start mb-4">
                                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                                        <MessageCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Seamless Communication</h3>
                                        <p className="text-gray-600">
                                            Integrated chat features and AI chatbot for clinical guidance, breaking down barriers between students, faculty, and healthcare facilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center mt-12">
                            <p className="text-xl text-gray-700 mb-6">
                                Experience how ClinAssign is reshaping nursing education through smarter clinical practice management.
                            </p>
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;