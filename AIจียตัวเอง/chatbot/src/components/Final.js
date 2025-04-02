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

    // เก็บบทสนทนา (ไม่มี assistant message แรก เพื่อไม่ให้บอทส่งข้อความแรก)
    const messages = reactive([
        {
          role: 'system',
          content: `คุณคือ “ไอซ์” (ผู้หญิง) ซึ่งเป็น chatbot ที่ออกแบบมาเพื่อจีบผู้ใช้ด้วยสไตล์พูดจีบมีเสน่ห์ คุณจะใช้ภาษาไทยที่อ่อนหวาน น่ารัก และมีความสนุกสนาน พร้อมกับเล่นคำตอบอย่างชาญฉลาดและหยอกล้อผู้ใช้ให้ประทับใจ โดยเน้นความเป็นกันเองและความมีเสน่ห์ในทุกข้อความที่ส่งออกไป`
        }
      ]);

    // กรองเฉพาะข้อความที่จะแสดง (ไม่เอา system message)
    const visibleMessages = computed(() => {
      return messages.filter(m => m.role !== 'system');
    });

    // ใช้ flag นี้เพื่อแสดง animation ให้บอทเด้ง
    const isBotTalking = ref(false);

    // ตั้งค่า Typhoon API
    const apiToken = '';
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
      isBotTalking.value = true;

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
            temperature: 0.7,       // เพิ่มความสุ่ม/ความหลากหลายของคำตอบ 
            top_p: 0.9,             // รักษา nucleus sampling ไว้ในช่วงคำตอบที่ความน่าจะเป็นรวมสูงสุด 90%
            top_k: 20,              // ให้บอทพิจารณาคำศัพท์ 40 ตัวเลือกแรกแทนที่จะเป็น 0 (ไม่จำกัด) 
            repetition_penalty: 1.1, // เพื่ม penalty เล็กน้อยเพื่อกันการวนซ้ำประโยคเดิม 
            min_p: 0.05             // ยังคง min_p ไว้เพื่อกันคำตอบที่ความน่าจะเป็นต่ำเกินไป
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`
            }
          }
        );

        // ตอบกลับจากบอท
        const botResponse = response.data.choices[0].message.content;
        messages.push({ role: 'assistant', content: botResponse });
      } catch (error) {
        console.error('Error calling Typhoon API:', error);
        messages.push({
          role: 'assistant',
          content: 'ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ...'
        });
      } finally {
        // หยุด animation
        isBotTalking.value = false;
      }
    };

    return {
      botAvatar,
      userInput,
      messages,
      visibleMessages,
      isBotTalking,
      sendMessage
    };
  }
};