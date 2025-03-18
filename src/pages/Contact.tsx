import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
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

            {/* Contact Information Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
                            Reach Out To Us
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {/* Contact Method 1 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <Mail className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                                        <p className="text-gray-600">
                                            Send us your inquiries and we'll respond within 24 hours.
                                        </p>
                                        <a href="mailto:support@clinassign.com" className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block">
                                            support@clinassign.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Method 2 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <Phone className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                                        <p className="text-gray-600">
                                            Speak directly with our customer support team for immediate assistance.
                                        </p>
                                        <a href="tel:+18005551234" className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block">
                                            +1 (800) 555-1234
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Method 3 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <MapPin className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                                        <p className="text-gray-600">
                                            Schedule an in-person demonstration at our headquarters.
                                        </p>
                                        <address className="text-gray-700 mt-2 not-italic">
                                            123 Innovation Way<br />
                                            Suite 400<br />
                                            San Francisco, CA 94107
                                        </address>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Method 4 */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                        <Clock className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Hours</h3>
                                        <p className="text-gray-600">
                                            Our support team is available during the following hours:
                                        </p>
                                        <ul className="text-gray-700 mt-2 space-y-1">
                                            <li>Monday - Friday: 8:00 AM - 8:00 PM EST</li>
                                            <li>Saturday: 9:00 AM - 5:00 PM EST</li>
                                            <li>Sunday: Closed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 mt-12">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors">
                                        Send Message <Send className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center mt-12">
                            <p className="text-xl text-gray-700 mb-6">
                                Ready to transform your nursing education program with ClinAssign?
                            </p>
                            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors">
                                Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default ContactPage;