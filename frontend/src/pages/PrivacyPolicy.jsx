import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const PrivacyPolicy = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="privacy policy visual" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>At Forever, we value the privacy of our users and are committed to protecting any personal information you share with us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our services.</p>
          <p>We collect only the necessary information required to process your orders, improve our services, and personalize your shopping experience. We do not sell or share your personal information with third parties, except as required to fulfill your order or comply with legal obligations.</p>
          <b className='text-gray-800'>Data Security</b>
          <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Your personal and payment information is handled with the utmost care and stored securely.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'YOUR'} text2={'RIGHTS'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Access and Control:</b>
          <p className='text-gray-600'>You have the right to access your personal data and request corrections or deletions at any time.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Opt-Out:</b>
          <p className='text-gray-600'>You can opt out of receiving marketing emails or updates by following the unsubscribe link in our communications.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Policy Updates:</b>
          <p className='text-gray-600'>We may update our Privacy Policy occasionally. Any changes will be communicated clearly and take effect immediately upon posting.</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default PrivacyPolicy;
