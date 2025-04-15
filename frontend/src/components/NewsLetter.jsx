import React from 'react';

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 space-y-4  max-w-4xl mx-auto">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-800">
                Never Miss a Deal!
            </h1>
            <p className="md:text-lg text-gray-600 pb-6 max-w-lg">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form 
                className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl"
                onSubmit={(e) => e.preventDefault()} // Prevent default form submission
            >
                <input
                    className="flex-grow border border-gray-300 rounded-lg sm:rounded-r-none h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    type="email" // Changed to email type for better validation
                    placeholder="Enter your email address"
                    aria-label="Email address for newsletter subscription"
                    required
                />
                <button 
                    type="submit" 
                    className="h-12 px-6 sm:px-8 text-white bg-primary hover:bg-primary-dark transition-all rounded-lg sm:rounded-l-none font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Subscribe
                </button>
            </form>
            <p className="text-sm text-gray-500 pt-2">
                We respect your privacy. Unsubscribe at any time.
            </p>
        </div>
    )
}

export default NewsLetter;