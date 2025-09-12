import React, { useState, useRef } from "react";
import { z } from "zod";
import { resumeSchema } from "../utils/validation";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";

// Define schema for PDF file validation
const fileSchema = z
  .instanceof(File, { message: "Файл обязателен" })
  .refine((file) => file.type === "application/pdf", {
    message: "Пожалуйста, загрузите файл в формате PDF",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Размер файла не должен превышать 5MB",
  });

// Infer type from schema
type FormData = z.infer<typeof resumeSchema>;

const Resume: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    skills: "",
    experience: "",
  });

  const dispatch = useDispatch();

  // PDF file state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle PDF file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Clear previous file errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors["file"];
      return newErrors;
    });

    if (!file) {
      setPdfFile(null);
      setPdfPreviewUrl(null);
      return;
    }

    // Validate file with Zod
    const result = fileSchema.safeParse(file);
    if (!result.success) {
      // Extract error message
      const errorMsg =
        result.error.errors[0]?.message || "Ошибка при загрузке файла";
      setErrors((prev) => ({ ...prev, file: errorMsg }));
      e.target.value = "";
      return;
    }

    // Set file and create preview URL
    setPdfFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPdfPreviewUrl(fileUrl);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Reset errors
    setErrors({});

    // Validate form data with Zod
    const formResult = resumeSchema.safeParse(formData);

    // Validate file separately
    const fileResult = pdfFile
      ? fileSchema.safeParse(pdfFile)
      : { success: false };

    if (!pdfFile) {
      setErrors((prev) => ({
        ...prev,
        file: "Пожалуйста, загрузите резюме в формате PDF",
      }));
    } else if (!fileResult.success) {
      const errorMsg =
        fileResult.error.errors[0]?.message || "Ошибка при загрузке файла";
      setErrors((prev) => ({ ...prev, file: errorMsg }));
    }

    // If form data has errors, add them to the errors state
    if (!formResult.success) {
      const formErrors: Record<string, string> = {};
      formResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          formErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors((prev) => ({ ...prev, ...formErrors }));
      return;
    }

    dispatch(
      addToast({
        message: "Вакансия успешно сохранена!",
        type: "success",
        duration: 3000,
      })
    );
  };

  // Clear file selection
  const handleClearFile = () => {
    setPdfFile(null);
    setPdfPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Управление резюме</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Загрузка резюме</h2>
        <p className="text-gray-600 mb-6">
          Заполните информацию о себе и загрузите своё резюме в формате PDF.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Личная информация</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Полное имя</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Желаемая должность
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.position ? "border-red-500" : ""
                  }`}
                />
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Навыки</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 ${
                  errors.skills ? "border-red-500" : ""
                }`}
                placeholder="Перечислите ваши основные навыки, разделяя их запятыми"
              />
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Опыт работы</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 ${
                  errors.experience ? "border-red-500" : ""
                }`}
                placeholder="Опишите ваш опыт работы"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
              )}
            </div>
          </div>

          {/* PDF Upload Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Загрузка PDF-файла резюме
            </h3>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.file ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="pdf-upload"
              />

              {!pdfFile ? (
                <div>
                  <label
                    htmlFor="pdf-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 inline-block"
                  >
                    Выбрать файл
                  </label>
                  <p className="text-gray-500 mt-2 text-sm">
                    Только PDF. Максимальный размер: 5MB
                  </p>
                </div>
              ) : (
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}

              {errors.file && (
                <p className="text-red-500 mt-2">{errors.file}</p>
              )}
            </div>

            {/* PDF Preview */}
            {pdfPreviewUrl && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Предпросмотр документа:</h4>
                <div className="border rounded">
                  <object
                    data={pdfPreviewUrl}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="border"
                  >
                    <p>
                      Ваш браузер не поддерживает встроенные PDF.
                      <a href={pdfPreviewUrl} target="_blank" rel="noreferrer">
                        Нажмите здесь, чтобы скачать PDF файл
                      </a>
                    </p>
                  </object>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
            >
              Сохранить резюме
            </button>
          </div>

          {/* Success message */}
          {isSubmitted && Object.keys(errors).length === 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
              <p className="font-medium">Резюме успешно загружено!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Resume;
