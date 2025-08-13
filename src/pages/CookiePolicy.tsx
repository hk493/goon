import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cookie } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center space-x-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <div className="flex items-center space-x-3">
            <Cookie className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">{t('legal.cookies.title')}</h1>
          </div>
        </motion.div>

        {/* Cookie Policy Content */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">最終更新日: 2024年1月1日</p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第1条（クッキーとは）</h2>
            <p className="mb-4">
              クッキー（Cookie）とは、ウェブサイトがお客様のコンピューターに送信する小さなデータファイルです。クッキーは、お客様が当社のウェブサイトを再度訪問された際に、ウェブサイトがお客様のコンピューターから読み取ることができます。
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第2条（クッキーの使用目的）</h2>
            <p className="mb-4">当社では、以下の目的でクッキーを使用しています：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>ウェブサイトの機能を提供するため（必須クッキー）</li>
              <li>お客様の設定や選択を記憶するため（機能性クッキー）</li>
              <li>ウェブサイトの利用状況を分析するため（分析クッキー）</li>
              <li>お客様に関連する広告を表示するため（マーケティングクッキー）</li>
              <li>ウェブサイトのパフォーマンスを向上させるため</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第3条（使用するクッキーの種類）</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">必須クッキー</h3>
            <p className="mb-4">
              これらのクッキーは、ウェブサイトの基本的な機能を提供するために必要です。これらのクッキーを無効にすると、ウェブサイトが正常に機能しない場合があります。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ul className="text-sm space-y-1">
                <li><strong>trippin-session</strong>: セッション管理</li>
                <li><strong>trippin-auth</strong>: 認証状態の保持</li>
                <li><strong>trippin-language</strong>: 言語設定の保存</li>
                <li><strong>trippin-csrf</strong>: セキュリティトークン</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">機能性クッキー</h3>
            <p className="mb-4">
              これらのクッキーは、お客様の設定や選択を記憶し、より良いユーザー体験を提供します。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ul className="text-sm space-y-1">
                <li><strong>trippin-preferences</strong>: ユーザー設定の保存</li>
                <li><strong>trippin-theme</strong>: テーマ設定</li>
                <li><strong>trippin-locale</strong>: 地域設定</li>
                <li><strong>trippin-notifications</strong>: 通知設定</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">分析クッキー</h3>
            <p className="mb-4">
              これらのクッキーは、ウェブサイトの利用状況を分析し、サービスの改善に役立てるために使用されます。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ul className="text-sm space-y-1">
                <li><strong>_ga</strong>: Google Analytics（訪問者の識別）</li>
                <li><strong>_ga_*</strong>: Google Analytics（セッション情報）</li>
                <li><strong>trippin-analytics</strong>: 独自の分析データ</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">マーケティングクッキー</h3>
            <p className="mb-4">
              これらのクッキーは、お客様の興味に基づいた広告を表示するために使用されます。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ul className="text-sm space-y-1">
                <li><strong>trippin-marketing</strong>: マーケティング設定</li>
                <li><strong>trippin-ads</strong>: 広告表示設定</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第4条（第三者クッキー）</h2>
            <p className="mb-4">
              当社のウェブサイトでは、以下の第三者サービスのクッキーも使用されています：
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics</strong>: ウェブサイトの利用状況分析</li>
              <li><strong>Google Maps</strong>: 地図機能の提供</li>
              <li><strong>Stripe</strong>: 決済処理</li>
              <li><strong>Auth0</strong>: 認証サービス</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第5条（クッキーの管理）</h2>
            <p className="mb-4">
              お客様は、ブラウザの設定により、クッキーの受け入れを拒否したり、クッキーを削除したりすることができます。ただし、クッキーを無効にした場合、ウェブサイトの一部機能が利用できなくなる可能性があります。
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">主要ブラウザでのクッキー設定方法</h3>
            <div className="space-y-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Google Chrome</h4>
                <p className="text-sm text-gray-700">設定 → プライバシーとセキュリティ → Cookieと他のサイトデータ</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Mozilla Firefox</h4>
                <p className="text-sm text-gray-700">設定 → プライバシーとセキュリティ → Cookieとサイトデータ</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Safari</h4>
                <p className="text-sm text-gray-700">環境設定 → プライバシー → Cookieとウェブサイトのデータ</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第6条（クッキーポリシーの変更）</h2>
            <p className="mb-4">
              当社は、法令の変更やサービスの改善等により、本ポリシーを変更することがあります。変更後のクッキーポリシーは、当ウェブサイトに掲載した時点から効力を生じるものとします。
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">第7条（お問い合わせ）</h2>
            <p className="mb-4">
              本ポリシーに関するお問い合わせは、以下までご連絡ください：
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">TRIPPIN株式会社</p>
              <p>住所：〒100-0001 東京都千代田区千代田1-1-1</p>
              <p>代表者：代表取締役 山田太郎</p>
              <p>担当部署：プライバシー保護担当</p>
              <p>Eメールアドレス：privacy@trippin.co.jp</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;