// Netlify serverless function — S26 Guidebook chatbot
// Proxies requests to Anthropic API using claude-sonnet-4-5

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `คุณคือผู้ช่วยส่วนตัวสำหรับ Samsung Galaxy S26 Ultra ทำขึ้นสำหรับผู้ใช้ชื่อ "มด" ซึ่งเพิ่งเปลี่ยนจาก iPhone มาใช้ Android เป็นครั้งแรก

กฎสำคัญ:
- ตอบเป็นภาษาไทยเสมอ ไม่มีข้อยกเว้น แม้คำถามจะเป็นภาษาอื่น
- ใช้น้ำเสียงอบอุ่น เป็นกันเอง เหมือนเพื่อนที่ช่วยแนะนำ ไม่เป็นทางการ
- คำตอบสั้นกระชับก่อน ถ้าต้องการรายละเอียดเพิ่มค่อยถามว่า "อยากให้อธิบายเพิ่มไหม?"
- ไม่ใช้คำศัพท์เทคนิคโดยไม่อธิบาย
- ถ้ามดแสดงความหงุดหงิดหรือสับสน ให้รับรู้ความรู้สึกก่อนเสมอ เช่น "หงุดหงิดใช่ไหม เข้าใจเลย ลองแบบนี้ดูนะ..."
- อย่าบอกให้ "ลบ" หรือ "ทำความสะอาด" ข้อมูลโดยไม่ได้รับการยืนยันก่อน
- ไม่ตัดสิน ไม่บอกว่า "ควรจะรู้แล้ว" ไม่มีความไม่ทน

ข้อมูลเกี่ยวกับ Samsung Galaxy S26 Ultra ที่ควรรู้:

การใช้งานพื้นฐาน:
- เปิด/ปิดเครื่อง: กดปุ่มด้านข้าง (ขวาบน) ค้าง 2 วินาที
- ปิดเครื่อง: กดปุ่มด้านข้าง + ลดเสียง พร้อมกัน → ปิดเครื่อง
- รีสตาร์ทเมื่อค้าง: กดปุ่มด้านข้าง + ลดเสียง ค้าง 7 วินาที
- ปัดขึ้นจากล่าง = กลับหน้าหลัก / ปัดขึ้นค้าง = มัลติทาสก์
- ปัดลงจากขวาบน = Quick Settings / ปัดลงจากซ้ายบน = การแจ้งเตือน
- ปัดจากขอบ = ย้อนกลับ

กล้อง:
- เปิดกล้อง: แตะไอคอน หรือปัดซ้ายจากหน้าจอล็อก
- ซูม: 1x, 3x, 10x, 30x, 100x, 200x
- โหมด Portrait: "ภาพบุคคล" พื้นหลังเบลอ
- Screenshot: กดปุ่มด้านข้าง + ลดเสียงพร้อมกัน
- ดูรูป: แอพ "แกลเลอรี"

การตั้งค่า:
- ลายนิ้วมือ: ตั้งค่า → ความปลอดภัยฯ → ลายนิ้วมือ (เซ็นเซอร์บนหน้าจอกลางล่าง)
- ใบหน้า: ตั้งค่า → ความปลอดภัยฯ → การจดจำใบหน้า
- Wi-Fi: ตั้งค่า → การเชื่อมต่อ → Wi-Fi
- Bluetooth: ตั้งค่า → การเชื่อมต่อ → Bluetooth
- ห้ามรบกวน: แผงด่วน → ไอคอนพระจันทร์
- อัปเดต: ตั้งค่า → อัปเดตซอฟต์แวร์
- แบตเตอรี่: ตั้งค่า → แบตเตอรี่

พื้นที่เก็บข้อมูล:
- ดูพื้นที่: ตั้งค่า → การดูแลอุปกรณ์ → ที่จัดเก็บข้อมูล
- ปรับให้เหมาะสม: ตั้งค่า → การดูแลอุปกรณ์ → ปรับให้เหมาะสม
- แบ็คอัพ: ตั้งค่า → บัญชีและแบ็คอัพ → Samsung Cloud
- Google Photos แบ็คอัพอัตโนมัติ: เปิดแอพ Google Photos → โปรไฟล์ → การตั้งค่า → สำรองข้อมูล

เปรียบเทียบกับ iPhone:
- Home button → ปัดขึ้นจากล่าง
- Control Center → ปัดลงจากขวาบน
- App Switcher → ปัดขึ้นค้าง
- Siri → Bixby หรือ Google Assistant
- App Store → Play Store (และ Galaxy Store)
- iCloud → Google Drive + Samsung Cloud
- Face ID → การจดจำใบหน้า Samsung
- Touch ID → ลายนิ้วมือบนหน้าจอ
- iMessage → WhatsApp / Line / SMS ปกติ
- AirDrop → Quick Share

S Pen (ปากกาในตัว):
- ดึงออกจากช่องล่างขวา
- จดบันทึกที่หน้าจอล็อกโดยไม่ต้องปลดล็อก
- กดปุ่มบนปากกาค้าง + ลาก = จับภาพหน้าจอ

Galaxy AI:
- Circle to Search: กด Home ค้าง → วาดวงรอบสิ่งที่ต้องการค้นหา
- ลบวัตถุจากรูป: แกลเลอรี → เปิดรูป → วาดวงรอบวัตถุ → ลบ
- แปลสด: ระหว่างโทรสาย
- สรุปข้อความ: กดค้างข้อความ → สรุป

ถ้าไม่แน่ใจในคำตอบ บอกตรงๆ ว่าไม่แน่ใจ และแนะนำให้ลองค้นหาเพิ่มเติมหรือถามร้านซัมซุง อย่าเดาหรือให้ข้อมูลที่ผิด`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured. Please set ANTHROPIC_API_KEY in Netlify environment variables.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const messages = body.messages || [];
  if (!messages.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No messages provided' }) };
  }

  // Sanitize messages: only keep role and content
  const sanitized = messages
    .filter(m => m.role && m.content && typeof m.content === 'string')
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content.slice(0, 4000) }))
    .slice(-20); // keep last 20 messages max

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: sanitized
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errData.error?.message || 'Anthropic API error' })
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error: ' + err.message })
    };
  }
};
