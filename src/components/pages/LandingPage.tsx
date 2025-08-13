import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Smartphone, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import MagicBox from '../components/MagicBox';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStartJourney = () => {
    navigate('/questionnaire/language');
  };

  const handleLanguageSelect = () => {
    navigate('/questionnaire/language');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Videos Loop with Fade Transition */}
      <div className="absolute inset-0">
        <motion.video
          key="video1"
          className="absolute inset-0 object-cover"
          src="social_u7584567376_become_an_egg_and_re-born_as_a_girl_--ar_11_--mot_9454ef9e-ef20-4d73-96e0-f981909c5d61_3.mp4"
          autoPlay
          loop
          muted
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        />
        <motion.video
          key="video2"
          className="absolute inset-0 object-cover"
          src="social_u7584567376__--ar_11_--motion_high_--video_1_--end_httpss.mj._a47ee305-7dc3-4dc3-a338-594840c61672_3.mp4"
          autoPlay
          loop
          muted
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Welcome Text */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t('welcome')}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {t('subtitle')}
          </motion.p>

          {/* Magic Box */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <MagicBox onOpen={handleStartJourney} />
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <motion.div
              key="ai"
              className="bg-transparent backdrop-blur-md rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">AI旅程生成</h3>
              <p className="text-white/80 text-sm">あなたの好みに合わせた完璧な旅程をAIが作成</p>
            </motion.div>

            <motion.div
              key="esim"
              className="bg-transparent backdrop-blur-md rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">eSIMサポート</h3>
              <p className="text-white/80 text-sm">日本全国で使える高速データ通信</p>
            </motion.div>

            <motion.div
              key="booking"
              className="bg-transparent backdrop-blur-md rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">予約サポート</h3>
              <p className="text-white/80 text-sm">ホテル・航空券の予約をサポート</p>
            </motion.div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <p className="text-white text-lg font-medium">{t('pricing')}</p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={handleStartJourney}
            className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 min-w-[160px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <span>{t('startJourney')}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
          TRIPPINで旅をもっと楽しく
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-3 rounded-full text-white">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              あなたの興味に合わせた旅をご提案
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {interests.map((interest, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-3 rounded-full text-white w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    {interest.icon}
                  </div>
                  <p className="font-medium text-gray-800">{interest.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              💎 プレミアム特典
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">柔軟なカスタマイズ</h3>
                <p>同行者・予算に合わせた最適化が可能です</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">eSIMデータ割引</h3>
                <p>通信料金がお得になります</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">予約サポート</h3>
                <p>ホテル・レンタカーの予約をサポート</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">旅の持ち物リスト</h3>
                <p>自動生成された持ち物リストを共有可能</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">AIリアルタイムサポート</h3>
                <p>現地での質問にAIがお答えします</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">翻訳サポート</h3>
                <p>テキスト・チャットベースの翻訳機能</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-2xl font-bold mb-6">月額 2,500円でこれらすべての特典が使い放題！</p>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                今すぐ始める
                <ArrowRightIcon className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}; 

export default LandingPage;
