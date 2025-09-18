import React, { useState, useRef } from "react";
import { z } from "zod";
import { resumeSchema } from "../utils/validation";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";
import { motion, AnimatePresence } from "framer-motion";

// Define schema for PDF file validation
const fileSchema = z
  .instanceof(File, { message: "Файл обязателен" })
  .refine((file) => file.type === "application/pdf", {
    message: "Пожалуйста, загрузите файл в формате PDF",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Размер файла не должен превышать 5MB",
  });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.4 },
  },
};

// Background bubble animation
const bubbleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 0.08,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Form section variants
const formSectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

// Success message variants
const successVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

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
  const [isFormFocused, setIsFormFocused] = useState(false);

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

    // If everything is valid
    if (formResult.success && pdfFile) {
      dispatch(
        addToast({
          message: "Резюме успешно загружено!",
          type: "success",
          duration: 3000,
        })
      );
    }
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
    <motion.div
      className="relative min-h-[80vh] bg-slate-50 pt-6 pb-12 px-4 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-5"
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transitionDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold mb-6 text-gray-800"
          variants={itemVariants}
        >
          Управление резюме
        </motion.h1>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-xl font-semibold mb-4"
            variants={itemVariants}
          >
            Загрузка резюме
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            variants={itemVariants}
          >
            Заполните информацию о себе и загрузите своё резюме в формате PDF.
          </motion.p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            onFocus={() => setIsFormFocused(true)}
            onBlur={() => setIsFormFocused(false)}
          >
            {/* Personal Information Section */}
            <motion.div
              className="border-b pb-6"
              variants={formSectionVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3
                className="text-lg font-medium mb-4 flex items-center"
                variants={itemVariants}
              >
                <span className="bg-blue-100 text-blue-600 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </span>
                Личная информация
              </motion.h3>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-1">Полное имя</label>
                  <motion.input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-1">Телефон</label>
                  <motion.input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-gray-700 mb-1">
                    Желаемая должность
                  </label>
                  <motion.input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.position ? "border-red-500" : ""
                    }`}
                    whileFocus={{ scale: 1.01 }}
                  />
                  <AnimatePresence>
                    {errors.position && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.position}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label className="block text-gray-700 mb-1">Навыки</label>
                <motion.textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 ${
                    errors.skills ? "border-red-500" : ""
                  }`}
                  placeholder="Перечислите ваши основные навыки, разделяя их запятыми"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.skills && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.skills}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label className="block text-gray-700 mb-1">Опыт работы</label>
                <motion.textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 ${
                    errors.experience ? "border-red-500" : ""
                  }`}
                  placeholder="Опишите ваш опыт работы"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {errors.experience && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.experience}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* PDF Upload Section */}
            <motion.div
              variants={formSectionVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3
                className="text-lg font-medium mb-4"
                variants={itemVariants}
              >
                Загрузка PDF-файла резюме
              </motion.h3>

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
            </motion.div>

            {/* Submit Button */}
            <motion.div className="mt-6" variants={itemVariants}>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
              >
                Сохранить резюме
              </button>
            </motion.div>

            {/* Success message */}
            {isSubmitted && Object.keys(errors).length === 0 && (
              <motion.div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={successVariants}
              >
                <p className="font-medium">Резюме успешно загружено!</p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Resume;
