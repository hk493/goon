import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, Type, Volume2, Copy, RotateCcw, Languages, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCall, API_CONFIG, APIError } from '../config/api';
import { handleAWSError, globalErrorHandler } from '../utils/errorHandler';
import ImageUpload from '../components/ImageUpload';
import { OptimizedImage } from '../utils/imageOptimizer';
import SEOHead from '../components/SEOHead';

const TranslationTool: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'text' | 'camera' | 'voice'>('text');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // Multilingual content
  const getLocalizedContent = () => {
    switch (currentLanguage) {
      case 'en':
        return {
          title: 'Translation Tool',
          subtitle: 'Break language barriers with real-time translation',
          backToDashboard: 'Back to Dashboard',
          textMode: 'Text',
          cameraMode: 'Camera',
          voiceMode: 'Voice',
          input: 'Input',
          output: 'Translation Result',
          translate: 'Translate',
          translating: 'Translating...',
          swapLanguages: 'Swap Languages',
          copyText: 'Copy Text',
          speakText: 'Speak Text',
          commonPhrases: 'Common Phrases',
          uploadAndTranslate: 'Upload & Translate Photo',
          dragAndDrop: 'Drag & drop an image',
          orClickToUpload: 'or click to upload',
          removeImage: 'Remove Image',
          processingImage: 'Processing image...',
          optimizationInfo: 'compressed',
          imageOptimized: 'Image optimized',
          greetings: 'Greetings',
          directions: 'Directions',
          shopping: 'Shopping',
          dining: 'Dining',
          emergency: 'Emergency'
        };
      case 'zh':
        return {
          title: '翻译工具',
          subtitle: '实时翻译打破语言障碍',
          backToDashboard: '返回仪表板',
          textMode: '文本',
          cameraMode: '相机',
          voiceMode: '语音',
          input: '输入',
          output: '翻译结果',
          translate: '翻译',
          translating: '翻译中...',
          swapLanguages: '交换语言',
          copyText: '复制文本',
          speakText: '朗读文本',
          commonPhrases: '常用短语',
          uploadAndTranslate: '上传并翻译照片',
          dragAndDrop: '拖放图片',
          orClickToUpload: '或点击上传',
          removeImage: '删除图片',
          processingImage: '处理图片中...',
          optimizationInfo: '已压缩',
          imageOptimized: '图片已优化',
          greetings: '问候语',
          directions: '方向指引',
          shopping: '购物',
          dining: '用餐',
          emergency: '紧急情况'
        };
      case 'ko':
        return {
          title: '번역 도구',
          subtitle: '실시간 번역으로 언어 장벽을 넘어서세요',
          backToDashboard: '대시보드로 돌아가기',
          textMode: '텍스트',
          cameraMode: '카메라',
          voiceMode: '음성',
          input: '입력',
          output: '번역 결과',
          translate: '번역',
          translating: '번역 중...',
          swapLanguages: '언어 교체',
          copyText: '텍스트 복사',
          speakText: '텍스트 읽기',
          commonPhrases: '자주 사용하는 문구',
          uploadAndTranslate: '사진 업로드 및 번역',
          dragAndDrop: '이미지를 드래그 앤 드롭',
          orClickToUpload: '또는 클릭하여 업로드',
          removeImage: '이미지 제거',
          processingImage: '이미지 처리 중...',
          optimizationInfo: '압축됨',
          imageOptimized: '이미지 최적화됨',
          greetings: '인사말',
          directions: '길 안내',
          shopping: '쇼핑',
          dining: '식사',
          emergency: '응급상황'
        };
      case 'es':
        return {
          title: 'Herramienta de Traducción',
          subtitle: 'Rompe las barreras del idioma con traducción en tiempo real',
          backToDashboard: 'Volver al Panel',
          textMode: 'Texto',
          cameraMode: 'Cámara',
          voiceMode: 'Voz',
          input: 'Entrada',
          output: 'Resultado de Traducción',
          translate: 'Traducir',
          translating: 'Traduciendo...',
          swapLanguages: 'Intercambiar Idiomas',
          copyText: 'Copiar Texto',
          speakText: 'Leer Texto',
          commonPhrases: 'Frases Comunes',
          uploadAndTranslate: 'Subir y Traducir Foto',
          dragAndDrop: 'Arrastra y suelta una imagen',
          orClickToUpload: 'o haz clic para subir',
          removeImage: 'Eliminar Imagen',
          processingImage: 'Procesando imagen...',
          optimizationInfo: 'comprimido',
          imageOptimized: 'Imagen optimizada',
          greetings: 'Saludos',
          directions: 'Direcciones',
          shopping: 'Compras',
          dining: 'Comida',
          emergency: 'Emergencia'
        };
      case 'fr':
        return {
          title: 'Outil de Traduction',
          subtitle: 'Brisez les barrières linguistiques avec la traduction en temps réel',
          backToDashboard: 'Retour au Tableau de Bord',
          textMode: 'Texte',
          cameraMode: 'Caméra',
          voiceMode: 'Voix',
          input: 'Entrée',
          output: 'Résultat de Traduction',
          translate: 'Traduire',
          translating: 'Traduction...',
          swapLanguages: 'Échanger les Langues',
          copyText: 'Copier le Texte',
          speakText: 'Lire le Texte',
          commonPhrases: 'Phrases Courantes',
          uploadAndTranslate: 'Télécharger et Traduire Photo',
          dragAndDrop: 'Glissez et déposez une image',
          orClickToUpload: 'ou cliquez pour télécharger',
          removeImage: 'Supprimer l\'Image',
          processingImage: 'Traitement de l\'image...',
          optimizationInfo: 'compressé',
          imageOptimized: 'Image optimisée',
          greetings: 'Salutations',
          directions: 'Directions',
          shopping: 'Shopping',
          dining: 'Restauration',
          emergency: 'Urgence'
        };
      case 'hi':
        return {
          title: 'अनुवाद उपकरण',
          subtitle: 'रीयल-टाइम अनुवाद के साथ भाषा की बाधाओं को तोड़ें',
          backToDashboard: 'डैशबोर्ड पर वापस जाएं',
          textMode: 'टेक्स्ट',
          cameraMode: 'कैमरा',
          voiceMode: 'आवाज',
          input: 'इनपुट',
          output: 'अनुवाद परिणाम',
          translate: 'अनुवाद करें',
          translating: 'अनुवाद हो रहा है...',
          swapLanguages: 'भाषाएं बदलें',
          copyText: 'टेक्स्ट कॉपी करें',
          speakText: 'टेक्स्ट बोलें',
          commonPhrases: 'सामान्य वाक्य',
          uploadAndTranslate: 'फोटो अपलोड और अनुवाद करें',
          dragAndDrop: 'एक छवि खींचें और छोड़ें',
          orClickToUpload: 'या अपलोड करने के लिए क्लिक करें',
          removeImage: 'छवि हटाएं',
          processingImage: 'छवि प्रसंस्करण...',
          optimizationInfo: 'संपीड़ित',
          imageOptimized: 'छवि अनुकूलित',
          greetings: 'अभिवादन',
          directions: 'दिशा-निर्देश',
          shopping: 'खरीदारी',
          dining: 'भोजन',
          emergency: 'आपातकाल'
        };
      case 'ru':
        return {
          title: 'Инструмент Перевода',
          subtitle: 'Преодолейте языковые барьеры с переводом в реальном времени',
          backToDashboard: 'Вернуться к Панели',
          textMode: 'Текст',
          cameraMode: 'Камера',
          voiceMode: 'Голос',
          input: 'Ввод',
          output: 'Результат Перевода',
          translate: 'Перевести',
          translating: 'Перевод...',
          swapLanguages: 'Поменять Языки',
          copyText: 'Копировать Текст',
          speakText: 'Произнести Текст',
          commonPhrases: 'Общие Фразы',
          uploadAndTranslate: 'Загрузить и Перевести Фото',
          dragAndDrop: 'Перетащите изображение',
          orClickToUpload: 'или нажмите для загрузки',
          removeImage: 'Удалить Изображение',
          processingImage: 'Обработка изображения...',
          optimizationInfo: 'сжато',
          imageOptimized: 'Изображение оптимизировано',
          greetings: 'Приветствия',
          directions: 'Направления',
          shopping: 'Покупки',
          dining: 'Питание',
          emergency: 'Экстренная ситуация'
        };
      case 'ar':
        return {
          title: 'أداة الترجمة',
          subtitle: 'كسر حواجز اللغة مع الترجمة في الوقت الفعلي',
          backToDashboard: 'العودة إلى لوحة التحكم',
          textMode: 'نص',
          cameraMode: 'كاميرا',
          voiceMode: 'صوت',
          input: 'إدخال',
          output: 'نتيجة الترجمة',
          translate: 'ترجم',
          translating: 'جاري الترجمة...',
          swapLanguages: 'تبديل اللغات',
          copyText: 'نسخ النص',
          speakText: 'قراءة النص',
          commonPhrases: 'العبارات الشائعة',
          uploadAndTranslate: 'رفع وترجمة الصورة',
          dragAndDrop: 'اسحب وأفلت صورة',
          orClickToUpload: 'أو انقر للرفع',
          removeImage: 'إزالة الصورة',
          processingImage: 'معالجة الصورة...',
          optimizationInfo: 'مضغوط',
          imageOptimized: 'تم تحسين الصورة',
          greetings: 'التحيات',
          directions: 'الاتجاهات',
          shopping: 'التسوق',
          dining: 'تناول الطعام',
          emergency: 'الطوارئ'
        };
      case 'id':
        return {
          title: 'Alat Terjemahan',
          subtitle: 'Atasi hambatan bahasa dengan terjemahan real-time',
          backToDashboard: 'Kembali ke Dashboard',
          textMode: 'Teks',
          cameraMode: 'Kamera',
          voiceMode: 'Suara',
          input: 'Input',
          output: 'Hasil Terjemahan',
          translate: 'Terjemahkan',
          translating: 'Menerjemahkan...',
          swapLanguages: 'Tukar Bahasa',
          copyText: 'Salin Teks',
          speakText: 'Ucapkan Teks',
          commonPhrases: 'Frasa Umum',
          uploadAndTranslate: 'Unggah & Terjemahkan Foto',
          dragAndDrop: 'Seret dan lepas gambar',
          orClickToUpload: 'atau klik untuk unggah',
          removeImage: 'Hapus Gambar',
          processingImage: 'Memproses gambar...',
          optimizationInfo: 'terkompresi',
          imageOptimized: 'Gambar dioptimalkan',
          greetings: 'Salam',
          directions: 'Petunjuk Arah',
          shopping: 'Belanja',
          dining: 'Makan',
          emergency: 'Darurat'
        };
      case 'pt':
        return {
          title: 'Ferramenta de Tradução',
          subtitle: 'Quebre barreiras linguísticas com tradução em tempo real',
          backToDashboard: 'Voltar ao Painel',
          textMode: 'Texto',
          cameraMode: 'Câmera',
          voiceMode: 'Voz',
          input: 'Entrada',
          output: 'Resultado da Tradução',
          translate: 'Traduzir',
          translating: 'Traduzindo...',
          swapLanguages: 'Trocar Idiomas',
          copyText: 'Copiar Texto',
          speakText: 'Falar Texto',
          commonPhrases: 'Frases Comuns',
          uploadAndTranslate: 'Enviar e Traduzir Foto',
          dragAndDrop: 'Arraste e solte uma imagem',
          orClickToUpload: 'ou clique para enviar',
          removeImage: 'Remover Imagem',
          processingImage: 'Processando imagem...',
          optimizationInfo: 'comprimido',
          imageOptimized: 'Imagem otimizada',
          greetings: 'Cumprimentos',
          directions: 'Direções',
          shopping: 'Compras',
          dining: 'Jantar',
          emergency: 'Emergência'
        };
      case 'th':
        return {
          title: 'เครื่องมือแปลภาษา',
          subtitle: 'ทำลายอุปสรรคทางภาษาด้วยการแปลแบบเรียลไทม์',
          backToDashboard: 'กลับสู่แดชบอร์ด',
          textMode: 'ข้อความ',
          cameraMode: 'กล้อง',
          voiceMode: 'เสียง',
          input: 'ป้อนข้อมูล',
          output: 'ผลการแปล',
          translate: 'แปล',
          translating: 'กำลังแปล...',
          swapLanguages: 'สลับภาษา',
          copyText: 'คัดลอกข้อความ',
          speakText: 'อ่านข้อความ',
          commonPhrases: 'วลีที่ใช้บ่อย',
          uploadAndTranslate: 'อัปโหลดและแปลภาพ',
          dragAndDrop: 'ลากและวางรูปภาพ',
          orClickToUpload: 'หรือคลิกเพื่ออัปโหลด',
          removeImage: 'ลบรูปภาพ',
          processingImage: 'กำลังประมวลผลภาพ...',
          optimizationInfo: 'บีบอัด',
          imageOptimized: 'ภาพได้รับการปรับปรุง',
          greetings: 'การทักทาย',
          directions: 'ทิศทาง',
          shopping: 'ช้อปปิ้ง',
          dining: 'การรับประทานอาหาร',
          emergency: 'ฉุกเฉิน'
        };
      case 'vi':
        return {
          title: 'Công Cụ Dịch Thuật',
          subtitle: 'Phá vỡ rào cản ngôn ngữ với dịch thuật thời gian thực',
          backToDashboard: 'Quay Lại Bảng Điều Khiển',
          textMode: 'Văn Bản',
          cameraMode: 'Camera',
          voiceMode: 'Giọng Nói',
          input: 'Đầu Vào',
          output: 'Kết Quả Dịch',
          translate: 'Dịch',
          translating: 'Đang dịch...',
          swapLanguages: 'Hoán Đổi Ngôn Ngữ',
          copyText: 'Sao Chép Văn Bản',
          speakText: 'Đọc Văn Bản',
          commonPhrases: 'Cụm Từ Thông Dụng',
          uploadAndTranslate: 'Tải Lên và Dịch Ảnh',
          dragAndDrop: 'Kéo và thả hình ảnh',
          orClickToUpload: 'hoặc nhấp để tải lên',
          removeImage: 'Xóa Hình Ảnh',
          processingImage: 'Đang xử lý hình ảnh...',
          optimizationInfo: 'đã nén',
          imageOptimized: 'Hình ảnh đã được tối ưu',
          greetings: 'Lời Chào',
          directions: 'Hướng Dẫn',
          shopping: 'Mua Sắm',
          dining: 'Ăn Uống',
          emergency: 'Khẩn Cấp'
        };
      case 'it':
        return {
          title: 'Strumento di Traduzione',
          subtitle: 'Abbatti le barriere linguistiche con la traduzione in tempo reale',
          backToDashboard: 'Torna al Pannello',
          textMode: 'Testo',
          cameraMode: 'Fotocamera',
          voiceMode: 'Voce',
          input: 'Input',
          output: 'Risultato Traduzione',
          translate: 'Traduci',
          translating: 'Traduzione...',
          swapLanguages: 'Scambia Lingue',
          copyText: 'Copia Testo',
          speakText: 'Leggi Testo',
          commonPhrases: 'Frasi Comuni',
          uploadAndTranslate: 'Carica e Traduci Foto',
          dragAndDrop: 'Trascina e rilascia un\'immagine',
          orClickToUpload: 'o clicca per caricare',
          removeImage: 'Rimuovi Immagine',
          processingImage: 'Elaborazione immagine...',
          optimizationInfo: 'compresso',
          imageOptimized: 'Immagine ottimizzata',
          greetings: 'Saluti',
          directions: 'Direzioni',
          shopping: 'Shopping',
          dining: 'Ristorazione',
          emergency: 'Emergenza'
        };
      default: // Japanese
        return {
          title: '翻訳ツール',
          subtitle: 'リアルタイム翻訳で言語の壁を越えよう',
          backToDashboard: 'ダッシュボードに戻る',
          textMode: 'テキスト',
          cameraMode: 'カメラ',
          voiceMode: '音声',
          input: '入力',
          output: '翻訳結果',
          translate: '翻訳',
          translating: '翻訳中...',
          swapLanguages: '言語を入れ替え',
          copyText: 'テキストをコピー',
          speakText: 'テキストを読み上げ',
          commonPhrases: 'よく使うフレーズ',
          uploadAndTranslate: '写真をアップロード・翻訳',
          dragAndDrop: '画像をドラッグ&ドロップ',
          orClickToUpload: 'またはクリックしてアップロード',
          removeImage: '画像を削除',
          processingImage: '画像を処理中...',
          optimizationInfo: '圧縮済み',
          imageOptimized: '画像を最適化しました',
          greetings: '挨拶',
          directions: '道案内',
          shopping: '買い物',
          dining: '食事',
          emergency: '緊急時'
        };
    }
  };
  
  const content = getLocalizedContent();
  
  const languages = [
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  useEffect(() => {
    // Check if camera mode is requested via URL parameter
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'camera') {
      setActiveMode('camera');
    }
  }, [location]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    // Save to localStorage for history
    const translationHistory = JSON.parse(localStorage.getItem('trippin-translation-history') || '[]');
    translationHistory.unshift({
      id: `trans_${Date.now()}`,
      source: inputText,
      sourceLang,
      targetLang,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trippin-translation-history', JSON.stringify(
      translationHistory.slice(0, 10) // Keep only the 10 most recent translations
    ));
    
    setIsTranslating(true);
    try {
      const result = await apiCall('/openai-chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: `Translate this text from ${sourceLang} to ${targetLang}: ${inputText}`,
          language: targetLang,
          context: 'translation'
        })
      });

      console.log('[TranslationTool] OpenAI API response:', result);
      
      if (result.success && result.response && typeof result.response === 'string' && result.response.trim()) {
        setTranslatedText(result.response);
      } else {
        console.warn('[TranslationTool] Invalid translation response:', result);
        throw new Error(result.message || '翻訳に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      globalErrorHandler.handleError(apiError, {
        page: 'TranslationTool',
        action: 'textTranslation',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      console.error('Translation failed:', apiError);
      
      const errorInfo = handleAWSError(apiError);
      if (apiError.code === 'RATE_LIMITED') {
        setTranslatedText('翻訳サービスが混雑しています。しばらく待ってからお試しください。');
      } else if (apiError.code === 'NETWORK_OFFLINE') {
        setTranslatedText('インターネット接続がありません。接続を確認してください。');
      } else {
        setTranslatedText(errorInfo.message || '翻訳エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCameraTranslation = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Process image with OpenAI
      processImageWithOpenAI(file);
    }
  };

  const processImageWithOpenAI = async (file: File) => {
    setIsProcessingImage(true);
    setIsTranslating(true);
    
    try {
      // Use optimized image if available, otherwise original
      const imageToProcess = optimizedImage?.file || file;
      const base64Image = await fileToBase64(imageToProcess);
      
      const result = await apiCall('/openai-vision', {
        method: 'POST',
        body: JSON.stringify({
          image: base64Image,
          targetLanguage: targetLang,
          sourceLanguage: sourceLang
        })
      });
      
      console.log('[TranslationTool] Image translation API response:', result);
      
      if (result.success && result.translation && typeof result.translation === 'string' && result.translation.trim()) {
        setTranslatedText(result.translation);
      } else {
        console.warn('[TranslationTool] Invalid image translation response:', result);
        throw new Error(result.message || '画像翻訳に失敗しました');
      }
    } catch (error) {
      const apiError = error as APIError;
      
      globalErrorHandler.handleError(apiError, {
        page: 'TranslationTool',
        action: 'imageTranslation',
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      console.error('Image processing error:', apiError);
      
      const errorInfo = handleAWSError(apiError);
      if (apiError.status === 413) {
        setTranslatedText('画像ファイルが大きすぎます。より小さな画像をお試しください。');
      } else if (apiError.status === 415) {
        setTranslatedText('サポートされていない画像形式です。JPEG、PNG、GIFをお試しください。');
      } else {
        setTranslatedText(errorInfo.message || '画像処理エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setIsProcessingImage(false);
      setIsTranslating(false);
    }
  };
  
  const handleOptimizedImageSelect = (optimized: OptimizedImage) => {
    setOptimizedImage(optimized);
    setImageFile(optimized.file);
    setImagePreview(optimized.dataUrl);
    
    // Automatically process the optimized image
    processImageWithOpenAI(optimized.file);
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  const handleVoiceTranslation = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        setInputText('音声認識されたテキスト');
        setTranslatedText('Voice translation result');
      }, 3000);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  // Multilingual common phrases
  const getCommonPhrases = () => {
    switch (currentLanguage) {
      case 'en':
        return [
          { source: 'Hello', target: 'こんにちは', category: 'greetings' },
          { source: 'Thank you', target: 'ありがとうございます', category: 'greetings' },
          { source: 'Excuse me', target: 'すみません', category: 'greetings' },
          { source: 'Where is the bathroom?', target: 'トイレはどこですか？', category: 'directions' },
          { source: 'Where is the station?', target: '駅はどこですか？', category: 'directions' },
          { source: 'How much is it?', target: 'いくらですか？', category: 'shopping' },
          { source: 'I would like this', target: 'これをください', category: 'shopping' },
          { source: 'Please show me the menu', target: 'メニューを見せてください', category: 'dining' },
          { source: 'Check, please', target: 'お会計をお願いします', category: 'dining' },
          { source: 'Please help me', target: '助けてください', category: 'emergency' },
          { source: 'Where is the hospital?', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'zh':
        return [
          { source: '你好', target: 'こんにちは', category: 'greetings' },
          { source: '谢谢', target: 'ありがとうございます', category: 'greetings' },
          { source: '不好意思', target: 'すみません', category: 'greetings' },
          { source: '厕所在哪里？', target: 'トイレはどこですか？', category: 'directions' },
          { source: '车站在哪里？', target: '駅はどこですか？', category: 'directions' },
          { source: '多少钱？', target: 'いくらですか？', category: 'shopping' },
          { source: '我要这个', target: 'これをください', category: 'shopping' },
          { source: '请给我看菜单', target: 'メニューを見せてください', category: 'dining' },
          { source: '请结账', target: 'お会計をお願いします', category: 'dining' },
          { source: '请帮助我', target: '助けてください', category: 'emergency' },
          { source: '医院在哪里？', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'ko':
        return [
          { source: '안녕하세요', target: 'こんにちは', category: 'greetings' },
          { source: '감사합니다', target: 'ありがとうございます', category: 'greetings' },
          { source: '죄송합니다', target: 'すみません', category: 'greetings' },
          { source: '화장실이 어디에 있나요？', target: 'トイレはどこですか？', category: 'directions' },
          { source: '역이 어디에 있나요？', target: '駅はどこですか？', category: 'directions' },
          { source: '얼마예요？', target: 'いくらですか？', category: 'shopping' },
          { source: '이것을 주세요', target: 'これをください', category: 'shopping' },
          { source: '메뉴를 보여주세요', target: 'メニューを見せてください', category: 'dining' },
          { source: '계산해 주세요', target: 'お会計をお願いします', category: 'dining' },
          { source: '도와주세요', target: '助けてください', category: 'emergency' },
          { source: '병원이 어디에 있나요？', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'es':
        return [
          { source: 'Hola', target: 'こんにちは', category: 'greetings' },
          { source: 'Gracias', target: 'ありがとうございます', category: 'greetings' },
          { source: 'Disculpe', target: 'すみません', category: 'greetings' },
          { source: '¿Dónde está el baño?', target: 'トイレはどこですか？', category: 'directions' },
          { source: '¿Dónde está la estación?', target: '駅はどこですか？', category: 'directions' },
          { source: '¿Cuánto cuesta?', target: 'いくらですか？', category: 'shopping' },
          { source: 'Quiero esto', target: 'これをください', category: 'shopping' },
          { source: 'Por favor muéstreme el menú', target: 'メニューを見せてください', category: 'dining' },
          { source: 'La cuenta, por favor', target: 'お会計をお願いします', category: 'dining' },
          { source: 'Por favor ayúdeme', target: '助けてください', category: 'emergency' },
          { source: '¿Dónde está el hospital?', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'fr':
        return [
          { source: 'Bonjour', target: 'こんにちは', category: 'greetings' },
          { source: 'Merci', target: 'ありがとうございます', category: 'greetings' },
          { source: 'Excusez-moi', target: 'すみません', category: 'greetings' },
          { source: 'Où sont les toilettes?', target: 'トイレはどこですか？', category: 'directions' },
          { source: 'Où est la gare?', target: '駅はどこですか？', category: 'directions' },
          { source: 'Combien ça coûte?', target: 'いくらですか？', category: 'shopping' },
          { source: 'Je voudrais ceci', target: 'これをください', category: 'shopping' },
          { source: 'Montrez-moi le menu, s\'il vous plaît', target: 'メニューを見せてください', category: 'dining' },
          { source: 'L\'addition, s\'il vous plaît', target: 'お会計をお願いします', category: 'dining' },
          { source: 'Aidez-moi, s\'il vous plaît', target: '助けてください', category: 'emergency' },
          { source: 'Où est l\'hôpital?', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'hi':
        return [
          { source: 'नमस्ते', target: 'こんにちは', category: 'greetings' },
          { source: 'धन्यवाद', target: 'ありがとうございます', category: 'greetings' },
          { source: 'माफ़ करें', target: 'すみません', category: 'greetings' },
          { source: 'शौचालय कहाँ है?', target: 'トイレはどこですか？', category: 'directions' },
          { source: 'स्टेशन कहाँ है?', target: '駅はどこですか？', category: 'directions' },
          { source: 'यह कितने का है?', target: 'いくらですか？', category: 'shopping' },
          { source: 'मुझे यह चाहिए', target: 'これをください', category: 'shopping' },
          { source: 'कृपया मुझे मेनू दिखाएं', target: 'メニューを見せてください', category: 'dining' },
          { source: 'कृपया बिल दें', target: 'お会計をお願いします', category: 'dining' },
          { source: 'कृपया मेरी मदद करें', target: '助けてください', category: 'emergency' },
          { source: 'अस्पताल कहाँ है?', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'ru':
        return [
          { source: 'Привет', target: 'こんにちは', category: 'greetings' },
          { source: 'Спасибо', target: 'ありがとうございます', category: 'greetings' },
          { source: 'Извините', target: 'すみません', category: 'greetings' },
          { source: 'Где туалет?', target: 'トイレはどこですか？', category: 'directions' },
          { source: 'Где станция?', target: '駅はどこですか？', category: 'directions' },
          { source: 'Сколько это стоит?', target: 'いくらですか？', category: 'shopping' },
          { source: 'Я хочу это', target: 'これをください', category: 'shopping' },
          { source: 'Покажите мне меню, пожалуйста', target: 'メニューを見せてください', category: 'dining' },
          { source: 'Счет, пожалуйста', target: 'お会計をお願いします', category: 'dining' },
          { source: 'Помогите мне, пожалуйста', target: '助けてください', category: 'emergency' },
          { source: 'Где больница?', target: '病院はどこですか？', category: 'emergency' }
        ];
      case 'ar':
        return [
          { source: 'مرحبا', target: 'こんにちは', category: 'greetings' },
          { source: 'شكرا', target: 'ありがとうございます', category: 'greetings' },
          { source: 'عذرا', target: 'すみません', category: 'greetings' },
          { source: 'أين الحمام؟', target: 'トイレはどこですか？', category: 'directions' },
          { source: 'أين المحطة؟', target: '駅はどこですか？', category: 'directions' },
          { source: 'كم يكلف هذا؟', target: 'いくらですか？', category: 'shopping' },
          { source: 'أريد هذا', target: 'これをください', category: 'shopping' },
          { source: 'أرني القائمة من فضلك', target: 'メニューを見せてください', category: 'dining' },
          { source: 'الحساب من فضلك', target: 'お会計をお願いします', category: 'dining' },
          { source: 'ساعدني من فضلك', target: '助けてください', category: 'emergency' },
          { source: 'أين المستشفى؟', target: '病院はどこですか？', category: 'emergency' }
        ];
      default: // Japanese
        return [
          { source: 'こんにちは', target: 'Hello', category: 'greetings' },
          { source: 'ありがとうございます', target: 'Thank you', category: 'greetings' },
          { source: 'すみません', target: 'Excuse me', category: 'greetings' },
          { source: 'トイレはどこですか？', target: 'Where is the bathroom?', category: 'directions' },
          { source: '駅はどこですか？', target: 'Where is the station?', category: 'directions' },
          { source: 'いくらですか？', target: 'How much is it?', category: 'shopping' },
          { source: 'これをください', target: 'I would like this', category: 'shopping' },
          { source: 'メニューを見せてください', target: 'Please show me the menu', category: 'dining' },
          { source: 'お会計をお願いします', target: 'Check, please', category: 'dining' },
          { source: '助けてください', target: 'Please help me', category: 'emergency' },
          { source: '病院はどこですか？', target: 'Where is the hospital?', category: 'emergency' }
        ];
    }
  };

  const commonPhrases = getCommonPhrases();

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <SEOHead
        title={content.title}
        description={content.subtitle}
        keywords={['翻訳', '日本語翻訳', '画像翻訳', '音声翻訳', 'AI翻訳']}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{content.title}</h1>
          <p className="text-lg text-gray-600">{content.subtitle}</p>
        </motion.div>
        
        {/* Return to Dashboard */}
        <motion.div
          className="absolute top-8 left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{content.backToDashboard}</span>
          </button>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { key: 'text', label: content.textMode, icon: Type },
            { key: 'camera', label: content.cameraMode, icon: Camera },
            { key: 'voice', label: content.voiceMode, icon: Mic }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setActiveMode(mode.key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeMode === mode.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <mode.icon className="w-5 h-5" />
              <span>{mode.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Translation Interface */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Language Selection */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'en' ? 'From' :
                 currentLanguage === 'zh' ? '从' :
                 currentLanguage === 'ko' ? '번역 원본' :
                 currentLanguage === 'es' ? 'De' :
                 currentLanguage === 'fr' ? 'De' :
                 currentLanguage === 'hi' ? 'से' :
                 currentLanguage === 'ru' ? 'С' :
                 currentLanguage === 'ar' ? 'من' :
                 currentLanguage === 'id' ? 'Dari' :
                 currentLanguage === 'pt' ? 'De' :
                 currentLanguage === 'th' ? 'จาก' :
                 currentLanguage === 'vi' ? 'Từ' :
                 currentLanguage === 'it' ? 'Da' :
                 '翻訳元'}
              </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            </div>

            <div className="flex justify-center md:px-4">
              <button
                onClick={swapLanguages}
                className="p-3 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title={content.swapLanguages}
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'en' ? 'To' :
                 currentLanguage === 'zh' ? '到' :
                 currentLanguage === 'ko' ? '번역 대상' :
                 currentLanguage === 'es' ? 'A' :
                 currentLanguage === 'fr' ? 'À' :
                 currentLanguage === 'hi' ? 'में' :
                 currentLanguage === 'ru' ? 'На' :
                 currentLanguage === 'ar' ? 'إلى' :
                 currentLanguage === 'id' ? 'Ke' :
                 currentLanguage === 'pt' ? 'Para' :
                 currentLanguage === 'th' ? 'ไป' :
                 currentLanguage === 'vi' ? 'Sang' :
                 currentLanguage === 'it' ? 'A' :
                 '翻訳先'}
              </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            </div>
          </div>

          {/* Translation Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{content.input}</label>
                <div className="flex space-x-2">
                  {activeMode === 'camera' && (
                    <button
                      onClick={handleCameraTranslation}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  {activeMode === 'voice' && (
                    <button
                      onClick={handleVoiceTranslation}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording
                          ? 'text-red-600 bg-red-50'
                          : 'text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeMode === 'text' ? (currentLanguage === 'en' ? 'Enter text...' :
                                         currentLanguage === 'zh' ? '输入文本...' :
                                         currentLanguage === 'ko' ? '텍스트 입력...' :
                                         currentLanguage === 'es' ? 'Ingrese texto...' :
                                         currentLanguage === 'fr' ? 'Entrez le texte...' :
                                         currentLanguage === 'hi' ? 'टेक्स्ट दर्ज करें...' :
                                         currentLanguage === 'ru' ? 'Введите текст...' :
                                         currentLanguage === 'ar' ? 'أدخل النص...' :
                                         currentLanguage === 'id' ? 'Masukkan teks...' :
                                         currentLanguage === 'pt' ? 'Digite o texto...' :
                                         currentLanguage === 'th' ? 'ป้อนข้อความ...' :
                                         currentLanguage === 'vi' ? 'Nhập văn bản...' :
                                         currentLanguage === 'it' ? 'Inserisci testo...' :
                                         'テキストを入力...') :
                  activeMode === 'camera' ? (currentLanguage === 'en' ? 'Press camera button to select image' :
                                           currentLanguage === 'zh' ? '按相机按钮选择图片' :
                                           currentLanguage === 'ko' ? '카메라 버튼을 눌러 이미지 선택' :
                                           currentLanguage === 'es' ? 'Presiona el botón de cámara para seleccionar imagen' :
                                           currentLanguage === 'fr' ? 'Appuyez sur le bouton caméra pour sélectionner l\'image' :
                                           currentLanguage === 'hi' ? 'छवि चुनने के लिए कैमरा बटन दबाएं' :
                                           currentLanguage === 'ru' ? 'Нажмите кнопку камеры для выбора изображения' :
                                           currentLanguage === 'ar' ? 'اضغط على زر الكاميرا لاختيار الصورة' :
                                           currentLanguage === 'id' ? 'Tekan tombol kamera untuk memilih gambar' :
                                           currentLanguage === 'pt' ? 'Pressione o botão da câmera para selecionar imagem' :
                                           currentLanguage === 'th' ? 'กดปุ่มกล้องเพื่อเลือกภาพ' :
                                           currentLanguage === 'vi' ? 'Nhấn nút camera để chọn hình ảnh' :
                                           currentLanguage === 'it' ? 'Premi il pulsante della fotocamera per selezionare l\'immagine' :
                                           'カメラボタンを押して画像を選択') :
                  (currentLanguage === 'en' ? 'Press mic button for voice input' :
                   currentLanguage === 'zh' ? '按麦克风按钮进行语音输入' :
                   currentLanguage === 'ko' ? '마이크 버튼을 눌러 음성 입력' :
                   currentLanguage === 'es' ? 'Presiona el botón del micrófono para entrada de voz' :
                   currentLanguage === 'fr' ? 'Appuyez sur le bouton micro pour l\'entrée vocale' :
                   currentLanguage === 'hi' ? 'आवाज इनपुट के लिए माइक बटन दबाएं' :
                   currentLanguage === 'ru' ? 'Нажмите кнопку микрофона для голосового ввода' :
                   currentLanguage === 'ar' ? 'اضغط على زر الميكروفون للإدخال الصوتي' :
                   currentLanguage === 'id' ? 'Tekan tombol mikrofon untuk input suara' :
                   currentLanguage === 'pt' ? 'Pressione o botão do microfone para entrada de voz' :
                   currentLanguage === 'th' ? 'กดปุ่มไมโครโฟนสำหรับการป้อนเสียง' :
                   currentLanguage === 'vi' ? 'Nhấn nút micro để nhập giọng nói' :
                   currentLanguage === 'it' ? 'Premi il pulsante del microfono per l\'input vocale' :
                   'マイクボタンを押して音声入力')
                }
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={activeMode !== 'text'}
              />
              
             {activeMode === 'camera' && imagePreview && (
  <>
    <div className="mt-4">
      <div className="relative">
        <img
          src={imagePreview}
          alt="Uploaded"
          className="w-full h-auto rounded-xl border border-gray-300"
        />
        {/* Optimization info */}
        {optimizedImage && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {optimizedImage.compressionRatio}% {content.optimizationInfo}
          </div>
        )}
        {isProcessingImage && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="text-white text-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>{content.processingImage}</p>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          setImageFile(null);
          setImagePreview(null);
          setOptimizedImage(null);
        }}
        className="mt-2 text-red-600 hover:text-red-700 text-sm"
      >
        {content.removeImage}
      </button>
    </div>
  </>
)}

              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{inputText.length}/500</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => speakText(inputText, sourceLang)}
                    className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(inputText)}
                    className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{content.output}</label>
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="px-4 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTranslating ? content.translating : content.translate}
                </button>
              </div>
              <div className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 overflow-y-auto">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <p className="text-gray-800">{translatedText}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </motion.div>

        {/* Image Upload Area (when camera mode is active) */}
        {activeMode === 'camera' && !imagePreview && (
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ImageUpload
              onImageSelect={handleOptimizedImageSelect}
              onError={(error) => console.error('Image upload error:', error)}
              maxFiles={1}
              maxSizeKB={300}
              showPreview={false}
            />
            
            {optimizedImage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {content.imageOptimized} ({formatFileSize(optimizedImage.originalSize)} → {formatFileSize(optimizedImage.optimizedSize)})
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Common Phrases */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{content.commonPhrases}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonPhrases.map((phrase, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setInputText(phrase.source);
                  setTranslatedText(phrase.target);
                }}
                className="p-4 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium text-gray-800 mb-1">{phrase.source}</div>
                <div className="text-sm text-gray-600">{phrase.target}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TranslationTool;