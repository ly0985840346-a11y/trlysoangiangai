import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan, LessonPlanFormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    ageGroup: { type: Type.STRING },
    method: { type: Type.STRING },
    developmentField: { type: Type.STRING },
    objectives: {
      type: Type.OBJECT,
      properties: {
        knowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        attitude: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    preparation: {
      type: Type.OBJECT,
      properties: {
        teacher: { type: Type.ARRAY, items: { type: Type.STRING } },
        students: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    procedure: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING },
          teacherActivity: { type: Type.STRING },
          studentActivity: { type: Type.STRING }
        }
      }
    }
  }
};

const systemInstruction = `Bạn là một Chuyên gia Tư vấn Giáo dục Mầm non cao cấp tại Việt Nam. 
Nhiệm vụ của bạn là soạn thảo giáo án chi tiết cho giáo viên mầm non.
QUY TẮC NỘI DUNG:
1. Ngôn ngữ tiếng Việt chuẩn sư phạm mầm non.
2. Mục tiêu phải đo lường được.
3. Tiến trình phải chi tiết, sáng tạo, lấy trẻ làm trung tâm.
4. Tích hợp đúng phương pháp người dùng yêu cầu (STEAM, 5E, Montessori, v.v.).`;

export async function generateLessonPlan(data: LessonPlanFormData): Promise<LessonPlan> {
  const prompt = `Hãy soạn giáo án mầm non với thông tin sau:
- Chủ đề/Tên bài: ${data.topic}
- Độ tuổi: ${data.ageGroup}
- Phương pháp: ${data.method}
- Lĩnh vực phát triển: ${data.developmentField}
- Giáo viên: ${data.teacher}
- Lớp: ${data.className}
- Trường: ${data.school}
- Ngày dạy: ${data.date}
- Địa điểm (Xã/Thành phố): ${data.location}
- Ghi chú thêm: ${data.notes}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: lessonPlanSchema,
      temperature: 0.7,
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as LessonPlan;
}

export async function reviseLessonPlan(currentPlan: LessonPlan, feedback: string): Promise<LessonPlan> {
  const prompt = `Dưới đây là giáo án hiện tại:
${JSON.stringify(currentPlan, null, 2)}

Người dùng muốn điều chỉnh như sau: "${feedback}"

Hãy cập nhật giáo án dựa trên yêu cầu trên và trả về định dạng JSON đầy đủ.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: lessonPlanSchema,
      temperature: 0.7,
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as LessonPlan;
}
