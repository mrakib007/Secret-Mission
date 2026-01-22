import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
                <div className="bg-white px-2 text-sm rounded rotate-12 absolute mb-12 ml-24 hidden sm:block">
                    Page Not Found
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Lost in Space?
                    </h2>
                    <p className="mt-4 text-gray-500">
                        The page you're looking for doesn't exist or has been moved.
                        Don't worry, even the best missions have unexpected detours.
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/dashboard" className="w-full sm:w-auto">
                        <Button variant="primary" className="w-full" leftIcon={<Home className="h-4 w-4" />}>
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </div>

                <p className="mt-12 text-sm text-gray-400">
                    If you believe this is a technical error, please contact the mission control.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
