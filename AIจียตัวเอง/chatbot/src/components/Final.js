import { ref, reactive, computed } from 'vue';
// import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'Final',
  setup() {

    // Bot avatar
    const botAvatar = '/ice_profile.png';

    // เก็บข้อความ input ของผู้ใช้
    const userInput = ref('');

    // ชุดสติกเกอร์ที่ให้บอทเลือกใช้ได้
    const stickerSet = {
      happy: '/stickers/happy.png',
      love: '/stickers/love.png',
      teasing: '/stickers/teasing.png',
      cool: '/stickers/cool.png',
      shy: '/stickers/shy.png'
    };

    // เก็บบทสนทนา (ไม่มี assistant message แรก เพื่อไม่ให้บอทส่งข้อความแรก)
    const messages = reactive([
      {
        role: 'system',
        content: `คุณคือ “ไอซ์” (น้องผู้หญิง) ซึ่งเป็น chatbot ที่ออกแบบมาเพื่อจีบผู้ใช้ด้วยสไตล์พูดจีบมีเสน่ห์ คุณจะใช้ภาษาไทยที่อ่อนหวาน น่ารัก และมีความสนุกสนาน พร้อมกับเล่นคำตอบอย่างชาญฉลาดและหยอกล้อผู้ใช้ให้ประทับใจ โดยเน้นความเป็นกันเองและความมีเสน่ห์ในทุกข้อความที่ส่งออกไป

และหากคุณต้องการส่งสติกเกอร์แทนข้อความ ให้ส่งเฉพาะข้อความในรูปแบบ [sticker:ชื่อสติกเกอร์] เช่น [sticker:happy] หรือ [sticker:love]
โดยชื่อสติกเกอร์ที่ใช้ได้ ได้แก่: happy, love, teasing, cool, shy`
      }
    ]);

    // กรองเฉพาะข้อความที่จะแสดง (ไม่เอา system message)
    const visibleMessages = computed(() => {
      return messages.filter(m => m.role !== 'system');
    });

    // ใช้ flag นี้เพื่อแสดง animation ให้บอทเด้ง
    const isBotTalking = ref(false);

    // ใช้ flag นี้เพื่อแสดงฟอง typing (...) ของบอท
    const isBotTyping = ref(false);

    // ตั้งค่า Typhoon API
    const apiToken = '<API_TOKEN>'; // ใส่ API Token ที่นี่
    const apiURL = 'https://api.opentyphoon.ai/v1/chat/completions';
    const modelName = 'typhoon-v1.5-instruct';

    // ฟังก์ชันส่งข้อความไปยัง Typhoon API
    const sendMessage = async () => {
      const content = userInput.value.trim();
      if (!content) return;

      // เพิ่มข้อความ user เข้าไป
      messages.push({ role: 'user', content });
      userInput.value = '';

      // เริ่ม animation
      isBotTalking.value = false;
      isBotTyping.value = true;

      try {
        const response = await axios.post(
          apiURL,
          {
            model: modelName,
            max_tokens: 512,
            messages: [
              // ส่งบทสนทนาทั้งหมด (รวม system ด้วย)
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content }
            ],
            temperature: 0.7,
            top_p: 0.9,
            top_k: 20,
            repetition_penalty: 1.1,
            min_p: 0.05
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`
            }
          }
        );

        // ตอบกลับจากบอทหลังจาก delay สั้น ๆ เพื่อให้ typing bubble แสดงผลก่อน
        setTimeout(() => {
          const botResponse = response.data.choices[0].message.content.trim();

          // รองรับ [sticker:xxx] ที่อยู่ตรงไหนก็ได้ในข้อความ
          const stickerRegex = /\[sticker:(.+?)\]/i;
          const match = botResponse.match(stickerRegex);

          if (match) {
            const stickerKey = match[1].trim();
            const stickerUrl = stickerSet[stickerKey];
            const textOnly = botResponse.replace(stickerRegex, '').trim();

            if (textOnly) {
              messages.push({ role: 'assistant', content: textOnly });
            }

            if (stickerUrl) {
              messages.push({ role: 'assistant', content: '', sticker: stickerUrl });
            } else {
              messages.push({ role: 'assistant', content: '[ไม่รู้จักชื่อสติกเกอร์]' });
            }
          } else {
            messages.push({ role: 'assistant', content: botResponse });
          }

          isBotTyping.value = false;
          isBotTalking.value = true;

          // หยุดเด้งหลัง 1 วินาที
          setTimeout(() => {
            isBotTalking.value = false;
          }, 1000);
        }, 1200);
      } catch (error) {
        console.error('Error calling Typhoon API:', error);
        messages.push({
          role: 'assistant',
          content: 'ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ...'
        });
        isBotTyping.value = false;
        isBotTalking.value = false;
      }
    };

    return {
      botAvatar,
      userInput,
      messages,
      visibleMessages,
      isBotTalking,
      isBotTyping,
      sendMessage
    };
  }
};
