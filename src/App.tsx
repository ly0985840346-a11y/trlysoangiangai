import React, { useState } from 'react';
import { LessonPlanFormData, LessonPlan } from './types';
import { generateLessonPlan, reviseLessonPlan } from './services/geminiService';
import { exportToWord, exportToPDF, exportToPPTX } from './services/exportService';
import { Loader2, Sparkles, BookOpen, Send, FileText, CheckCircle2, AlertCircle, File as FileIcon, Presentation, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [formData, setFormData] = useState<LessonPlanFormData>({
    topic: '',
    ageGroup: '4-5 tuổi',
    method: 'STEAM',
    developmentField: 'Phát triển nhận thức',
    teacher: '',
    className: '',
    school: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });

  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) {
      setError('Vui lòng nhập Chủ đề/Tên bài');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const plan = await generateLessonPlan(formData);
      setLessonPlan(plan);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tạo giáo án.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevise = async () => {
    if (!lessonPlan || !feedback.trim()) return;
    setError(null);
    setIsRevising(true);
    try {
      const updatedPlan = await reviseLessonPlan(lessonPlan, feedback);
      setLessonPlan(updatedPlan);
      setFeedback('');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật giáo án.');
    } finally {
      setIsRevising(false);
    }
  };

  const handleExportWord = () => {
    if (lessonPlan) exportToWord(lessonPlan);
  };

  const handleExportPDF = () => {
    if (lessonPlan) exportToPDF('lesson-plan-content', lessonPlan.title);
  };

  const handleExportPPTX = () => {
    if (lessonPlan) exportToPPTX(lessonPlan);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-800">
              EduGen <span className="text-stone-400 font-normal">| Giáo án Mầm non</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-500 font-medium bg-stone-100 px-3 py-1.5 rounded-full">
            <Sparkles size={16} className="text-amber-500" />
            Powered by Gemini 3.1 Pro
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                Thông tin bài dạy
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Chủ đề / Tên bài <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    placeholder="VD: Khám phá quả cam..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Độ tuổi</label>
                    <select
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    >
                      <option value="Nhà trẻ (24-36 tháng)">Nhà trẻ (24-36 tháng)</option>
                      <option value="Mầm (3-4 tuổi)">Mầm (3-4 tuổi)</option>
                      <option value="Chồi (4-5 tuổi)">Chồi (4-5 tuổi)</option>
                      <option value="Lá (5-6 tuổi)">Lá (5-6 tuổi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phương pháp</label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    >
                      <option value="Truyền thống">Truyền thống</option>
                      <option value="STEAM">STEAM</option>
                      <option value="5E">Mô hình 5E</option>
                      <option value="Montessori">Montessori</option>
                      <option value="Reggio Emilia">Reggio Emilia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Lĩnh vực phát triển</label>
                  <select
                    name="developmentField"
                    value={formData.developmentField}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    <option value="Phát triển thể chất">Phát triển thể chất</option>
                    <option value="Phát triển nhận thức">Phát triển nhận thức</option>
                    <option value="Phát triển ngôn ngữ">Phát triển ngôn ngữ</option>
                    <option value="Phát triển TC-KNXH">Phát triển TC-KNXH</option>
                    <option value="Phát triển thẩm mỹ">Phát triển thẩm mỹ</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Giáo viên</label>
                    <input
                      type="text"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Lớp</label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Trường</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Ngày dạy</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Ghi chú thêm</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Yêu cầu đặc biệt, vật liệu có sẵn..."
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang soạn giáo án...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Tạo giáo án
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Result & Feedback */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {lessonPlan ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Lesson Plan Display */}
                  <div className="flex flex-wrap gap-2 justify-end mb-4">
                    <button onClick={handleExportPDF} className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                      <FileIcon size={16} />
                      Tải PDF
                    </button>
                    <button onClick={handleExportWord} className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                      <FileText size={16} />
                      Tải Word
                    </button>
                    <button onClick={handleExportPPTX} className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                      <Presentation size={16} />
                      Giáo án điện tử (PPTX)
                    </button>
                  </div>

                  <div id="lesson-plan-content" className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="bg-stone-50 border-b border-stone-200 p-6 text-center">
                      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{lessonPlan.title}</h2>
                      <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-600">
                        <span className="px-3 py-1 bg-white rounded-full border border-stone-200">Lĩnh vực: {lessonPlan.developmentField}</span>
                        <span className="px-3 py-1 bg-white rounded-full border border-stone-200">Độ tuổi: {lessonPlan.ageGroup}</span>
                        <span className="px-3 py-1 bg-white rounded-full border border-stone-200">Phương pháp: {lessonPlan.method}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-8">
                      {/* Objectives */}
                      <section>
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">I</span>
                          Mục đích - Yêu cầu
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <h4 className="font-medium text-stone-800 mb-2">1. Kiến thức</h4>
                            <ul className="space-y-1.5">
                              {lessonPlan.objectives.knowledge.map((item, i) => (
                                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <h4 className="font-medium text-stone-800 mb-2">2. Kỹ năng</h4>
                            <ul className="space-y-1.5">
                              {lessonPlan.objectives.skills.map((item, i) => (
                                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <h4 className="font-medium text-stone-800 mb-2">3. Thái độ</h4>
                            <ul className="space-y-1.5">
                              {lessonPlan.objectives.attitude.map((item, i) => (
                                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </section>

                      {/* Preparation */}
                      <section>
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">II</span>
                          Chuẩn bị
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-stone-800 mb-2">1. Đồ dùng của cô</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-stone-600">
                              {lessonPlan.preparation.teacher.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-stone-800 mb-2">2. Đồ dùng của trẻ</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-stone-600">
                              {lessonPlan.preparation.students.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </section>

                      {/* Procedure */}
                      <section>
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">III</span>
                          Tiến trình hoạt động
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-stone-100 text-stone-700 text-sm">
                                <th className="p-3 border border-stone-200 font-semibold w-1/4">Các bước</th>
                                <th className="p-3 border border-stone-200 font-semibold w-2/4">Hoạt động của cô</th>
                                <th className="p-3 border border-stone-200 font-semibold w-1/4">Hoạt động của trẻ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lessonPlan.procedure.map((step, i) => (
                                <tr key={i} className="border-b border-stone-200 hover:bg-stone-50 transition-colors">
                                  <td className="p-3 border-r border-stone-200 align-top font-medium text-stone-800 text-sm">{step.step}</td>
                                  <td className="p-3 border-r border-stone-200 align-top text-sm text-stone-600 whitespace-pre-wrap">{step.teacherActivity}</td>
                                  <td className="p-3 align-top text-sm text-stone-600 whitespace-pre-wrap">{step.studentActivity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                    <h3 className="text-md font-semibold text-stone-800 mb-3 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      Tinh chỉnh giáo án
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="VD: Thêm trò chơi vận động ở phần kết thúc, làm rõ hơn phần khám phá..."
                        className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isRevising) {
                            handleRevise();
                          }
                        }}
                      />
                      <button
                        onClick={handleRevise}
                        disabled={isRevising || !feedback.trim()}
                        className="px-6 py-2 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isRevising ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <BookOpen size={32} className="text-stone-300" />
                  </div>
                  <p className="text-lg font-medium text-stone-500">Chưa có giáo án nào</p>
                  <p className="text-sm mt-1">Điền thông tin bên trái và nhấn "Tạo giáo án" để bắt đầu</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
