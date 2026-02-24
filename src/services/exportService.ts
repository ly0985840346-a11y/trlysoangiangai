import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { LessonPlan } from "../types";
import html2pdf from "html2pdf.js";
import pptxgen from "pptxgenjs";

export const exportToWord = async (plan: LessonPlan) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: plan.title,
            heading: HeadingLevel.TITLE,
            alignment: "center",
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Lĩnh vực phát triển: ", bold: true }),
              new TextRun(plan.developmentField),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Độ tuổi: ", bold: true }),
              new TextRun(plan.ageGroup),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Phương pháp: ", bold: true }),
              new TextRun(plan.method),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: "I. Mục đích - Yêu cầu",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({ children: [new TextRun({ text: "1. Kiến thức", bold: true })] }),
          ...plan.objectives.knowledge.map(k => new Paragraph({ text: `- ${k}` })),
          new Paragraph({ children: [new TextRun({ text: "2. Kỹ năng", bold: true })], spacing: { before: 100 } }),
          ...plan.objectives.skills.map(s => new Paragraph({ text: `- ${s}` })),
          new Paragraph({ children: [new TextRun({ text: "3. Thái độ", bold: true })], spacing: { before: 100 } }),
          ...plan.objectives.attitude.map(a => new Paragraph({ text: `- ${a}` })),
          
          new Paragraph({
            text: "II. Chuẩn bị",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ children: [new TextRun({ text: "1. Đồ dùng của cô", bold: true })] }),
          ...plan.preparation.teacher.map(t => new Paragraph({ text: `- ${t}` })),
          new Paragraph({ children: [new TextRun({ text: "2. Đồ dùng của trẻ", bold: true })], spacing: { before: 100 } }),
          ...plan.preparation.students.map(s => new Paragraph({ text: `- ${s}` })),
          
          new Paragraph({
            text: "III. Tiến trình hoạt động",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Các bước", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hoạt động của cô", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hoạt động của trẻ", bold: true })] })] }),
                ],
              }),
              ...plan.procedure.map(step => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(step.step)] }),
                  new TableCell({ children: step.teacherActivity.split('\n').map(line => new Paragraph(line)) }),
                  new TableCell({ children: step.studentActivity.split('\n').map(line => new Paragraph(line)) }),
                ],
              })),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${plan.title}.docx`);
};

export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin:       10,
    filename:     `${filename}.pdf`,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
  };

  html2pdf().set(opt).from(element).save();
};

export const exportToPPTX = (plan: LessonPlan) => {
  const pres = new pptxgen();

  // Title Slide
  const slide1 = pres.addSlide();
  slide1.addText(plan.title, { x: 1, y: 1.5, w: 8, h: 1, fontSize: 36, bold: true, align: "center", color: "363636" });
  slide1.addText(`Lĩnh vực: ${plan.developmentField}`, { x: 1, y: 3, w: 8, h: 0.5, fontSize: 18, align: "center", color: "666666" });
  slide1.addText(`Độ tuổi: ${plan.ageGroup}`, { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 18, align: "center", color: "666666" });
  slide1.addText(`Phương pháp: ${plan.method}`, { x: 1, y: 4, w: 8, h: 0.5, fontSize: 18, align: "center", color: "666666" });

  // Objectives Slide
  const slide2 = pres.addSlide();
  slide2.addText("I. Mục đích - Yêu cầu", { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true, color: "059669" });
  
  let yPos = 1.2;
  slide2.addText("1. Kiến thức:", { x: 0.5, y: yPos, w: 9, h: 0.3, fontSize: 16, bold: true });
  yPos += 0.3;
  plan.objectives.knowledge.forEach(k => {
    slide2.addText(`• ${k}`, { x: 0.8, y: yPos, w: 8.7, h: 0.3, fontSize: 14 });
    yPos += 0.3;
  });
  
  yPos += 0.2;
  slide2.addText("2. Kỹ năng:", { x: 0.5, y: yPos, w: 9, h: 0.3, fontSize: 16, bold: true });
  yPos += 0.3;
  plan.objectives.skills.forEach(s => {
    slide2.addText(`• ${s}`, { x: 0.8, y: yPos, w: 8.7, h: 0.3, fontSize: 14 });
    yPos += 0.3;
  });

  yPos += 0.2;
  slide2.addText("3. Thái độ:", { x: 0.5, y: yPos, w: 9, h: 0.3, fontSize: 16, bold: true });
  yPos += 0.3;
  plan.objectives.attitude.forEach(a => {
    slide2.addText(`• ${a}`, { x: 0.8, y: yPos, w: 8.7, h: 0.3, fontSize: 14 });
    yPos += 0.3;
  });

  // Preparation Slide
  const slide3 = pres.addSlide();
  slide3.addText("II. Chuẩn bị", { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true, color: "059669" });
  
  slide3.addText("1. Đồ dùng của cô:", { x: 0.5, y: 1.2, w: 9, h: 0.3, fontSize: 16, bold: true });
  let yPosPrep = 1.5;
  plan.preparation.teacher.forEach(t => {
    slide3.addText(`• ${t}`, { x: 0.8, y: yPosPrep, w: 8.7, h: 0.3, fontSize: 14 });
    yPosPrep += 0.3;
  });

  yPosPrep += 0.3;
  slide3.addText("2. Đồ dùng của trẻ:", { x: 0.5, y: yPosPrep, w: 9, h: 0.3, fontSize: 16, bold: true });
  yPosPrep += 0.3;
  plan.preparation.students.forEach(s => {
    slide3.addText(`• ${s}`, { x: 0.8, y: yPosPrep, w: 8.7, h: 0.3, fontSize: 14 });
    yPosPrep += 0.3;
  });

  // Procedure Slides
  plan.procedure.forEach((step, index) => {
    const slide = pres.addSlide();
    slide.addText(`III. Tiến trình - Bước ${index + 1}: ${step.step}`, { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 20, bold: true, color: "059669" });
    
    // Teacher activity
    slide.addText("Hoạt động của cô:", { x: 0.5, y: 1.2, w: 4.25, h: 0.3, fontSize: 16, bold: true, color: "363636" });
    slide.addText(step.teacherActivity, { x: 0.5, y: 1.6, w: 4.25, h: 3.5, fontSize: 14, valign: "top" });
    
    // Student activity
    slide.addText("Hoạt động của trẻ:", { x: 5.25, y: 1.2, w: 4.25, h: 0.3, fontSize: 16, bold: true, color: "363636" });
    slide.addText(step.studentActivity, { x: 5.25, y: 1.6, w: 4.25, h: 3.5, fontSize: 14, valign: "top" });
  });

  pres.writeFile({ fileName: `${plan.title}.pptx` });
};
