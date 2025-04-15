import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8">
      <img src={assets.bottom_banner_image} alt="decorative banner" className="w-full hidden md:block" aria-hidden="true" />
      <img src={assets.bottom_banner_image_sm} alt="decorative banner" className="w-full md:hidden" aria-hidden="true" />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
        <div>
          <h1 className="text-3xl font-bold text-center md:text-right mb-6 capitalize">
            why we're the best
          </h1>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 mb-6 max-w-md">
              <img src={feature.icon} alt={feature.title} className="w-10 h-10" />
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
