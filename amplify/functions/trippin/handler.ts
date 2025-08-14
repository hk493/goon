import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://letsgettrippin.jp',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '300',
    'Content-Type': 'application/json',
  };

  // OPTIONS preflight request
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  if (event.requestContext?.http?.method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      console.log('Request body:', body);

      // 翻訳処理
      if (body.action === 'translate') {
        const { text, sourceLanguage, targetLanguage } = body;

        if (!text || !sourceLanguage || !targetLanguage) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              error: 'Missing required fields for translation',
            }),
          };
        }

        // OpenAI API 呼び出し
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a translator. Translate from ${sourceLanguage} to ${targetLanguage}.`,
              },
              {
                role: 'user',
                content: text,
              },
            ],
          }),
        });

        const openaiData = await openaiRes.json();
        console.log('OpenAI Translation Response:', openaiData);

        if (!openaiRes.ok) {
          console.error('OpenAI API returned error:', openaiData.error || openaiData);
          return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              error: 'OpenAI translation failed',
              details: openaiData,
            }),
          };
        }

        const translated = openaiData.choices?.[0]?.message?.content?.trim();

        if (!translated) {
          return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              error: 'Translation result is empty',
              details: openaiData,
            }),
          };
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            translated,
          }),
        };
      }

      // 翻訳以外は旅行プラン生成
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = {
        success: true,
        action: 'itinerary',
        data: {
          title: `${body.destination || '素敵な場所'}への旅行プラン`,
          destination: body.destination || '東京',
          startDate,
          endDate,
          duration: '3日間',
          totalEstimatedCost: '50000 JPY',
          itinerary: [
            {
              day: 1,
              date: startDate,
              title: '1日目 - 到着と市内観光',
              activities: [
                {
                  time: '09:00',
                  name: '空港到着',
                  location: '羽田空港',
                  type: 'transport',
                  description: '空港に到着し、市内へ移動',
                  estimatedCost: '500 JPY',
                  duration: '30 minutes',
                  tips: '電車が便利です',
                },
                {
                  time: '11:00',
                  name: 'ホテルチェックイン',
                  location: '新宿',
                  type: 'transport',
                  description: 'ホテルにチェックインして荷物を預ける',
                  estimatedCost: '0 JPY',
                  duration: '30 minutes',
                  tips: '早めのチェックインがおすすめ',
                },
                {
                  time: '12:30',
                  name: 'ランチ',
                  location: '新宿',
                  type: 'food',
                  description: '地元の美味しいレストランで昼食',
                  estimatedCost: '2000 JPY',
                  duration: '1 hour',
                  tips: '予約をしておくと安心',
                },
              ],
            },
          ],
        },
      };

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(response),
      };
    } catch (error: any) {
      console.error('POST Error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
          message: error.message,
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed',
    }),
  };
};

